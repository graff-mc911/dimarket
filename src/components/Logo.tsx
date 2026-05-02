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

  // Текстову частину логотипа збираємо окремо,
  // щоб її можна було показувати разом зі знаком або без нього.
  const wordmark = (
    <div className="min-w-0 leading-none">
      <div
        className={`font-[var(--font-display)] ${current.title} whitespace-nowrap font-black tracking-[-0.055em]`}
      >
        <span className="text-[#a96942]">DI</span>
        <span className="text-[#241b14]">market</span>
      </div>

      <div
        className={`mt-1.5 font-semibold uppercase tracking-[0.12em] text-[#5c4d41] ${current.subtitle}`}
      >
        Everything for construction and renovation
      </div>
    </div>
  )

  // Режим only-text потрібен для місць,
  // де знак не потрібен або немає для нього місця.
  if (variant === 'text') {
    return <div className={className}>{wordmark}</div>
  }

  // Режим icon показує тільки сам знак без тексту.
  if (variant === 'icon') {
    return <BrandMark className={`${current.mark} ${className}`} />
  }

  // За замовчуванням віддаємо повний логотип:
  // знак + назва + нижній підпис.
  return (
    <div className={`flex items-center ${current.gap} ${className}`}>
      <BrandMark className={current.mark} />
      {wordmark}
    </div>
  )
}

function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className || ''} shrink-0 drop-shadow-[0_10px_24px_rgba(82,54,32,0.08)]`}
      aria-label="DImarket logo"
      role="img"
    >
      {/* М'який квадратний фон у кольорах застосунку. */}
      <rect
        x="6"
        y="6"
        width="108"
        height="108"
        rx="26"
        fill="#F8F5EF"
        stroke="#E7D6C4"
        strokeWidth="1.5"
      />

      {/* Дах будинку вирівняний симетрично, щоб знак виглядав акуратно. */}
      <path
        d="M22 45L60 17L98 45"
        stroke="#A96942"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Димар залишаємо темнішим для контрасту. */}
      <rect x="78" y="18" width="12" height="18" rx="2" fill="#5C4D41" />

      {/* Основна форма літери D. */}
      <path
        d="M29 52H54C72.5 52 85 64 85 82C85 100 72.5 111 54 111H29V52Z"
        fill="#241B14"
      />

      {/* Внутрішній проріз літери D робимо світлим,
          щоб форма добре читалась на малих розмірах. */}
      <path
        d="M41 65H52C62 65 69 72 69 82C69 92 62 98 52 98H41V65Z"
        fill="#FDFBF7"
      />

      {/* Нижній скошений акцент зліва формує фірмовий силует знака. */}
    </svg>//path d="M29 111L42 98V111H29Z" fill="#F8F5EF" />

      {/* Стійка літери I стилізована як права частина будинку. */}
      <path d="M82 51C91 53 97 60 97 69V111H82V51Z" fill="#8D5636" />

      {/* Основа внизу тримає композицію і візуально заземляє знак. */}
      <path
        d="M79 111H101"
        stroke="#5C4D41"
        strokeWidth="4.5"
        strokeLinecap="round"
      />

      {/* Синьо-жовте вікно навмисно залишаємо без змін
          як окремий впізнаваний акцент бренду. */}
      <rect x="48" y="74" width="7.5" height="7.5" rx="1.3" fill="#0057B7" />
      <rect x="57.5" y="74" width="7.5" height="7.5" rx="1.3" fill="#0057B7" />
      <rect x="48" y="83.5" width="7.5" height="7.5" rx="1.3" fill="#FFD700" />
      <rect x="57.5" y="83.5" width="7.5" height="7.5" rx="1.3" fill="#FFD700" />
    </svg>
  )
}
