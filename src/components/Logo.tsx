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
        {/* Бежевий фон іконки */}
        <rect
          width="120"
          height="120"
          rx="26"
          fill="#F5E9D8"
        />

        {/* Дах будинку */}
        <path
          d="M24 48 L60 22 L96 48"
          stroke="#E85D04"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Димар */}
        <path
          d="M82 24 H94 V45"
          fill="#4A2E1E"
        />

        {/* Літера D */}
        <path
          d="M28 52 H55 C72 52 82 64 82 80 C82 96 72 104 55 104 H28 V52 Z"
          fill="#1A1A1A"
        />

        {/* Внутрішній виріз D */}
        <path
          d="M44 67 H54 C62 67 67 73 67 81 C67 89 62 94 54 94 H44 V67 Z"
          fill="#F5E9D8"
        />

        {/* Нижній скіс у D — натяк на будівельну форму */}
        <path
          d="M28 104 L48 84 V104 H28 Z"
          fill="#E85D04"
        />

        {/* Літера I */}
        <path
          d="M86 52 H100 V104 H86 V52 Z"
          fill="#E85D04"
        />

        {/* Основа під I */}
        <path
          d="M80 104 H106"
          stroke="#4A2E1E"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Вікна */}
        <rect x="48" y="72" width="8" height="8" rx="1.5" fill="#E85D04" />
        <rect x="59" y="72" width="8" height="8" rx="1.5" fill="#E85D04" />
        <rect x="48" y="83" width="8" height="8" rx="1.5" fill="#E85D04" />
        <rect x="59" y="83" width="8" height="8" rx="1.5" fill="#E85D04" />
      </svg>

      {/* Текстова частина логотипу */}
      {!compact && (
        <div className="leading-none">
          <div className="text-2xl font-extrabold tracking-tight">
            <span className="text-[#E85D04]">DI</span>
            <span className="text-[#1A1A1A]">market</span>
          </div>

          <div className="text-[10px] uppercase tracking-[0.22em] text-[#4A2E1E] mt-1">
            все для будівництва
          </div>
        </div>
      )}
    </div>
  )
}