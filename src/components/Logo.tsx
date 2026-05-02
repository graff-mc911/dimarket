interface LogoProps {
  variant?: 'full' | 'icon' | 'text'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Logo({ variant = 'full', size = 'md', className = '' }: LogoProps) {
  // Розміри залишені як у старому компоненті,
  // щоб логотип не став раптово меншим або більшим у Header.
  const sizes = {
    sm: { icon: 'w-6 h-6', text: 'text-lg', container: 'space-x-1' },
    md: { icon: 'w-8 h-8', text: 'text-xl', container: 'space-x-2' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', container: 'space-x-3' },
    xl: { icon: 'w-16 h-16', text: 'text-4xl', container: 'space-x-4' },
  }

  const currentSize = sizes[size]

  // SVG-іконка замість старого простого блоку "DI".
  // Вона зроблена максимально простою, щоб не розмивалась у малому розмірі.
  const Icon = (
    <div
      className={`${currentSize.icon} rounded-lg overflow-hidden flex items-center justify-center shrink-0`}
    >
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full block"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="DImarket logo"
      >
        {/* Бежевий фон під тему будівництва */}
        <rect width="120" height="120" rx="24" fill="#F5E9D8" />

        {/* Помаранчевий дах — асоціація з будинком / ремонтом / будівництвом */}
        <path
          d="M22 50 L60 24 L98 50"
          fill="none"
          stroke="#E85D04"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Коричнева основа під дахом */}
        <path
          d="M31 52 H89"
          stroke="#4A2E1E"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Літера D — чорна, масивна, добре читається навіть у малому розмірі */}
        <path
          d="M28 58 H55 C72 58 84 70 84 88 C84 105 72 114 55 114 H28 V58 Z"
          fill="#1A1A1A"
        />

        {/* Внутрішній виріз D */}
        <path
          d="M44 73 H55 C64 73 70 79 70 88 C70 97 64 102 55 102 H44 V73 Z"
          fill="#F5E9D8"
        />

        {/* Помаранчева літера I */}
        <rect x="91" y="58" width="14" height="56" rx="3" fill="#E85D04" />

        {/* Нижній коричневий акцент — додає будівельний характер */}
        <path
          d="M88 114 H108"
          stroke="#4A2E1E"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )

  // Варіант тільки іконки
  if (variant === 'icon') {
    return <div className={className}>{Icon}</div>
  }

  // Варіант тільки тексту
  if (variant === 'text') {
    return (
      <span className={`font-bold ${currentSize.text} ${className}`}>
        <span className="text-[#E85D04]">DI</span>
        <span className="text-[#1A1A1A]">market</span>
      </span>
    )
  }

  // Повний варіант: іконка + текст
  return (
    <div className={`flex items-center ${currentSize.container} ${className}`}>
      {Icon}

      <span className={`font-bold ${currentSize.text}`}>
        <span className="text-[#E85D04]">DI</span>
        <span className="text-[#1A1A1A]">market</span>
      </span>
    </div>
  )
}