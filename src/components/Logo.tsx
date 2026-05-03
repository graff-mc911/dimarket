import { useState } from 'react'

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
  const [src, setSrc] = useState('/logo-main.png')
  const sizeClass = variant === 'icon' ? sizeMap[size].icon : sizeMap[size].full

  return (
    <img
      src={src}
      alt={variant === 'icon' ? 'DImarket' : 'DImarket — Build & Renovate'}
      className={`${sizeClass} w-auto object-contain ${className}`}
      loading="eager"
      onError={() => {
        // fallback, якщо png відсутній
        if (src !== '/logo-main.jpg') setSrc('/logo-main.jpg')
      }}
    />
  )
}