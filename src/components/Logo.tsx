interface LogoProps {
  compact?: boolean
  className?: string
}

export function Logo({ compact = false, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      
      {/* 🔥 ІКОНКА НА ВЕСЬ КВАДРАТ */}
      <div className="w-[52px] h-[52px]">
        <svg
          viewBox="0 0 200 200"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* фон */}
          <rect width="200" height="200" fill="#F5E9D8" />

          {/* дах */}
          <path
            d="M0 80 L100 0 L200 80"
            stroke="#c47b42"
            strokeWidth="16"
            fill="none"
            strokeLinecap="round"
          />

          {/* D */}
          <text
            x="20"
            y="175"
            fontSize="160"
            fontFamily="serif"
            fill="#241b14"
          >
            D
          </text>

          {/* I */}
          <text
            x="110"
            y="175"
            fontSize="160"
            fontFamily="serif"
            fill="#c47b42"
          >
            I
          </text>
        </svg>
      </div>

      {/* ТЕКСТ */}
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