import { useId } from 'react'

interface LogoProps {
  variant?: 'full' | 'icon' | 'text'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  sm: {
    gap: 'gap-2.5',
    mark: 'h-10 w-10',
    title: 'text-[1.22rem]',
    subtitle: 'text-[8px]',
  },
  md: {
    gap: 'gap-3',
    mark: 'h-[50px] w-[50px]',
    title: 'text-[1.72rem]',
    subtitle: 'text-[9px]',
  },
  lg: {
    gap: 'gap-3.5',
    mark: 'h-[60px] w-[60px]',
    title: 'text-[2.06rem]',
    subtitle: 'text-[10px]',
  },
  xl: {
    gap: 'gap-4',
    mark: 'h-[72px] w-[72px]',
    title: 'text-[2.5rem]',
    subtitle: 'text-[11px]',
  },
} as const

export function Logo({ variant = 'full', size = 'md', className = '' }: LogoProps) {
  const current = sizes[size]
  const showSubtitle = variant === 'full' && (size === 'lg' || size === 'xl')

  // Назву бренду тримаємо окремо від знака,
  // щоб компонент легко працював у повному, текстовому й іконковому режимах.
  const wordmark = (
    <div className="min-w-0 leading-none">
      <div className={`font-[var(--font-display)] ${current.title} whitespace-nowrap leading-[0.92]`}>
        <span className="font-black tracking-[-0.055em] text-[#a96942]">DI</span>
        <span className="ml-0.5 font-black tracking-[-0.05em] text-[#241b14]">market</span>
      </div>

      {/* Підпис показуємо лише у більших розмірах
