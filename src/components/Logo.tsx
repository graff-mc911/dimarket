interface LogoProps {
  variant?: 'full' | 'icon' | 'text'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  sm: {
    full: 'h-10',
    icon: 'h-10 w-10',
    title: 'text-[1.15rem]',
  },
  md: {
    full: 'h-12',
    icon: 'h-12 w-12',
    title: 'text-[1.55rem]',
  },
  lg: {
    full: 'h-14',
    icon: 'h-14 w-14',
    title: 'text-[1.95rem]',
  },
  xl: {
    full: 'h-[72px]',
    icon: 'h-[72px] w-[72px]',
    title: 'text-[2.35rem]',
  },
} as const

export function Logo({ variant = 'full', size = 'md', className = '' }: LogoProps) {
  const current = sizes[size]

  // Повний логотип беремо напряму з PNG,
  // щоб у застосунку він виглядав точно так само, як на затвердженому зображенні.
  if (variant === 'full') {
    return (
      <img
        src="/logo-full.png"
        alt="DImarket Build & Renovate"
        className={`${current.full} w-auto shrink-0 object-contain ${className}`}
      />
    )
  }

  // Іконковий режим залишає тільки знак без нижнього тексту.
  if (variant === 'icon') {
    return (
      <img
        src="/logo-icon.png"
        alt="DImarket icon"
        className={`${current.icon} shrink-0 object-contain ${className}`}
      />
    )
  }

  // Текстовий режим потрібен для місць,
  // де треба показати лише назву бренду без графічної частини.
  return (
    <span
      className={`font-[var(--font-display)] font-semibold tracking-[-0.045em] text-[#241b14] ${current.title} ${className}`}
    >
      <span className="text-[#c8844f]">DI</span>
      <span>market</span>
    </span>
  )
}
