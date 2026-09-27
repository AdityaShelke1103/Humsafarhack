import { useState, useEffect } from 'react';
import { ExternalLink, RotateCcw } from 'lucide-react';
import { Traveller } from '@/components/Traveller';
import { AppHeader, StampSeal } from '@/components/Brand';
import { RouteBackdrop } from '@/components/RouteBackdrop';
import { TicketFrame } from '@/components/TicketFrame';
import { CornerBrackets } from '@/components/CornerBrackets';
import type { Journey } from '@/data/journeyData';
import { useLanguage } from '@/i18n/LanguageContext';
import { translateContent } from '@/i18n/contentTranslations';

interface CompleteScreenProps {
journey: Journey | null;
onRestart: () => void;
}

// 14 lightweight CSS confetti particles for completion moment (Requirement 6)
const confettiParticles = [
{ id: 1, x: '-65px', y: '-75px', r: '45deg', color: 'bg-saffron-500', size: 'h-2 w-2' },
{ id: 2, x: '55px', y: '-80px', r: '-35deg', color: 'bg-teal-500', size: 'h-2 w-1.5' },
{ id: 3, x: '-90px', y: '-30px', r: '60deg', color: 'bg-saffron-400', size: 'h-1.5 w-3' },
{ id: 4, x: '80px', y: '-40px', r: '-50deg', color: 'bg-teal-400', size: 'h-2 w-2' },
{ id: 5, x: '-40px', y: '-100px', r: '25deg', color: 'bg-saffron-600', size: 'h-2.5 w-2' },
{ id: 6, x: '35px', y: '-105px', r: '-20deg', color: 'bg-teal-600', size: 'h-1.5 w-2.5' },
{ id: 7, x: '-105px', y: '15px', r: '80deg', color: 'bg-ink-800 dark:bg-cream-100', size: 'h-2 w-2' },
{ id: 8, x: '95px', y: '20px', r: '-75deg', color: 'bg-saffron-500', size: 'h-2.5 w-1.5' },
{ id: 9, x: '-65px', y: '50px', r: '30deg', color: 'bg-teal-500', size: 'h-1.5 w-2' },
{ id: 10, x: '60px', y: '55px', r: '-40deg', color: 'bg-saffron-400', size: 'h-2 w-2' },
{ id: 11, x: '-15px', y: '-85px', r: '15deg', color: 'bg-teal-300', size: 'h-2 w-1.5' },
{ id: 12, x: '20px', y: '-90px', r: '-15deg', color: 'bg-saffron-300', size: 'h-1.5 w-2' },
{ id: 13, x: '-80px', y: '-60px', r: '50deg', color: 'bg-teal-600', size: 'h-2 w-2' },
{ id: 14, x: '85px', y: '-65px', r: '-65deg', color: 'bg-saffron-500', size: 'h-1.5 w-3' },
];

