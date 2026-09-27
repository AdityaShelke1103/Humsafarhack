"""
normalizer/normalizer.py

Owner: Person 4 (Orchestrator)

Turns a raw natural-language query into a normalized
(service, jurisdiction) pair, or flags that clarification is needed
(spec section 9, Step 1).

Approach:
1. Fast, free keyword matching first across 30+ services and all 36 Indian States/UTs.
2. If keyword matching cannot determine service or jurisdiction, a lightweight LLM
   (Groq / Gemini) fallback parses natural language intent.
"""

import logging
import re
from typing import Optional, Tuple

from schemas.models import ClarificationNeeded

logger = logging.getLogger("humsafar.normalizer")


# ============================================================
# SERVICE KEYWORDS
# Map any phrase that might appear in a user query -> normalized
# service key.
# ============================================================

SERVICE_KEYWORDS = {
    # Certificates
    "domicile certificate": "domicile_certificate",
    "domicile proof": "domicile_certificate",
    "domicile": "domicile_certificate",
    "income certificate": "income_certificate",
    "income proof": "income_certificate",
    "caste certificate": "caste_certificate",
    "caste validity": "caste_certificate",
    "caste proof": "caste_certificate",
    "caste": "caste_certificate",
    "birth certificate": "birth_certificate",
    "birth proof": "birth_certificate",
    "death certificate": "death_certificate",
    "death proof": "death_certificate",
    "marriage certificate": "marriage_certificate",
    "marriage registration": "marriage_certificate",
    "court marriage": "marriage_certificate",
    "non creamy layer": "non_creamy_layer_certificate",
    "ncl certificate": "non_creamy_layer_certificate",
    "obc ncl": "non_creamy_layer_certificate",
    "obc certificate": "non_creamy_layer_certificate",
    "ews certificate": "ews_certificate",
    "economically weaker section": "ews_certificate",
    "legal heir certificate": "legal_heir_certificate",
    "legal heir": "legal_heir_certificate",
    "surviving member certificate": "legal_heir_certificate",
    "varisai": "legal_heir_certificate",
    "character certificate": "character_certificate",
    "police clearance": "police_clearance_certificate",
    "police verification": "police_clearance_certificate",
    "pcc": "police_clearance_certificate",
    "disability certificate": "disability_certificate",
    "handicapped certificate": "disability_certificate",
    "udid card": "disability_certificate",
    "udid": "disability_certificate",
    "senior citizen card": "senior_citizen_certificate",
    "senior citizen certificate": "senior_citizen_certificate",

    # Identity & Registration Documents
    "aadhaar address": "aadhaar_address_update",
    "aadhar address": "aadhaar_address_update",
    "address change": "aadhaar_address_update",
    "address update": "aadhaar_address_update",
    "aadhaar update": "aadhaar_address_update",
    "aadhar update": "aadhaar_address_update",
    "pan card": "pan_card",
    "new pan": "pan_card",
    "pan application": "pan_card",
    "pan update": "pan_card",
    "pan": "pan_card",
    "passport": "passport",
    "tatkal passport": "passport",
    "fresh passport": "passport",
    "passport renewal": "passport",
    "reissue passport": "passport",
    "voter id": "voter_id",
    "epic card": "voter_id",
    "voter card": "voter_id",
    "election card": "voter_id",
    "voter registration": "voter_id",
    "ration card": "ration_card",
    "bpl card": "ration_card",
    "ration": "ration_card",

    # Transport & Licenses
    "driving license": "driving_license",
    "driving licence": "driving_license",
    "learner license": "driving_license",
    "learner licence": "driving_license",
    "vehicle registration": "vehicle_registration",
    "rc transfer": "vehicle_registration",
    "rc book": "vehicle_registration",
    "vehicle rc": "vehicle_registration",
    "trade license": "trade_license",
    "gumasta license": "trade_license",
    "gumasta": "trade_license",
    "shop act license": "trade_license",
    "shop act": "trade_license",

    # Land & Utilities
    "land record": "land_records",
    "land records": "land_records",
    "7/12": "land_records",
    "satbara": "land_records",
    "khata certificate": "land_records",
    "khata": "land_records",
    "patta": "land_records",
    "jamabandi": "land_records",
    "encumbrance certificate": "encumbrance_certificate",
    "ec certificate": "encumbrance_certificate",
    "electricity connection": "electricity_connection",
    "new power connection": "electricity_connection",
    "water connection": "water_connection",
    "new water connection": "water_connection",
}


