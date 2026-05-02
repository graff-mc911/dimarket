interface LogoProps {
  variant?: 'full' | 'icon' | 'text'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  sm: {
    gap: 'gap-2.5',
    mark: 'h-10 w-10',
    title: 'text-[1.2rem]',
    subtitle: 'text-[8px]',
  },
  md: {
    gap: 'gap-3',
    mark: 'h-[50px] w-[50px]',
    title: 'text-[1.7rem]',
    subtitle: 'text-[9px]',
  },
  lg: {
    gap: 'gap-3.5',
    mark: 'h-[60px] w-[60px]',
    title: 'text-[2.05rem]',
    subtitle: 'text-[10px]',
  },
  xl: {
    gap: 'gap-4',
    mark: 'h-[72px] w-[72px]',
    title: 'text-[2.5rem]',
    subtitle: 'text-[11px]',
  },
} as const

const serifStyle = {
  fontFamily: '"Georgia", "Times New Roman", serif',
}

export function Logo({ variant = 'full', size = 'md', className = '' }: LogoProps) {
  const current = sizes[size]
  const showSubtitle = variant === 'full' && (size === 'lg' || size === 'xl')

  // Текстову частину логотипа тримаємо окремо,
  // щоб легко використовувати її разом зі знаком або без нього.
  const wordmark = (
    <div className="min-w-0 leading-none">
      <div
        className={`${current.title} whitespace-nowrap leading-[0.9] tracking-[-0.04em]`}
        style={serifStyle}
      >
        <span className="font-semibold text-[#c8844f]">DI</span>
        <span className="font-semibold text-[#241b14]">market</span>
      </div>

      {/* Підпис показуємо тільки у більших розмірах,
          щоб логотип у шапці не був перевантажений. */}
      {showSubtitle && (
        <div className={`mt-2 flex items-center gap-2 text-[#6a5648] ${current.subtitle}`}>
          <span className="h-px w-6 shrink-0 bg-[rgba(200,132,79,0.45)]" />
          <span className="whitespace-nowrap font-medium uppercase tracking-[0.22em]">
            Build & Renovate
          </span>
          <span className="h-px w-6 shrink-0 bg-[rgba(200,132,79,0.45)]" />
        </div>
      )}
    </div>
  )

  // Режим text залишає тільки назву бренду.
  if (variant === 'text') {
    return <div className={className}>{wordmark}</div>
  }

  // Режим icon потрібен для компактних місць інтерфейсу.
  if (variant === 'icon') {
    return <BrandMark className={`${current.mark} ${className}`} />
  }

  // Основний режим показує знак і текст разом.
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
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className || ''} shrink-0`}
      aria-label="DImarket logo"
      role="img"
    >
      {/* Світлий фон потрібен, щоб знак виглядав чисто на glass-інтерфейсі. */}
      <rect x="6" y="6" width="116" height="116" rx="28" fill="#FFFDF9" />

      {/* Дах і димар робимо в теплому мідному кольорі як у референсі. */}
      <path
        d="M20 40L64 10L108 40"
        stroke="#C8844F"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="88" y="16" width="10" height="17" fill="#C8844F" />

      {/* Маленьке вікно лишаємо в центрі під дахом. */}
      <rect x="56" y="28" width="6.5" height="6.5" fill="#C8844F" />
      <rect x="65.5" y="28" width="6.5" height="6.5" fill="#C8844F" />
      <rect x="56" y="37.5" width="6.5" height="6.5" fill="#C8844F" />
      <rect x="65.5" y="37.5" width="6.5" height="6.5" fill="#C8844F" />

      {/* Літери D та I наближені до прикладу:
          темна D і мідна I з виразною serif-формою. */}
      <text
        x="28"
        y="105"
        fill="#241B14"
        fontSize="82"
        fontWeight="600"
        letterSpacing="-5"
        style={serifStyle}
      >
        D
      </text>

      <text
        x="74"
        y="105"
        fill="#C8844F"
        fontSize="82"
        fontWeight="600"
        letterSpacing="-5"
        style={serifStyle}
      >
        I
      </text>
    </svg>
  )
}
