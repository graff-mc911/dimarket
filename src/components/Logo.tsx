interface LogoProps {
  variant?: 'full' | 'icon' | 'text'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Logo({ variant = 'full', size = 'md', className = '' }: LogoProps) {
  const sizes = {
    sm: { icon: 'w-6 h-6', text: 'text-lg', container: 'space-x-1' },
    md: { icon: 'w-8 h-8', text: 'text-xl', container: 'space-x-2' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', container: 'space-x-3' },
    xl: { icon: 'w-16 h-16', text: 'text-4xl', container: 'space-x-4' },
  }

  const currentSize = sizes[size]

  // 🔥 ПРОСТИЙ І ДОРОГИЙ СИМВОЛ
  const Icon = (
    <div className={`${currentSize.icon} rounded-xl overflow-hidden`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* фон */}
        <rect width="100" height="100" rx="22" fill="#F5E9D8" />

        {/* D */}
        <path
          d="M22 25 H48 C70 25 80 38 80 60 C80 82 70 95 48 95 H22 Z"
          fill="#1A1A1A"
        />

        {/* виріз */}
        <path
          d="M38 42 H48 C58 42 64 48 64 60 C64 72 58 78 48 78 H38 Z"
          fill="#F5E9D8"
        />

        {/* I */}
        <rect x="70" y="25" width="10" height="70" fill="#E85D04" />
      </svg>
    </div>
  )

  if (variant === 'icon') {
    return <div className={className}>{Icon}</div>
  }

  if (variant === 'text') {
    return (
      <span className={`font-bold ${currentSize.text} ${className}`}>
        <span style={{ color: '#E85D04' }}>DI</span>
        <span style={{ color: '#1A1A1A' }}>market</span>
      </span>
    )
  }

  return (
    <div className={`flex items-center ${currentSize.container} ${className}`}>
      {Icon}

      <span className={`font-bold ${currentSize.text}`}>
        <span style={{ color: '#E85D04' }}>DI</span>
        <span style={{ color: '#1A1A1A' }}>market</span>
      </span>
    </div>
  )
}