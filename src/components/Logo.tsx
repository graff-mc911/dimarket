interface LogoProps {
  compact?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'full' | 'icon' | 'text'
  className?: string
}

const sizes = {
  sm: {
    full: 'h-10',
    icon: 'h-10 w-10',
    text: 'text-[1.15rem]',
  },
  md: {
    full: 'h-12',
    icon: 'h-12 w-12',
    text: 'text-[1.55rem]',
  },
  lg: {
    full: 'h-14',
    icon: 'h-14 w-14',
    text: 'text-[1.95rem]',
  },
  xl: {
    full: 'h-[72px]',
    icon: 'h-[72px] w-[72px]',
    text: 'text-[2.35rem]',
  },
} as const

export function Logo({
  compact = false,
  size = 'md',
  variant = 'full',
  className = '',
}: LogoProps) {
  const current = sizes[size]

  // Якщо десь у коді явно просять тільки текст,
  // лишаємо текстовий режим, щоб нічого не ламалося.
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

  // У compact або icon режимі показуємо тільки іконку бренду.
  if (compact || variant === 'icon') {
    return (
      <img
        src="/logo-icon.png"
        alt="DImarket icon"
        className={`${current.icon} shrink-0 object-contain ${className}`}
      />
    )
  }

  // У звичайному режимі показуємо саме новий затверджений логотип як зображення.
  return (
    <img
      src="/logo-full.png"
      alt="DImarket Build & Renovate"
      className={`${current.full} w-auto shrink-0 object-contain ${className}`}
    />
  )
}
