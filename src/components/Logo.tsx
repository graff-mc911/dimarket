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
    title: 'text-[1.28rem]',
    subtitle: 'text-[8px]',
  },
  md: {
    gap: 'gap-3',
    mark: 'h-[50px] w-[50px]',
    title: 'text-[1.82rem]',
    subtitle: 'text-[9px]',
  },
  lg: {
    gap: 'gap-3.5',
    mark: 'h-[60px] w-[60px]',
    title: 'text-[2.18rem]',
    subtitle: 'text-[10px]',
  },
  xl: {
    gap: 'gap-4',
    mark: 'h-[72px] w-[72px]',
    title: 'text-[2.65rem]',
    subtitle: 'text-[11px]',
  },
} as const

export function Logo({ variant = 'full', size = 'md', className = '' }: LogoProps) {
  const current = sizes[size]
  const showSubtitle = variant !== 'icon' && (size === 'lg' || size === 'xl')

  // Текстову частину збираємо окремо,
  // щоб логотип можна було безболісно показувати як повністю, так і без знака.
  const wordmark = (
    <div className="min-w-0 leading-none">
      <div className={`font-[var(--font-display)] ${current.title} leading-[0.92]`}>
        <span className="font-black tracking-[-0.06em] text-[#b06e46]">DI</span>
        <span className="ml-0.5 font-black tracking-[-0.055em] text-[#211913]">market</span>
      </div>

      {/* Підпис показуємо тільки на більших розмірах,
          щоб у хедері логотип залишався чистим і не виглядав важким. */}
      {showSubtitle && (
        <div className={`mt-2 flex items-center gap-2 text-[#5c4d41] ${current.subtitle}`}>
          <span className="h-px w-6 shrink-0 bg-[linear-gradient(90deg,rgba(169,105,66,0),rgba(169,105,66,0.55))]" />
          <span className="whitespace-nowrap font-semibold uppercase tracking-[0.18em]">
            Everything for construction & renovation
          </span>
          <span className="h-px w-10 shrink-0 bg-[linear-gradient(90deg,rgba(169,105,66,0.55),rgba(169,105,66,0))]" />
        </div>
      )}
    </div>
  )

  // Текстовий режим лишає тільки назву бренду.
  if (variant === 'text') {
    return <div className={className}>{wordmark}</div>
  }

  // Іконковий режим потрібен для вузьких місць інтерфейсу.
  if (variant === 'icon') {
    return <BrandMark className={`${current.mark} ${className}`} />
  }

  // Основний варіант: знак + назва бренду.
  return (
    <div className={`flex items-center ${current.gap} ${className}`}>
      <BrandMark className={current.mark} />
      {wordmark}
    </div>
  )
}

function BrandMark({ className }: { className?: string }) {
  const id = useId()
  const frameGradient = `${id}-frame`
  const panelGradient = `${id}-panel`
  const bronzeGradient = `${id}-bronze`
  const roofGradient = `${id}-roof`
  const glowGradient = `${id}-glow`

  return (
    <svg
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className || ''} shrink-0 drop-shadow-[0_18px_34px_rgba(82,54,32,0.14)]`}
      aria-label="DImarket logo"
      role="img"
    >
      <defs>
        {/* Зовнішня рамка дає м'який дорогий ефект замість плоского квадрата. */}
        <linearGradient id={frameGradient} x1="14" y1="10" x2="112" y2="118" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFDFC" />
          <stop offset="1" stopColor="#F1E7DA" />
        </linearGradient>

        {/* Темна центральна панель додає контрасту
            і робить знак більш преміальним. */}
        <linearGradient id={panelGradient} x1="24" y1="18" x2="96" y2="110" gradientUnits="userSpaceOnUse">
          <stop stopColor="#342B23" />
          <stop offset="1" stopColor="#161210" />
        </linearGradient>

        {/* Теплий бронзовий градієнт використовуємо для акцентів бренду. */}
        <linearGradient id={bronzeGradient} x1="78" y1="42" x2="108" y2="116" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D09A6B" />
          <stop offset="1" stopColor="#8D5636" />
        </linearGradient>

        <linearGradient id={roofGradient} x1="24" y1="18" x2="102" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D8B589" />
          <stop offset="1" stopColor="#A96942" />
        </linearGradient>

        {/* Ледь помітне світло зверху пом'якшує темну панель. */}
        <radialGradient
          id={glowGradient}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(64 24) rotate(90) scale(42 60)"
        >
          <stop stopColor="#FFFFFF" stopOpacity="0.22" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Зовнішня підкладка тримає знак чистим на будь-якому світлому фоні. */}
      <rect
        x="7"
        y="7"
        width="114"
        height="114"
        rx="30"
        fill={`url(#${frameGradient})`}
        stroke="#E3D1BE"
        strokeWidth="1.5"
      />

      {/* Внутрішня темна площина створює глибину
          і відразу робить знак дорожчим на вигляд. */}
      <rect
        x="18"
        y="18"
        width="92"
        height="92"
        rx="24"
        fill={`url(#${panelGradient})`}
      />

      <rect
        x="18"
        y="18"
        width="92"
        height="92"
        rx="24"
        fill={`url(#${glowGradient})`}
      />

      {/* Дах робимо тонким і точним,
          щоб замість важкого "будиночка" був акуратний преміальний силует. */}
      <path
        d="M26 47L64 20L102 47"
        stroke={`url(#${roofGradient})`}
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Димар залишаємо стриманим, без зайвої масивності. */}
      <rect x="84" y="21" width="10" height="16" rx="2" fill="#C79A72" />

      {/* Основна літера D тепер світла на темному фоні,
          тому читається чисто і виглядає значно дорожче. */}
      <path
        d="M32 56H52C69.5 56 81 67.5 81 83C81 98.5 69.5 110 52 110H32V56Z"
        fill="#F8F1E7"
      />

      {/* Внутрішній виріз повертає темний фон,
          щоб форма D не злипалась і добре читалась у малому розмірі. */}
      <path
        d="M44 68H51C60.5 68 67 74.5 67 83C67 91.5 60.5 98 51 98H44V68Z"
        fill="#1B1512"
      />

      {/* Скошений низ прибирає відчуття грубого блоку
          і додає знаку більшої дизайнерської пластики. */}
      <path d="M32 110L44 98V110H32Z" fill="#1B1512" />

      {/* Праву стійку стилізуємо як витончену літеру I в бронзі. */}
      <path
        d="M84 54C92.5 56 99 63 99 72V110H84V54Z"
        fill={`url(#${bronzeGradient})`}
      />

      {/* Нижня база збирає композицію і робить силует завершеним. */}
      <path
        d="M80 110H103"
        stroke="#C79A72"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Синьо-жовте вікно зберігаємо як окремий впізнаваний акцент бренду. */}
      <rect x="47" y="76" width="7.5" height="7.5" rx="1.4" fill="#0057B7" />
      <rect x="56.5" y="76" width="7.5" height="7.5" rx="1.4" fill="#0057B7" />
      <rect x="47" y="85.5" width="7.5" height="7.5" rx="1.4" fill="#FFD700" />
      <rect x="56.5" y="85.5" width="7.5" height="7.5" rx="1.4" fill="#FFD700" />
    </svg>
  )
}
