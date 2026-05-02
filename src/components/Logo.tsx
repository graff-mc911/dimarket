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

  // 🔥 ЧИСТА SVG ІКОНКА (без дрібних деталей)
  const Icon = (
    <svg
      viewBox="0 0 100 100"
      className={currentSize.icon}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* фон */}
      <rect width="100" height="100" rx="20" fill="#F5E9D8" />

      {/* дах */}
      <path
        d="M20 45 L50 25 L80 45"
        stroke="#E85D04"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* D */}
      <path
        d="M25 50 H45 C58 50 66 60 66 75 C66 90 58 98 45 98 H25 Z"
        fill="#1A1A1A"
      />

      {/* виріз D */}
      <path
        d="M38 63 H44 C49 63 52 67 52 75 C52 83 49 87 44 87 H38 Z"
        fill="#F5E9D8"
      />

      {/* I */}
      <rect x="70" y="50" width="10" height="48" fill="#E85D04" />
    </svg>
  )

  // 🔹 ICON ONLY
  if (variant === 'icon') {
    return <div className={className}>{Icon}</div>
  }

  // 🔹 TEXT ONLY
  if (variant === 'text') {
    return (
      <span className={`font-bold ${currentSize.text} ${className}`}>
        <span style={{ color: '#E85D04' }}>DI</span>
        <span style={{ color: '#1A1A1A' }}>market</span>
      </span>
    )
  }

  // 🔹 FULL LOGO
  return (
    <div className={`flex items-center ${currentSize.container} ${className}`}>
      {Icon}

      <div className="leading-none">
        <div className={`font-bold ${currentSize.text}`}>
          <span style={{ color: '#E85D04' }}>DI</span>
          <span style={{ color: '#1A1A1A' }}>market</span>
        </div>

        {size === 'lg' || size === 'xl' ? (
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#4A2E1E] mt-1">
            будівництво і ремонт
          </div>
        ) : null}
      </div>
    </div>
  )
}