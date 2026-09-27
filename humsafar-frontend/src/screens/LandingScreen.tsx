import { useState } from 'react';
import { Search, ArrowRight, ShieldCheck, Route, CheckCheck } from 'lucide-react';
import { Traveller } from '@/components/Traveller';
import { AppHeader, StampSeal } from '@/components/Brand';
import { RouteBackdrop } from '@/components/RouteBackdrop';
import { searchSuggestions } from '@/data/journeyData';
import { useInView } from '@/lib/useInView';
import { useLanguage } from '@/i18n/LanguageContext';
import { translateContent } from '@/i18n/contentTranslations';

interface LandingScreenProps {
  onSearch: (query: string) => void;
  errorMessage?: string | null;
  clarificationMessage?: string | null;
}

const flashcards = [
  {
    id: '01',
    badge: 'OFFICIAL RECORD',
    tag: 'Gov.in Verified',
    title: 'Source-linked',
    desc: 'Every fact traces back to an official government portal.',
    detail: 'Direct state & central portal references',
    icon: ShieldCheck,
  },
  {
    id: '02',
    badge: 'VISUAL ROUTE',
    tag: 'Zero Blindspots',
    title: 'Journey mapped',
    desc: 'See every stop, dependency, and document before you start.',
    detail: 'Complete stops, fees & timelines',
    icon: Route,
  },
  {
    id: '03',
    badge: 'FIELD READY',
    tag: 'Clear Protocol',
    title: 'No guesswork',
    desc: 'Know exactly what to do, where to go, and what to carry.',
    detail: 'Checklists for every counter',
    icon: CheckCheck,
  },
];

