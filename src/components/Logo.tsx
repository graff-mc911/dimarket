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

      {/* Підпис показуємо лише у більших розмірах,
          щоб логотип у шапці не виглядав перевантаженим. */}
      {showSubtitle && (
        <div className={`mt-1.5 text-[#5c4d41] ${current.subtitle}`}>
          <div className="flex items-center gap-2">
            <span className="h-px w-6 shrink-0 bg-[rgba(169,105,66,0.35)]" />
            <span className="whitespace-nowrap font-semibold uppercase tracking-[0.16em]">
              Everything for construction & renovation
            </span>
          </div>
        </div>
      )}
    </div>
  )

  // Текстовий режим повертає лише назву бренду.
  if (variant === 'text') {
    return <div className={className}>{wordmark}</div>
  }

  // Іконковий режим потрібен для компактних місць інтерфейсу.
  if (variant === 'icon') {
    return <BrandMark className={`${current.mark} ${className}`} />
  }

  // Стандартний режим: знак плюс назва.
  return (
    <div className={`flex items-center ${current.gap} ${className}`}>
      <BrandMark className={current.mark} />
      {wordmark}
    </div>
  )
}

function BrandMark({ className }: { className?: string }) {
  const id = useId()
  const bgGradient = `${id}-bg`
  const bronzeGradient = `${id}-bronze`
  const roofGradient = `${id}-roof`

  return (
    <svg
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className || ''} shrink-0 drop-shadow-[0_14px_28px_rgba(82,54,32,0.10)]`}
      aria-label="DImarket logo"
      role="img"
    >
      <defs>
        {/* Фон робимо світлим і теплим,
            щоб знак виглядав дорогим і чистим на glass-інтерфейсі. */}
        <linearGradient id={bgGradient} x1="12" y1="10" x2="116" y2="118" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFDF9" />
          <stop offset="1" stopColor="#F3E9DD" />
        </linearGradient>

        {/* Теплий бронзовий градієнт використовуємо для покрівлі та літери I. */}
        <linearGradient id={bronzeGradient} x1="80" y1="44" x2="103" y2="112" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D5A57C" />
          <stop offset="1" stopColor="#8D5636" />
        </linearGradient>

        <linearGradient id={roofGradient} x1="25" y1="20" x2="103" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C98E61" />
          <stop offset="1" stopColor="#A96942" />
        </linearGradient>
      </defs>

      {/* Зовнішня форма без важких декоративних елементів:
          просто м'який преміальний картуш. */}
      <rect
        x="7"
        y="7"
        width="114"
        height="114"
        rx="30"
        fill={`url(#${bgGradient})`}
        stroke="#E6D6C5"
        strokeWidth="1.5"
      />

      {/* Дах робимо легким і тонким,
          щоб він тільки натякав на будинок, а не домінував над знаком. */}
      <path
        d="M25 45L64 18L103 45"
        stroke={`url(#${roofGradient})`}
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Невеликий димар дає завершення силуету зверху. */}
      <rect x="84" y="20" width="10" height="15" rx="2" fill="#5C4D41" />

      {/* Основу D робимо масивною і спокійною,
          щоб знак читався впевнено навіть на малих розмірах. */}
      <path
        d="M31 54H54C72.5 54 84 66 84 83C84 100 72.5 112 54 112H31V54Z"
        fill="#241B14"
      />

      {/* Внутрішній виріз тримає форму D чистою й елегантною. */}
      <path
        d="M43 67H53C63 67 69.5 73.5 69.5 83C69.5 92.5 63 99 53 99H43V67Z"
        fill="#FFF9F2"
      />

      {/* Скошений нижній кут додає знаку характеру
          і прибирає відчуття грубого прямокутного блоку. */}
      <path d="M31 112L43 99V112H31Z" fill="#FFF9F2" />

      {/* Праву стійку стилізуємо як витончену літеру I у фірмовій бронзі. */}
      <path
        d="M84 53.5C92 55.5 98 62 98 71V112H84V53.5Z"
        fill={`url(#${bronzeGradient})`}
      />

      {/* Основа знизу візуально збирає композицію. */}
      <path
        d="M80 112H103"
        stroke="#5C4D41"
        strokeWidth="4.2"
        strokeLinecap="round"
      />

      {/* Синьо-жовте вікно залишаємо як впізнаваний акцент бренду. */}
      <rect x="47" y="76" width="7.5" height="7.5" rx="1.35" fill="#0057B7" />
      <rect x="56.5" y="76" width="7.5" height="7.5" rx="1.35" fill="#0057B7" />
      <rect x="47" y="85.5" width="7.5" height="7.5" rx="1.35" fill="#FFD700" />
      <rect x="56.5" y="85.5" width="7.5" height="7.5" rx="1.35" fill="#FFD700" />
    </svg>
  )
}
