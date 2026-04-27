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

  if (variant === 'icon') {
    return (
      <div className={`bg-gradient-to-br from-primary to-secondary ${currentSize.icon} rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-white font-bold text-xl">DI</span>
      </div>
    )
  }

  if (variant === 'text') {
    return (
      <span className={`font-bold text-dark ${currentSize.text} ${className}`}>
        Dimarket
      </span>
    )
  }

  return (
    <div className={`flex items-center ${currentSize.container} ${className}`}>
      <div className={`bg-gradient-to-br from-primary to-secondary p-2 rounded-lg`}>
        <div className="text-white font-bold text-xl">DI</div>
      </div>
      <span className={`font-bold text-dark ${currentSize.text}`}>Dimarket</span>
    </div>
  )
}
