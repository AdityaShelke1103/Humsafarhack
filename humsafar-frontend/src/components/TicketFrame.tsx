import type { ReactNode } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';

export function TicketFrame({
  children,
  className = '',
  serial,
  label,
}: {
  children: ReactNode;
  className?: string;
  serial?: string;
  label?: string;
}) {
  const { t } = useLanguage();
  return (
    <div className={`ticket-frame ${className}`}>
      {serial && (
        <div className="flex items-baseline justify-between border-b-2 border-ink-800 px-6 py-3 dark:border-ink-200">
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-400 dark:text-ink-300">
            {label ?? t.travelDocument}
          </span>
          <span className="font-display text-xs tracking-widest text-ink-400">{serial}</span>
        </div>
      )}
      {children}
    </div>
  );
}