export function CompleteScreen({ journey, onRestart }: CompleteScreenProps) {
const { language, t } = useLanguage();
const [replayStep, setReplayStep] = useState(0);
const stepCount = journey?.steps.length ?? 0;

useEffect(() => {
const timer = setInterval(() => {
setReplayStep((prev) => {
if (prev >= stepCount) {
clearInterval(timer);
return prev;
}


    return prev + 1;
  });
}, 380);

return () => clearInterval(timer);


}, [stepCount]);

if (!journey) {
return ( <div className="paper-bg flex min-h-screen items-center justify-center px-6 text-center"> <div> <p className="text-ink-500 dark:text-ink-300">{t.noJourney}</p> <button onClick={onRestart} className="btn-stamp mt-4">
{t.startOver} </button> </div> </div>
);
}

return ( <div className="paper-bg relative flex min-h-screen flex-col overflow-hidden"> <RouteBackdrop /> <AppHeader />

  <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-16 pt-6 sm:px-6">
    <div className="w-full max-w-2xl">
      <TicketFrame
        className="anim-enter"
        serial={`HS-${(journey.state?.substring(0, 2) || 'IN').toUpperCase()}/2026-V`}
        label={t.civicClearanceVisa}
      >
        <div className="relative px-6 py-8 sm:px-8">
          {/* Visa card inner with animated corner-brackets (Requirement 2 & 6) */}
          <div className="visa-inner relative p-5 sm:p-7">
            <CornerBrackets color="text-teal-700/60 dark:text-teal-400/60" />

            {/* Celebratory stamp particles (under 15 lightweight elements) */}
            <div
              className="pointer-events-none absolute right-20 top-20"
              aria-hidden="true"
            >
              {confettiParticles.map((p) => (
                <span
                  key={p.id}
                  className={`anim-confetti absolute ${p.color} ${p.size}`}
                  style={
                    {
                      '--tw-x': p.x,
                      '--tw-y': p.y,
                      '--tw-r': p.r,
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>

            {/* Official Stamped Seal with stamp impression overshoot (Requirement 6) */}
            <StampSeal
              stamped
              title="CLEARED"
              caption={`${translateContent(journey.department, language).toUpperCase()} · ALL ${journey.steps.length} ${t.stops || 'STOPS'}`}
              className="anim-stamp-slam absolute right-4 top-6 h-36 w-36 text-teal-700/60 dark:text-teal-300/50"
            />

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal-600 dark:bg-teal-400" />
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-teal-800 dark:text-teal-300">
                {t.officialClearanceGranted}
              </p>
            </div>

            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-[-0.04em] text-ink-900 sm:text-6xl dark:text-cream-50">
              You
              <br />
              <span className="font-light text-saffron-500">{t.madeIt}</span>
            </h1>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-600 dark:text-ink-300 sm:text-base">
              <span className="font-bold text-ink-900 dark:text-cream-50">
                {translateContent(journey.title, language)}
              </span>
              {' '}— all {journey.steps.length} {t.completionSummary}
            </p>

            {/* Bearer Passport Block */}
            <div className="mt-6 grid grid-cols-1 gap-4 border border-dashed border-ink-300 p-4 sm:grid-cols-3 dark:border-ink-600">
              <div className="flex h-20 w-16 items-center justify-center border-2 border-ink-800 bg-cream-100 sm:h-auto sm:w-auto dark:border-ink-200 dark:bg-ink-800">
                <Traveller size={44} className="text-saffron-600 dark:text-saffron-400" />
              </div>

              <div className="sm:col-span-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-400 dark:text-ink-300">
                  {t.bearerDossier}
                </p>

                <p className="font-heading text-sm font-bold text-ink-800 dark:text-cream-50">
                  {t.civicTraveller} · {t.stateOf}{' '}
                  {translateContent(journey.state, language)}
                </p>

                <p className="mt-1 text-xs text-ink-500 dark:text-ink-300">
                  {t.authority}:{' '}
                  <span className="font-semibold text-ink-700 dark:text-cream-100">
                    {translateContent(journey.department, language)}
                  </span>
                </p>

                <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-300">
                  {t.service}:{' '}
                  <span className="font-semibold text-ink-700 dark:text-cream-100">
                    {translateContent(journey.service, language)}
                  </span>
                </p>
              </div>
            </div>

            {/* Stamped Steps Audit List */}
            <div className="mt-6 border-t border-dashed border-ink-300 pt-4 dark:border-ink-600">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-400 dark:text-ink-300">
                {t.proceduralAuditLog}
              </p>

              <ol className="mt-2 space-y-0">
                {journey.steps.map((step, idx) => {
                  const isVisible = idx < replayStep;

                  return (
                    <li
                      key={step.id}
                      className={`flex items-center gap-3 border-b border-ink-200 py-2 transition-opacity duration-300 dark:border-ink-700 ${
                        isVisible ? 'opacity-100' : 'opacity-25'
                      }`}
                    >
                      <span className="w-6 font-display text-xs font-bold text-saffron-600 dark:text-saffron-400">
                        0{step.id}
                      </span>

                      <span
                        className={`truncate text-xs sm:text-sm ${
                          isVisible
                            ? 'font-medium text-ink-800 dark:text-cream-50'
                            : 'text-ink-400'
                        }`}
                      >
                        {translateContent(step.title, language)}
                      </span>

                      {isVisible && (
                        <span className="ml-auto shrink-0 font-heading text-[10px] font-extrabold uppercase tracking-wider text-teal-700 dark:text-teal-300">
                          ✓ {t.cleared}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {journey.sources[0] && (
                <a
                  href={journey.sources[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-stamp flex-1"
                >
                  {t.open} {journey.sources[0].name}
                  <ExternalLink size={16} />
                </a>
              )}

              <button
                type="button"
                onClick={() => window.print()}
                className="btn-ghost flex-1 group"
              >
                <span className="hover-text-swap">
                  <span className="hover-text-swap-inner">
                    <span>{t.printSaveItinerary}</span>
                    <span aria-hidden="true">{t.printSaveItinerary}</span>
                  </span>
                </span>
              </button>

              <button
                onClick={onRestart}
                className="btn-ghost shrink-0 px-4"
                title={t.startNewJourney}
                aria-label={t.startNewJourney}
              >
                <RotateCcw size={16} />
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between border-t border-ink-200 pt-3 text-[10px] uppercase tracking-wider text-ink-400 dark:border-ink-700 dark:text-ink-400">
              <span>{t.verifiedOfficialSources}</span>
              <span>{t.civicFieldGuide}</span>
            </div>
          </div>
        </div>
      </TicketFrame>
    </div>
  </main>
</div>

);
}
