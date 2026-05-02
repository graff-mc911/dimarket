interface LogoProps {
  compact?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  sm: {
    wrapper: 'gap-2',
    svg: 'h-10 w-10',
    title: 'text-[1.4rem]',
    subtitle: 'text-[10px]',
  },
  md: {
    wrapper: 'gap-3',
    svg: 'h-[52px] w-[52px]',
    title: 'text-2xl',
    subtitle: 'text-[12px]',
  },
  lg: {
    wrapper: 'gap-3.5',
    svg: 'h-[60px] w-[60px]',
    title: 'text-[2rem]',
    subtitle: 'text-[13px]',
  },
  xl: {
    wrapper: 'gap-4',
    svg: 'h-[72px] w-[72px]',
    title: 'text-[2.35rem]',
    subtitle: 'text-[14px]',
  },
} as const

export function Logo({ compact = false, size = 'md', className = '' }: LogoProps) {
  const current = sizes[size]

  return (
    <div className={`flex items-center ${current.wrapper} ${className}`}>
      {/* Лого фарбуємо в теплу палітру застосунку,
          щоб знак виглядав органічно в шапці, футері та на світлому glass-фоні. */}
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${current.svg} shrink-0`}
        aria-label="DImarket logo"
        role="img"
      >
        <rect width="120" height="120" rx="26" fill="#F8F5EF" />

        <path
          d="M26 50 L60 26 L94 50"
          stroke="#A96942"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <rect x="82" y="28" width="12" height="18" fill="#5C4D41" rx="2" />

        <path
          d="M28 54 H56 C74 54 86 68 86 86 C86 104 74 112 56 112 H28 Z"
          fill="#241B14"
        />

        <path
          d="M44 70 H55 C64 70 70 76 70 86 C70 96 64 102 55 102 H44 Z"
          fill="#FDFBF7"
        />

        <rect x="90" y="54" width="12" height="58" fill="#8D5636" rx="2" />

        <path
          d="M86 112 H106"
          stroke="#5C4D41"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Вікно теж переводимо в палітру бренду,
            щоб не вибивалося з загального стилю застосунку. */}
        <rect x="48" y="76" width="8" height="8" rx="1.5" fill="#C78A60" />
        <rect x="58" y="76" width="8" height="8" rx="1.5" fill="#C78A60" />
        <rect x="48" y="86" width="8" height="8" rx="1.5" fill="#EEDCCB" />
        <rect x="58" y="86" width="8" height="8" rx="1.5" fill="#EEDCCB" />
      </svg>

      {!compact && (
        <div className="leading-none">
          <div className={`${current.title} font-extrabold tracking-tight`}>
            <span className="text-[#A96942]">DI</span>
            <span className="text-[#241B14]">market</span>
          </div>

          <div className={`mt-1 text-[#5C4D41] uppercase tracking-[0.04em] ${current.subtitle}`}>
            Everything for Construction & Renovation
          </div>
        </div>
      )}
    </div>
  )
}
