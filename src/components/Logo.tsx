interface LogoProps {
  compact?: boolean
  className?: string
}

export function Logo({ compact = false, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Іконка логотипу у стилі luxury DI + дах */}
      <svg
        width="58"
        height="58"
        viewBox="0 0 160 160"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          {/* Мідно-бронзовий градієнт */}
          <linearGradient id="bronze" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#C47A3D" />
            <stop offset="45%" stopColor="#E0B06A" />
            <stop offset="100%" stopColor="#8A4F2A" />
          </linearGradient>

          {/* Темний градієнт для D */}
          <linearGradient id="darkText" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1D1814" />
            <stop offset="100%" stopColor="#3A2C22" />
          </linearGradient>
        </defs>

        {/* Світлий теплий фон */}
        <rect width="160" height="160" rx="28" fill="#FAF3E8" />

        {/* Дах */}
        <path
          d="M34 58 L80 24 L126 58"
          fill="none"
          stroke="url(#bronze)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Димар */}
        <rect x="108" y="29" width="13" height="25" rx="1.5" fill="url(#bronze)" />

        {/* Вікно */}
        <rect x="70" y="48" width="9" height="9" fill="url(#bronze)" />
        <rect x="82" y="48" width="9" height="9" fill="url(#bronze)" />
        <rect x="70" y="60" width="9" height="9" fill="url(#bronze)" />
        <rect x="82" y="60" width="9" height="9" fill="url(#bronze)" />

        {/* Велика літера D */}
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

        {/* Велика літера I */}
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

      {/* Текстова частина */}
      {!compact && (
        <div className="leading-none">
          <div
            className="text-3xl tracking-[-0.04em]"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            <span className="text-[#C47A3D]">DI</span>
            <span className="text-[#241B14]">market</span>
          </div>

          <div className="text-[11px] uppercase tracking-[0.22em] text-[#5C4D41] mt-1.5">
            Build & Renovate
          </div>
        </div>
      )}
    </div>
  )
}