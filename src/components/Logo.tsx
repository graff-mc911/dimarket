// Тип пропсів для логотипу
interface LogoProps {
  variant?: 'full' | 'icon' | 'dark' // який варіант логотипу показувати
  size?: 'sm' | 'md' | 'lg' | 'xl'   // розмір логотипу
  className?: string                 // додаткові стилі (Tailwind)
}

// Розміри логотипу (тільки висота, ширина автоматично)
const sizes = {
  sm: 'h-8',
  md: 'h-11',
  lg: 'h-14',
  xl: 'h-20',
} as const

export function Logo({ variant = 'full', size = 'md', className = '' }: LogoProps) {
  const currentSize = sizes[size]

  /*
    🔹 variant = "full"
    Повний логотип (іконка + текст)
    Використовуємо на світлому фоні (header, головна)
  */
  if (variant === 'full') {
    return (
      <img
        src="/logo-main.png"        // основний логотип
        alt="DImarket"
        className={`${currentSize} w-auto object-contain ${className}`}
      />
    )
  }

  /*
    🔹 variant = "icon"
    Тільки іконка без тексту
    Використовуємо:
    - мобільне меню
    - маленькі блоки
    - sidebar
  */
  if (variant === 'icon') {
    return (
      <img
        src="/logo-icon.png"        // квадратна іконка
        alt="DImarket icon"
        className={`${currentSize} w-auto object-contain ${className}`}
      />
    )
  }

  /*
    🔹 variant = "dark"
    Логотип для темного фону
    Використовуємо:
    - footer
    - темні блоки
  */
  return (
    <img
      src="/logo-dark.png"         // версія для темного фону
      alt="DImarket dark"
      className={`${currentSize} w-auto object-contain ${className}`}
    />
  )
}