interface LogoProps {
  variant?: 'full' | 'icon' | 'text'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  sm: {
    icon: 'h-9 w-9 rounded-[14px]',
    full: 'w-[118px] sm:w-[128px]',
    title: 'text-lg',
  },
  md: {
    icon: 'h-11 w-11 rounded-[16px]',
    full: 'w-[132px] sm:w-[148px]',
    title: 'text-xl',
  },
  lg: {
    icon: 'h-14 w-14 rounded-[20px]',
    full: 'w-[188px] sm:w-[214px]',
    title: 'text-2xl',
  },
  xl: {
    icon: 'h-16 w-16 rounded-[22px]',
    full: 'w-[220px] sm:w-[252px]',
    title: 'text-3xl',
  },
} as const

export function Logo({ variant = 'full', size = 'md', className = '' }: LogoProps) {
  const current = sizes[size]

  // Квадратну іконку використовуємо там,
  // де потрібен компактний знак без повного напису.
  const icon = (
    <img
      src="/logo-icon.png"
      alt="DImarket icon"
      className={`${current.icon} shrink-0 object-cover shadow-[0_12px_28px_rgba(82,54,32,0.10)]`}
    />
  )

  // Повний логотип беремо окремим PNG,
  // щоб у шапці й футері показувався саме готовий фірмовий знак з підписом англійською.
  const fullLogo = (
    <img
      src="/logo-full.png"
      alt="DImarket - Everything for construction and renovation"
      className={`${current.full} h-auto shrink-0 object-contain`}
    />
  )

  if (variant === 'icon') {
    return <div className={className}>{icon}</div>
  }

  if (variant === 'text') {
    return (
      <span
        className={`font-[var(--font-display)] font-bold tracking-[-0.04em] text-[#241b14] ${current.title} ${className}`}
      >
        DImarket
      </span>
    )
  }

  return <div className={className}>{fullLogo}</div>
}
