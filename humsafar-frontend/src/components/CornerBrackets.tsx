interface CornerBracketsProps {
  className?: string;
  color?: string;
  animated?: boolean;
}

export function CornerBrackets({
  className = '',
  color = 'text-saffron-600/70 dark:text-saffron-400/70',
  animated = true,
}: CornerBracketsProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-2.5 z-10 ${className}`}
      aria-hidden="true"
    >
      {/* Top Left Corner */}
      <svg
        className={`absolute -left-0.5 -top-0.5 h-3.5 w-3.5 ${color}`}
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M0 16 V0 H16"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeDasharray="3 2"
          className={animated ? 'anim-corner-tl' : ''}
        />
      </svg>

      {/* Top Right Corner */}
      <svg
        className={`absolute -right-0.5 -top-0.5 h-3.5 w-3.5 ${color}`}
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M0 0 H16 V16"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeDasharray="3 2"
          className={animated ? 'anim-corner-tr' : ''}
        />
      </svg>

      {/* Bottom Right Corner */}
      <svg
        className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 ${color}`}
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M16 0 V16 H0"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeDasharray="3 2"
          className={animated ? 'anim-corner-br' : ''}
        />
      </svg>

      {/* Bottom Left Corner */}
      <svg
        className={`absolute -bottom-0.5 -left-0.5 h-3.5 w-3.5 ${color}`}
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M16 16 H0 V0"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeDasharray="3 2"
          className={animated ? 'anim-corner-bl' : ''}
        />
      </svg>
    </div>
  );
}
