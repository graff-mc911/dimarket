interface LogoIconProps {
  size?: number
  className?: string
}

export function LogoIcon({ compact = false, className = '' }: LogoIconProps) {
  return (
    <div
      className={`flex items-center gap-3 ${className}`}>
      style={{ width: size, height: size }}
    >
      {/* 
        🔥 Іконка збільшена:
        - viewBox залишився той самий
        - але весь контент "розтягнутий" під краї
        - мінімальні відступи → виглядає як app icon
      */}
      <svg
        viewBox="0 0 200 200"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* фон */}
        <rect width="200" height="200" rx="36" fill="#F5E9D8" />

        {/* дах (піднятий і ширший) */}
        <path
          d="M30 78 L100 30 L170 78"
          stroke="#c47b42"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />

        {/* димар */}
        <rect x="132" y="36" width="14" height="22" fill="#a96a3c" rx="2" />

        {/* D — більша */}
        <text
          x="50"
          y="150"
          fontSize="110"
          fontFamily="serif"
          fill="#241b14"
        >
          D
        </text>

        {/* I — більша */}
        <text
          x="115"
          y="150"
          fontSize="110"
          fontFamily="serif"
          fill="#c47b42"
        >
          I
        </text>

        {/* вікно */}
        <rect x="90" y="85" width="10" height="10" fill="#c47b42" />
        <rect x="102" y="85" width="10" height="10" fill="#c47b42" />
        <rect x="90" y="98" width="10" height="10" fill="#c47b42" />
        <rect x="102" y="98" width="10" height="10" fill="#c47b42" />
      </svg>
    </div>
  )
}