export function LandingScreen({ onSearch, errorMessage, clarificationMessage }: LandingScreenProps) {
  const { language, t } = useLanguage();
  const [query, setQuery] = useState('');
  const { ref: flashcardsRef, isInView: flashcardsInView } = useInView({ threshold: 0.1 });

  const handleSearch = () => {
    if (!query.trim()) return;
    onSearch(query.trim());
  };

  return (
    <div className="paper-bg relative min-h-screen overflow-hidden">
      <RouteBackdrop />
      <StampSeal className="absolute -right-10 top-28 hidden h-40 w-40 rotate-12 sm:block" />
      <AppHeader />

      <main className="relative z-10 px-6 pb-20 pt-8 sm:px-10 lg:pt-12">
        {/* Ambient Route Companion on wide screens */}
        <div className="pointer-events-none absolute right-4 top-8 hidden xl:block 2xl:right-16" aria-hidden>
          <svg
            viewBox="0 0 280 480"
            className="h-[440px] w-[260px] text-ink-800/35 dark:text-cream-100/25"
          >
            <path
              className="anim-route"
              d="M 40 20 C 80 80, 40 140, 90 190 S 200 250, 160 310 S 90 370, 180 450"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            />
            <circle cx="40" cy="20" r="5" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="90" cy="190" r="5" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="160" cy="310" r="5" fill="none" stroke="currentColor" strokeWidth="1.4" />
          </svg>
          <div className="anim-d4 absolute -right-2 top-28 flex flex-col items-center">
            <Traveller size={110} className="text-saffron-600 dark:text-saffron-400" />
            <p className="mt-2.5 max-w-[8rem] text-center text-[10px] uppercase tracking-[0.18em] text-ink-400 dark:text-ink-300">
              {t.companionOnRoute}
            </p>
          </div>
        </div>

        {/* Centered Hero Section */}
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          {/* Staggered Hero Heading Reveal (Requirement 3) */}
          <h1 className="font-display text-5xl font-black leading-[1.04] tracking-[-0.035em] text-ink-800 sm:text-7xl lg:text-8xl dark:text-cream-50 text-center">
            <span
              className="anim-enter inline-block font-display font-black text-saffron-500 mr-3 sm:mr-4"
              aria-hidden
            >
              01
            </span>
            <span className="anim-hero-phrase-1 inline-block">{t.whereAreYou}</span>{' '}
            <span className="anim-hero-phrase-3 inline-block font-light text-saffron-500">{t.headed}</span>
          </h1>

          <p className="anim-d2 mt-6 max-w-2xl text-center text-lg sm:text-xl font-medium leading-relaxed text-ink-600 dark:text-ink-200">
            {t.paperworkDescription}
          </p>

          <form
            className="anim-d3 mt-9 w-full max-w-2xl"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
            <div className="mb-2 flex items-center justify-between px-1.5">
              <label
                htmlFor="destination"
                className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.22em] text-ink-500 dark:text-ink-300"
              >
                {t.destinationOrProcedure}
              </label>
              <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-ink-400 dark:text-ink-400">
                {t.pressEnter}
              </span>
            </div>

            <div className="group relative flex items-center border-2 border-ink-800 bg-cream-50 p-2 sm:p-2.5 shadow-[4px_4px_0_0_#142236] transition-all duration-150 focus-within:-translate-y-0.5 focus-within:border-saffron-500 focus-within:shadow-[6px_6px_0_0_#f97d06] dark:border-ink-300 dark:bg-ink-800/95 dark:shadow-[4px_4px_0_0_#ffbd6e] dark:focus-within:border-saffron-400 dark:focus-within:shadow-[6px_6px_0_0_#ffbd6e]">
              <Search className="ml-2.5 shrink-0 text-ink-400 transition-colors group-focus-within:text-saffron-500 dark:text-ink-300" size={24} strokeWidth={2} />
              <input
                id="destination"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.domicilePlaceholder}
                className="w-full bg-transparent px-3 py-2 font-heading text-lg sm:text-xl font-medium text-ink-800 outline-none placeholder:text-ink-300 dark:text-cream-50 dark:placeholder:text-ink-500"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="mr-2 p-1.5 text-xl font-bold text-ink-400 hover:text-ink-800 dark:hover:text-cream-50"
                  aria-label={t.clearInput}
                >
                  ×
                </button>
              )}
              <button
                type="submit"
                className="btn-stamp shrink-0 px-6 py-3 text-base sm:text-lg font-extrabold tracking-wide"
              >
                <span>{t.go}</span>
                <ArrowRight size={18} strokeWidth={2.5} />
              </button>
            </div>
          </form>

          {(errorMessage || clarificationMessage) && (
            <div className="anim-d3 mt-4 w-full max-w-2xl border-2 border-saffron-500 bg-saffron-50 px-4 py-3 text-center text-sm sm:text-base font-semibold text-ink-700 dark:bg-ink-800 dark:text-cream-50">
              {clarificationMessage ?? errorMessage}
            </div>
          )}

          {/* Popular routes with hover text-swap (Requirement 1) */}
          <div className="anim-d3 mt-8 flex flex-col items-center">
            <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.24em] text-ink-500 dark:text-ink-300 text-center">
              {t.popularRoutes}
            </p>
            <ul className="mt-3.5 flex flex-wrap justify-center gap-2.5 sm:gap-3">
              {(query.trim()
                ? searchSuggestions.filter((s) => s.toLowerCase().includes(query.toLowerCase()))
                : searchSuggestions.slice(0, 4)
              ).map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery(s);
                      onSearch(s);
                    }}
                    className="group inline-flex items-center gap-2 border-2 border-ink-800 bg-cream-50 px-4 py-2 sm:px-4.5 sm:py-2.5 font-heading text-sm sm:text-base font-semibold text-ink-700 shadow-[3px_3px_0_0_#142236] transition-all duration-150 hover:-translate-y-0.5 hover:border-saffron-500 hover:bg-saffron-50 hover:text-saffron-700 hover:shadow-[4px_4px_0_0_#f97d06] dark:border-ink-400 dark:bg-ink-800 dark:text-cream-100 dark:shadow-[3px_3px_0_0_#ffbd6e] dark:hover:border-saffron-400 dark:hover:bg-ink-700 dark:hover:text-saffron-300"
                  >
                    <span className="text-saffron-500 font-bold transition-transform duration-150 group-hover:scale-125">↗</span>
                    <span className="hover-text-swap">
                      <span className="hover-text-swap-inner">
                        <span>{translateContent(s, language)}</span>
                        <span aria-hidden="true">{translateContent(s, language)}</span>
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Viewport-revealed Flashcards Section (Requirement 4) */}
        <section
          ref={flashcardsRef}
          className="mx-auto mt-20 max-w-6xl border-t-2 border-ink-800/20 pt-10 dark:border-ink-200/20"
          aria-label="Field Guide Principles"
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-saffron-500 animate-pulse" />
              <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.24em] text-ink-600 dark:text-ink-300">
                {t.fieldGuidePrinciples}
              </p>
            </div>
            <span className="hidden font-mono text-xs sm:text-sm font-bold tracking-wider text-ink-400 sm:inline dark:text-ink-400">
              {t.dispatchVerified}
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {flashcards.map((card, idx) => {
              const Icon = card.icon;
              const copy = [
                { badge: t.officialRecord, title: t.sourceLinked, desc: t.sourceLinkedDesc, detail: t.directPortalReferences },
                { badge: t.visualRoute, title: t.journeyMapped, desc: t.journeyMappedDesc, detail: t.completeStopsFeesTimelines },
                { badge: t.fieldReady, title: t.noGuesswork, desc: t.noGuessworkDesc, detail: t.checklistsEveryCounter },
              ][idx];
              return (
                <div
                  key={card.id}
                  className={`reveal-item group relative flex flex-col justify-between border-2 border-ink-800 bg-cream-50 p-6 shadow-[5px_5px_0_0_#142236] transition-all duration-200 hover:-translate-y-1 hover:border-saffron-600 hover:shadow-[7px_7px_0_0_#f97d06] dark:border-ink-400 dark:bg-ink-800/95 dark:shadow-[5px_5px_0_0_#ffbd6e] dark:hover:border-saffron-400 dark:hover:shadow-[7px_7px_0_0_#ffbd6e] ${
                    flashcardsInView ? 'is-revealed' : ''
                  }`}
                  style={{ transitionDelay: `${idx * 60}ms` }}
                >
                  {/* Top card header */}
                  <div className="flex items-center justify-between border-b border-ink-800/15 pb-3.5 dark:border-ink-200/15">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center border-2 border-ink-800 bg-saffron-100 text-ink-800 transition-colors group-hover:bg-saffron-500 group-hover:text-ink-900 dark:border-ink-400 dark:bg-ink-700 dark:text-saffron-300 dark:group-hover:bg-saffron-500 dark:group-hover:text-ink-900">
                        <Icon size={20} strokeWidth={2.25} />
                      </div>
                      <div>
                        <span className="block text-[10px] font-extrabold uppercase tracking-[0.22em] text-ink-400 dark:text-ink-400">
                          {t.flashcardNumber} #{card.id}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-[0.16em] text-saffron-600 dark:text-saffron-400">
                          {copy.badge}
                        </span>
                      </div>
                    </div>
                    <span className="font-display text-base font-black text-ink-400 dark:text-ink-500">
                      {card.id}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="my-5">
                    <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink-800 dark:text-cream-50">
                      {copy.title}
                    </h3>
                    <p className="mt-2.5 text-base leading-relaxed text-ink-600 dark:text-ink-200">
                      {copy.desc}
                    </p>
                  </div>

                  {/* Bottom Footer */}
                  <div className="flex items-center justify-between border-t border-dashed border-ink-300 pt-3.5 text-xs sm:text-sm font-semibold text-ink-600 dark:border-ink-600 dark:text-ink-300">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-saffron-500" />
                      {copy.detail}
                    </span>
                    <span className="font-mono text-sm font-bold opacity-60 transition-transform duration-150 group-hover:translate-x-1.5 group-hover:opacity-100">
                      →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}