# ============================================================
# JURISDICTION KEYWORDS
# All 28 Indian States + 8 Union Territories + Major Cities
# ============================================================

JURISDICTION_KEYWORDS = {
    # 28 States
    "andhra pradesh": "Andhra Pradesh",
    "arunachal pradesh": "Arunachal Pradesh",
    "assam": "Assam",
    "bihar": "Bihar",
    "chhattisgarh": "Chhattisgarh",
    "goa": "Goa",
    "gujarat": "Gujarat",
    "haryana": "Haryana",
    "himachal pradesh": "Himachal Pradesh",
    "jharkhand": "Jharkhand",
    "karnataka": "Karnataka",
    "kerala": "Kerala",
    "madhya pradesh": "Madhya Pradesh",
    "maharashtra": "Maharashtra",
    "manipur": "Manipur",
    "meghalaya": "Meghalaya",
    "mizoram": "Mizoram",
    "nagaland": "Nagaland",
    "odisha": "Odisha",
    "orissa": "Odisha",
    "punjab": "Punjab",
    "rajasthan": "Rajasthan",
    "sikkim": "Sikkim",
    "tamil nadu": "Tamil Nadu",
    "tamilnadu": "Tamil Nadu",
    "telangana": "Telangana",
    "tripura": "Tripura",
    "uttar pradesh": "Uttar Pradesh",
    "uttarakhand": "Uttarakhand",
    "uttaranchal": "Uttarakhand",
    "west bengal": "West Bengal",

    # 8 Union Territories
    "andaman and nicobar": "Andaman and Nicobar Islands",
    "chandigarh": "Chandigarh",
    "dadra and nagar haveli": "Dadra and Nagar Haveli and Daman and Diu",
    "daman and diu": "Dadra and Nagar Haveli and Daman and Diu",
    "delhi": "Delhi",
    "new delhi": "Delhi",
    "jammu and kashmir": "Jammu and Kashmir",
    "j&k": "Jammu and Kashmir",
    "ladakh": "Ladakh",
    "lakshadweep": "Lakshadweep",
    "puducherry": "Puducherry",
    "pondicherry": "Puducherry",

    # Central / National
    "india": "Central / India",
    "central": "Central / India",
    "national": "Central / India",

    # Major Cities mapped to their respective States
    "mumbai": "Maharashtra",
    "pune": "Maharashtra",
    "nagpur": "Maharashtra",
    "thane": "Maharashtra",
    "nashik": "Maharashtra",
    "ahmedabad": "Gujarat",
    "surat": "Gujarat",
    "vadodara": "Gujarat",
    "rajkot": "Gujarat",
    "bangalore": "Karnataka",
    "bengaluru": "Karnataka",
    "mysore": "Karnataka",
    "chennai": "Tamil Nadu",
    "coimbatore": "Tamil Nadu",
    "madurai": "Tamil Nadu",
    "hyderabad": "Telangana",
    "kolkata": "West Bengal",
    "jaipur": "Rajasthan",
    "jodhpur": "Rajasthan",
    "lucknow": "Uttar Pradesh",
    "kanpur": "Uttar Pradesh",
    "noida": "Uttar Pradesh",
    "ghaziabad": "Uttar Pradesh",
    "varanasi": "Uttar Pradesh",
    "patna": "Bihar",
    "gaya": "Bihar",
    "ranchi": "Jharkhand",
    "bhopal": "Madhya Pradesh",
    "indore": "Madhya Pradesh",
    "guwahati": "Assam",
    "kochi": "Kerala",
    "thiruvananthapuram": "Kerala",
    "trivandrum": "Kerala",
    "dehradun": "Uttarakhand",
    "shimla": "Himachal Pradesh",
    "bhubaneswar": "Odisha",
    "raipur": "Chhattisgarh",
}


