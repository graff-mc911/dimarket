interface LogoProps {
  compact?: boolean
  className?: string
}

export function Logo({ compact = false, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      
      {/* 🔥 НОВИЙ ЛОГОТИП (твій, вставлений як SVG) */}
      <svg
        width="52"
        height="52"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* фон */}
        <rect width="200" height="200" rx="30" fill="#F5E9D8" />

        {/* дах */}
        <path
          d="M40 80 L100 40 L160 80"
          stroke="#c47b42"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />

        {/* димар */}
        <rect x="130" y="45" width="12" height="20" fill="#a96a3c" />

        {/* літера D */}
        <text
          x="55"
          y="140"
          fontSize="90"
          fontFamily="serif"
          fill="#241b14"
        >
          D
        </text>

        {/* літера I */}
        <text
          x="110"
          y="140"
          fontSize="90"
          fontFamily="serif"
          fill="#c47b42"
        >
          I
        </text>

        {/* вікно */}
        <rect x="90" y="70" width="8" height="8" fill="#c47b42" />
        <rect x="100" y="70" width="8" height="8" fill="#c47b42" />
        <rect x="90" y="80" width="8" height="8" fill="#c47b42" />
        <rect x="100" y="80" width="8" height="8" fill="#c47b42" />
      </svg>

      {!compact && (
        <div className="leading-none">
          <div className="text-2xl font-semibold tracking-normal">
            <span className="text-[#c47b42]">DI</span>
            <span className="text-[#241b14]">market</span>
          </div>

          <div className="text-[12px] uppercase tracking-[0.004em] text-[#4A2E1E] mt-1">
            Build & Renovate
          </div>
        </div>
      )}
    </div>
  )
}