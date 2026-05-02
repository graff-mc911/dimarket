interface LogoProps {
  compact?: boolean
  className?: string
}

export function Logo({ compact = false, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      
      {/* SVG-іконка DImarket */}
      <svg
        width="52"
        height="52"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Фон */}
        <rect width="120" height="120" rx="26" fill="#F5E9D8" />

        {/* Дах (вирівняний + однакова товщина) */}
        <path
          d="M26 50 L60 26 L94 50"
          stroke="#E85D04"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Димар */}
        <rect x="82" y="28" width="12" height="18" fill="#4A2E1E" rx="2" />

        {/* Літера D */}
        <path
          d="M28 54 H56 C74 54 86 68 86 86 C86 104 74 112 56 112 H28 Z"
          fill="#1A1A1A"
        />

        {/* Внутрішній виріз */}
        <path
          d="M44 70 H55 C64 70 70 76 70 86 C70 96 64 102 55 102 H44 Z"
          fill="#F5E9D8"
        />

       {/* Нижній акцент */}


        {/* Літера I */}
        <rect x="90" y="54" width="12" height="58" fill="#E85D04" rx="2" />

        {/* Основа */}
        <path
          d="M86 112 H106"
          stroke="#4A2E1E"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* 🔥 ЖОВТО-БЛАКИТНЕ ВІКНО */}
        <rect x="48" y="76" width="8" height="8" rx="1.5" fill="#0057B7" />
        <rect x="58" y="76" width="8" height="8" rx="1.5" fill="#0057B7" />
        <rect x="48" y="86" width="8" height="8" rx="1.5" fill="#FFD700" />
        <rect x="58" y="86" width="8" height="8" rx="1.5" fill="#FFD700" />
      </svg>

      {/* Текст */}
      {!compact && (
        <div className="leading-none">
          <div className="text-2xl font-extrabold tracking-tight">
            <span className="text-[#E85D04]">DI</span>
            <span className="text-[#1A1A1A]">market</span>
          </div>

          <div className="text-[10px] uppercase tracking-[0.25em] text-[#4A2E1E] mt-1">
           Everything for Construction & Renovation
          </div>
        </div>
      )}
    </div>
  )
}