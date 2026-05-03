/**
 * Єдиний компонент логотипу DImarket.
 * Використовуємо ваш готовий файл логотипу без зміни кольорів/стилю.
 */
interface LogoProps {
  variant?: 'full' | 'icon'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeMap = {
  sm: { full: 'h-8', icon: 'h-8' },
  md: { full: 'h-10', icon: 'h-10' },
  lg: { full: 'h-14', icon: 'h-14' },
  xl: { full: 'h-20', icon: 'h-20' },
} as const

export function Logo({ variant = 'full', size = 'md', className = '' }: LogoProps) {
  const sizeClass = variant === 'icon' ? sizeMap[size].icon : sizeMap[size].full
  const src = '/logo-main.png' // Ваш оригінальний логотип у public

  if (variant === 'icon') {
    return (
      <img
        src={src}
        alt="DImarket"
        className={`${sizeClass} w-auto object-contain ${className}`}
        loading="eager"
      />
    )
  }

  return (
    <img
      src={src}
      alt="DImarket — Build & Renovate"
      className={`${sizeClass} w-auto object-contain ${className}`}
      loading="eager"
    />
  )
}