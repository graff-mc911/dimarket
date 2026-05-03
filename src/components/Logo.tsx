interface LogoProps {
  compact?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'full' | 'icon' | 'text'
  className?: string
}

const sizes = {
  sm: {
    gap: 'gap-2',
    svg: { width: 42, height: 42 },
    title: 'text-[1.35rem]',
    subtitle: 'text-[9px]',
  },
  md: {
    gap: 'gap-3',
    svg: { width: 58, height: 58 },
    title: 'text-3xl',
    subtitle: 'text-[11px]',
  },
  lg: {
    gap: 'gap-3.5',
    svg: { width: 68, height: 68 },
    title: 'text-[2.2rem]',
    subtitle: 'text-[12px]',
  },
  xl: {
    gap: 'gap-4',
    svg: { width: 82, height: 82 },
    title: 'text-[2.7rem]',
    subtitle: 'text-[13px]',
  },
} as const

export function Logo({
  compact = false,
  size = 'md',
  variant = 'full',
  className = '',
}: LogoProps) {
  const current = sizes[size]

  // Іконка логотипа вбудована прямо у компонент,
  // тому нічого не ламається через шляхи до png/svg файлів.
  const mark = (
    <svg
      width={current.svg.width}
      height={current.svg.height}
      viewBox="0 0 160 160"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      aria-label="DImarket logo"
      role="img"
    >
      <defs>
        {/* Мідно-бронзовий градієнт для даху, вікна й літери I. */}
        <linearGradient id="bronze" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C47A3D" />
          <stop offset="45%" stopColor="#E0B06A" />
          <stop offset="100%" stopColor="#8A4F2A" />
        </linearGradient>

        {/* Темний градієнт для літери D. */}
        <linearGradient id="darkText" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1D1814" />
          <stop offset="100%" stopColor="#3A2C22" />
        </linearGradient>
      </defs>

      {/* Світлий теплий фон. */}
      <rect width="160" height="160" rx="28" fill="#FAF3E8" />

      {/* Дах. */}
      <path
        d="M34 58 L80 24 L126 58"
        fill="none"
        stroke="url(#bronze)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Димар. */}
      <rect x="108" y="29" width="13" height="25" rx="1.5" fill="url(#bronze)" />

      {/* Вікно. */}
      <rect x="70" y="48" width="9" height="9" fill="url(#bronze)" />
      <rect x="82" y="48" width="9" height="9" fill="url(#bronze)" />
      <rect x="70" y="60" width="9" height="9" fill="url(#bronze)" />
      <rect x="82" y="60" width="9" height="9" fill="url(#bronze)" />

      {/* Велика літера D. */}
      <text
        x="32"
        y="125"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="88"
        fontWeight="500"
        fill="url(#darkText)"
      >
        D
      </text>

      {/* Велика літера I. */}
      <text
        x="92"
        y="125"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="88"
        fontWeight="500"
        fill="url(#bronze)"
      >
        I
      </text>
    </svg>
  )

  // Режим тільки тексту лишає назву бренду без знака.
  if (variant === 'text') {
    return (
      <div className={`leading-none ${className}`}>
        <div
          className={`${current.title} tracking-[-0.04em]`}
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          <span className="text-[#C47A3D]">DI</span>
          <span className="text-[#241B14]">market</span>
        </div>
      </div>
    )
  }

  // Режим тільки іконки.
  if (compact || variant === 'icon') {
    return <div className={className}>{mark}</div>
  }

  return (
    <div className={`flex items-center ${current.gap} ${className}`}>
      {mark}

      {/* Текстова частина повного логотипа. */}
      {!compact && (
        <div className="leading-none">
          <div
            className={`${current.title} tracking-[-0.04em]`}
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            <span className="text-[#C47A3D]">DI</span>
            <span className="text-[#241B14]">market</span>
          </div>

          <div className={`${current.subtitle} mt-1.5 uppercase tracking-[0.22em] text-[#5C4D41]`}>
            Build & Renovate
          </div>
        </div>
      )}
    </div>
  )
}
