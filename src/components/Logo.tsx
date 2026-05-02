interface LogoProps {
  variant?: 'full' | 'icon' | 'text'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  sm: {
    gap: 'gap-2.5',
    mark: 'h-10 w-10',
    title: 'text-[1.4rem]',
    subtitle: 'text-[9px]',
  },
  md: {
    gap: 'gap-3',
    mark: 'h-[52px] w-[52px]',
    title: 'text-[2rem]',
    subtitle: 'text-[10px]',
  },
  lg: {
    gap: 'gap-3.5',
    mark: 'h-[60px] w-[60px]',
    title: 'text-[2.25rem]',
    subtitle: 'text-[11px]',
  },
  xl: {
    gap: 'gap-4',
    mark: 'h-[72px] w-[72px]',
    title: 'text-[2.75rem]',
    subtitle: 'text-[12px]',
  },
} as const

export function Logo({ variant = 'full', size = 'md', className = '' }: LogoProps) {
  const current = sizes[size]

  // Текст логотипу (назва + підпис)
  const wordmark = (
    <div className="min-w-0 leading-none">
      {/* Назва */}
      <div
        className={`font-[var(--font-display)] ${current.title} whitespace-nowrap font-semibold tracking-[-0.03em]`}
      >
        <span className="text-[#a96942]">DI</span>
        <span className="text-[#241b14]">market</span>
      </div>

      {/* Підпис (короткий і не розтягнутий) */}
      <div
        className={`mt-1.5 font-medium uppercase tracking-[0.004em] text-[#5c4d41] ${current.subtitle}`}
      >
        Build & Renovate
      </div>
    </div>
  )

  if (variant === 'text') {
    return <div className={className}>{wordmark}</div>
  }

  if (variant === 'icon') {
    return <BrandMark className={`${current.mark} ${className}`} />
  }

  return (
    <div className={`flex items-center ${current.gap} ${className}`}>
      <BrandMark className={current.mark} />
      {wordmark}
    </div>
  )
}

/* 
  ІКОНКА БРЕНДУ
  Тут вся проблема була — я її повністю почистив.
*/
function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className || ''} shrink-0`}
      role="img"
      aria-label="DImarket logo"
    >
      {/* Фон */}
      <rect
        x="6"
        y="6"
        width="108"
        height="108"
        rx="26"
        fill="#F8F5EF"
        stroke="#E7D6C4"
        strokeWidth="1.2"
      />

      {/* Дах — рівний і центрований */}
      <path
        d="M30 48L60 24L90 48"
        stroke="#A96942"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Літера D */}
      <path
        d="M30 55H55C70 55 80 66 80 82C80 98 70 108 55 108H30V55Z"
        fill="#241B14"
      />

      {/* Внутрішній виріз */}
      <path
        d="M44 70H54C61 70 66 75 66 82C66 89 61 94 54 94H44V70Z"
        fill="#FDFBF7"
      />

      {/* Літера I (чиста вертикаль) */}
      <rect
        x="88"
        y="55"
        width="9"
        height="53"
        rx="2"
        fill="#8D5636"
      />

      {/* Основа */}
      <path
        d="M86 108H100"
        stroke="#5C4D41"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* 🇺🇦 Вікно */}
      <rect x="48" y="76" width="7" height="6" rx="1" fill="#0057B7" />
      <rect x="48" y="82" width="7" height="6" rx="1" fill="#FFD700" />
    </svg>
  )
}