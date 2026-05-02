interface LogoProps {
  variant?: 'full' | 'icon' | 'text'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  sm: {
    fullWrap: 'h-10 w-[60px]',
    fullImage: 'scale-[1.65] -translate-y-[2px]',
    icon: 'h-10 w-10',
    title: 'text-[1.15rem]',
  },
  md: {
    fullWrap: 'h-12 w-[72px]',
    fullImage: 'scale-[1.68] -translate-y-[2px]',
    icon: 'h-12 w-12',
    title: 'text-[1.55rem]',
  },
  lg: {
    fullWrap: 'h-14 w-[84px]',
    fullImage: 'scale-[1.7] -translate-y-[3px]',
    icon: 'h-14 w-14',
    title: 'text-[1.95rem]',
  },
  xl: {
    fullWrap: 'h-[72px] w-[108px]',
    fullImage: 'scale-[1.72] -translate-y-[4px]',
    icon: 'h-[72px] w-[72px]',
    title: 'text-[2.35rem]',
  },
} as const

export function Logo({ variant = 'full', size = 'md', className = '' }: LogoProps) {
  const current = sizes[size]

  // Повний логотип беремо напряму з затвердженого PNG.
  // Зображення має великі білі поля, тому тут навмисно збільшуємо його всередині рамки,
  // щоб у хедері й футері воно виглядало так само, як на референсі, а не губилося.
  if (variant === 'full') {
    return (
      <div className={`${current.fullWrap} shrink-0 overflow-hidden ${className}`}>
        <img
          src="/logo-full.png"
          alt="DImarket Build & Renovate"
          className={`h-full w-full object-contain transform-gpu ${current.fullImage}`}
        />
      </div>
    )
  }

  // Іконковий режим залишає тільки компактний знак.
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
