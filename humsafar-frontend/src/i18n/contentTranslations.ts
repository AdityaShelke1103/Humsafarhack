import type { Language } from './LanguageContext';

const contentTranslations: Record<Exclude<Language, 'en'>, Record<string, string>> = {
  hi: {
    'Income Certificate — Maharashtra': 'आय प्रमाणपत्र — महाराष्ट्र',
    'Official procedure for income certificate in Maharashtra, structured from verified government sources.': 'महाराष्ट्र में आय प्रमाणपत्र की आधिकारिक प्रक्रिया, सत्यापित सरकारी स्रोतों से तैयार।',
    'District Satara Office': 'जिला सातारा कार्यालय',
    '4 sequential steps': '4 क्रमिक चरण',
    'Not specified by official sources': 'आधिकारिक स्रोतों में निर्दिष्ट नहीं',
    'Self-Declaration': 'स्व-घोषणा',
    'Self-Declaration as required by the Government of Maharashtra': 'महाराष्ट्र सरकार के अनुसार स्व-घोषणा',
    'PAN Card': 'पैन कार्ड',
    Passport: 'पासपोर्ट',
    'RSBY Card': 'आरएसबीवाई कार्ड',
    'Aadhaar Card': 'आधार कार्ड',
    'Proof of Identity (any one)': 'पहचान प्रमाण (कोई एक)',
    'Verified recently': 'हाल ही में सत्यापित',
    '4 mandatory + 1 optional': '4 अनिवार्य + 1 वैकल्पिक',
    'Revenue Department': 'राजस्व विभाग',
    'Government Department': 'सरकारी विभाग',
    'Online': 'ऑनलाइन',
    Office: 'कार्यालय',
    'Self-preparation': 'स्वयं तैयारी',
  },
  mr: {
    'Income Certificate — Maharashtra': 'उत्पन्न प्रमाणपत्र — महाराष्ट्र',
    'Official procedure for income certificate in Maharashtra, structured from verified government sources.': 'महाराष्ट्रातील उत्पन्न प्रमाणपत्राची अधिकृत प्रक्रिया, पडताळलेल्या सरकारी स्रोतांवर आधारित।',
    'District Satara Office': 'जिल्हा सातारा कार्यालय',
    '4 sequential steps': '4 क्रमिक टप्पे',
    'Not specified by official sources': 'अधिकृत स्रोतांमध्ये नमूद नाही',
    'Self-Declaration': 'स्वयंघोषणा',
    'Self-Declaration as required by the Government of Maharashtra': 'महाराष्ट्र शासनानुसार स्वयंघोषणा',
    'PAN Card': 'पॅन कार्ड',
    Passport: 'पासपोर्ट',
    'RSBY Card': 'आरएसबीवाय कार्ड',
    'Aadhaar Card': 'आधार कार्ड',
    'Proof of Identity (any one)': 'ओळखीचा पुरावा (कोणताही एक)',
    'Verified recently': 'अलीकडे पडताळलेले',
    '4 mandatory + 1 optional': '4 अनिवार्य + 1 पर्यायी',
    'Revenue Department': 'महसूल विभाग',
    'Government Department': 'सरकारी विभाग',
    'Online': 'ऑनलाइन',
    Office: 'कार्यालय',
    'Self-preparation': 'स्वतःची तयारी',
  },
};

export function translateContent(value: string | undefined | null, language: Language): string {
  if (!value || language === 'en') return value ?? '';
  return contentTranslations[language][value] ?? value;
}
