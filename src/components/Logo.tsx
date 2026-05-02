interface LogoProps {
  variant?: 'full' | 'icon' | 'dark'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  sm: 'h-8',
  md: 'h-11',
  lg: 'h-14',
  xl: 'h-20',
} as const

export function Logo({ variant = 'full', size = 'md', className = '' }: LogoProps) {
  const currentSize = sizes[size]

  // Повний логотип для світлого фону
  if (variant === 'full') {
    return (
      <img
        src="/logo-main.png"
        alt="DImarket"
        className={`${currentSize} w-auto object-contain ${className}`}
      />
    )
  }

  // Іконка без тексту для мобільного меню, favicon-зони або маленьких блоків
  if (variant === 'icon') {
    return (
      <img
        src="/logo-icon.png"
        alt="DImarket"
        className={`${currentSize} w-auto object-contain ${className}`}
      />
    )
  }

  // Версія для темного фону
  return (
    <img
      src="/logo-dark.png"
      alt="DImarket"
      className={`${currentSize} w-auto object-contain ${className}`}
    />
  )
}