import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/theme';
import { useLanguage } from '@/i18n/LanguageContext';

function CompassMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden className="text-saffron-400">
      <circle cx="11" cy="11" r="8.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M11 4.5 V6.5 M11 15.5 V17.5 M4.5 11 H6.5 M15.5 11 H17.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M11 7.2 L12.6 11 L11 14.8 L9.4 11 Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

export function BrandMark({ compact = false }: { compact?: boolean }) {
  const { t } = useLanguage();
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center border-2 border-ink-800 bg-ink-800 shadow-[2px_2px_0_0_#142236] dark:border-saffron-400 dark:shadow-[2px_2px_0_0_#ffbd6e]">
        <CompassMark />
      </div>
      {!compact && (
        <div>
          <p className="font-display text-xl font-black leading-none text-ink-800 dark:text-cream-50">
            Humsafar
          </p>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.22em] text-ink-500 dark:text-ink-300">
            {t.fieldGuide}
          </p>
        </div>
      )}
    </div>
  );
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? t.switchToLight : t.switchToDark}
      className="flex h-10 w-10 items-center justify-center border-2 border-ink-800 bg-cream-50 text-ink-700 shadow-[2px_2px_0_0_#142236] transition-all duration-150 hover:-translate-y-0.5 hover:bg-cream-100 hover:shadow-[3px_3px_0_0_#142236] active:translate-x-px active:translate-y-px dark:border-ink-300 dark:bg-ink-800 dark:text-cream-100 dark:shadow-[2px_2px_0_0_#ffbd6e] dark:hover:bg-ink-700"
    >
      {theme === 'dark' ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
    </button>
  );
}

export function AppHeader({ onBack }: { onBack?: () => void }) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="relative z-20 px-6 pt-5 sm:px-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between border-b border-ink-800/30 pb-4 dark:border-ink-200/30">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="group flex items-center gap-1.5 font-heading text-sm font-medium text-ink-500 hover:text-ink-800 dark:text-ink-300 dark:hover:text-cream-50"
            >
              <ArrowLeft size={16} strokeWidth={1.75} className="transition-transform duration-150 group-hover:-translate-x-0.5" />
              <span className="hover-text-swap">
                <span className="hover-text-swap-inner">
                  <span>{t.back}</span>
                  <span aria-hidden="true">{t.back}</span>
                </span>
              </span>
            </button>
          )}
          <BrandMark />
        </div>
        <div className="flex items-center gap-3">
  <select
    value={language}
    onChange={(e) =>
      setLanguage(e.target.value as 'en' | 'hi' | 'mr')
    }
    className="h-10 border-2 border-ink-800 bg-cream-50 px-3 text-sm font-semibold text-ink-800 shadow-[2px_2px_0_0_#142236] outline-none dark:border-ink-300 dark:bg-ink-800 dark:text-cream-50 dark:shadow-[2px_2px_0_0_#ffbd6e]"
    aria-label={t.selectLanguage}
  >
    <option value="en">{t.english}</option>
    <option value="hi">{t.hindi}</option>
    <option value="mr">{t.marathi}</option>
  </select>

  <ThemeToggle />
</div>
      </div>
    </header>
  );
}

export function StampSeal({
  className = '',
  caption = 'OFFICIAL SOURCES',
  title = 'HUMSAFAR',
  stamped = false,
}: {
  className?: string;
  caption?: string;
  title?: string;
  stamped?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 140 140"
      className={`pointer-events-none text-ink-800/20 dark:text-saffron-300/35 ${stamped ? 'anim-stamp' : ''} ${className}`}
      aria-hidden
    >
      <circle cx="70" cy="70" r="62" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="70" cy="70" r="54" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 3" />
      <text
        x="70"
        y="66"
        textAnchor="middle"
        fill="currentColor"
        fontFamily="Sora, sans-serif"
        fontSize="11"
        fontWeight="700"
        letterSpacing="2"
      >
        {title}
      </text>
      <text
        x="70"
        y="82"
        textAnchor="middle"
        fill="currentColor"
        fontFamily="Inter, sans-serif"
        fontSize="7"
        letterSpacing="1.5"
      >
        {caption}
      </text>
    </svg>
  );
}