def _match_keyword(text: str, keyword_map: dict) -> Optional[str]:
    """
    Return the normalized value for the first keyword found in text,
    checking longer keywords first so multi-word phrases match before
    any shorter substring could.
    """
    text_lower = text.lower()
    for keyword in sorted(keyword_map.keys(), key=len, reverse=True):
        pattern = r"\b" + re.escape(keyword) + r"\b"
        if re.search(pattern, text_lower):
            return keyword_map[keyword]
    return None


def _llm_normalize_fallback(query: str) -> Tuple[Optional[str], Optional[str]]:
    """
    Intelligent fallback using Groq / Gemini when keyword matching fails.
    Extracts the civic service identifier and Indian jurisdiction from natural language.
    """
    try:
        from llm_service.provider import call_llm

        system_prompt = (
            "You are an intent extraction component for Humsafar, an Indian civic procedure navigator.\n"
            "Given a citizen's natural language request, extract:\n"
            "1. 'service': A standard lowercase snake_case name of the civic/government service "
            "(e.g., 'pan_card', 'passport', 'divorce_decree', 'marriage_registration', 'land_records', "
            "'caste_certificate', 'birth_certificate', 'pf_withdrawal', 'trade_license', etc.). "
            "If the query is completely unintelligible or not asking for a civic/government procedure, return null.\n"
            "2. 'jurisdiction': The Indian state, union territory, or city mentioned in Title Case (e.g. 'Tamil Nadu', 'Bihar', 'Delhi'). "
            "If the service is an Indian Central/National service (such as PAN Card, Passport, EPFO, OCI) and no specific state is required, "
            "or if the user asks across India, return 'Central / India'. If the jurisdiction cannot be determined at all, return null.\n"
            "Respond ONLY with valid JSON in this exact structure: {\"service\": string or null, \"jurisdiction\": string or null}"
        )
        user_prompt = f"User Query: {query}"
        data = call_llm(system_prompt, user_prompt)
        svc = data.get("service")
        jur = data.get("jurisdiction")
        clean_svc = str(svc).strip().lower().replace(" ", "_") if svc and isinstance(svc, str) else None
        clean_jur = str(jur).strip() if jur and isinstance(jur, str) else None
        logger.info(f"LLM normalization fallback extracted: service={clean_svc}, jurisdiction={clean_jur}")
        return clean_svc, clean_jur
    except Exception as exc:
        logger.warning(f"LLM normalization fallback error: {exc}")
        return None, None


def normalize_request(
    query: str,
    service_hint: Optional[str] = None,
    jurisdiction_hint: Optional[str] = None,
) -> Tuple[Optional[str], Optional[str], Optional[ClarificationNeeded]]:
    """
    Returns (service, jurisdiction, clarification_needed).

    Workflow:
    1. Attempt fast keyword matching.
    2. If service or jurisdiction is missing, fall back to Groq/Gemini LLM intent extraction.
    3. If still missing, return a polite clarification request.
    """
    service = service_hint or _match_keyword(query, SERVICE_KEYWORDS)
    jurisdiction = jurisdiction_hint or _match_keyword(query, JURISDICTION_KEYWORDS)

    # Step 2: Fallback to LLM if keyword matching did not catch both
    if not service or not jurisdiction:
        llm_service, llm_jurisdiction = _llm_normalize_fallback(query)
        if not service and llm_service:
            service = llm_service
        if not jurisdiction and llm_jurisdiction:
            jurisdiction = llm_jurisdiction

    if not service:
        return None, jurisdiction, ClarificationNeeded(
            reason="Could not identify which government service this request is for.",
            missing_field="service",
            prompt_to_user=(
                "Which service do you need help with? "
                "(e.g. domicile certificate, income certificate, PAN card, "
                "passport, caste certificate, birth certificate, driving license)"
            ),
        )

    if not jurisdiction:
        return service, None, ClarificationNeeded(
            reason="Jurisdiction could not be determined from the query.",
            missing_field="jurisdiction",
            prompt_to_user="Which state or city is this for?",
        )

    return service, jurisdiction, None