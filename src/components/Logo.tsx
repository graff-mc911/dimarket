interface LogoProps {
  compact?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'full' | 'icon' | 'text'
  className?: string
}

const sizes = {
  sm: {
    full: 'h-8 w-[88px]',
    icon: 'h-9 w-9',
    text: 'text-[1.05rem]',
  },
  md: {
    full: 'h-10 w-[108px]',
    icon: 'h-10 w-10',
    text: 'text-[1.35rem]',
  },
  lg: {
    full: 'h-12 w-[132px]',
    icon: 'h-12 w-12',
    text: 'text-[1.75rem]',
  },
  xl: {
    full: 'h-16 w-[176px]',
    icon: 'h-16 w-16',
    text: 'text-[2.2rem]',
  },
} as const

export function Logo({
  compact = false,
  size = 'md',
  variant = 'full',
  className = '',
}: LogoProps) {
  const current = sizes[size]

  // Якщо десь у застосунку потрібен тільки текст,
  // лишаємо простий текстовий режим без зображення.
  if (variant === 'text') {
    return (
      <span
        className={`font-[var(--font-display)] font-semibold tracking-[-0.045em] text-[#241b14] ${current.text} ${className}`}
      >
        <span className="text-[#c8844f]">DI</span>
        <span>market</span>
      </span>
    )
  }

  // У compact або icon режимі показуємо тільки квадратну іконку бренду.
  if (compact || variant === 'icon') {
    return (
      <img
        src="/logo-icon.png"
        alt="DImarket icon"
        className={`${current.icon} shrink-0 object-contain ${className}`}
      />
    )
  }

  // У звичайному режимі беремо повний логотип,
  // але жорстко обмежуємо його ширину для мобільної шапки.
  return (
    <div className={`${current.full} flex shrink-0 items-center overflow-hidden ${className}`}>
      <img
        src="/logo-full.png"
        alt="DImarket Build & Renovate"
        className="h-full w-full object-contain object-left"
      />
    </div>
  )
}
