interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Logo({ size = 'md', className = '' }: LogoProps) {

  // 🔧 розміри (значно збільшені)
  const sizes = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
  }

  const currentSize = sizes[size]

  return (
    <div className={`${currentSize} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >

        {/* 🔥 фон */}
        <rect width="100" height="100" rx="22" fill="#F5E9D8" />

        {/* 🔥 дах (збільшений і жирніший) */}
        <path
          d="M15 45 L50 20 L85 45"
          stroke="#E85D04"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 🔥 буква D (більша) */}
        <path
          d="M20 48 H45 C62 48 72 60 72 76 C72 92 62 100 45 100 H20 Z"
          fill="#1A1A1A"
        />

        {/* виріз D */}
        <path
          d="M38 62 H48 C56 62 60 68 60 76 C60 84 56 90 48 90 H38 Z"
          fill="#F5E9D8"
        />

        {/* 🔥 буква I (товща і більша) */}
        <rect x="76" y="48" width="12" height="52" fill="#E85D04" />

      </svg>
    </div>
  )
}