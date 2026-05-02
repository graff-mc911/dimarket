interface LogoProps {
  variant?: 'full' | 'icon' | 'text'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  sm: {
    gap: 'gap-2.5',
    mark: 'h-10 w-10',
    title: 'text-[1.35rem]',
    subtitle: 'text-[8px]',
  },
  md: {
    gap: 'gap-3',
    mark: 'h-[50px] w-[50px]',
    title: 'text-[1.9rem]',
    subtitle: 'text-[9px]',
  },
  lg: {
    gap: 'gap-3.5',
    mark: 'h-[60px] w-[60px]',
    title: 'text-[2.2rem]',
    subtitle: 'text-[10px]',
  },
  xl: {
    gap: 'gap-4',
    mark: 'h-[72px] w-[72px]',
    title: 'text-[2.7rem]',
    subtitle: 'text-[11px]',
  },
} as const

export function Logo({ variant = 'full', size = 'md', className = '' }: LogoProps) {
  const current = sizes[size]
  const showSubtitle = size === 'lg' || size === 'xl'

  // Текстову частину будуємо окремо,
  // щоб її можна було гнучко показувати із знаком або без нього.
  const wordmark = (
    <div className="min-w-0 leading-none">
      <div
        className={`font-[var(--font-display)] ${current.title} font-black tracking-[-0.06em] text-[#241b14]`}
      >
        <span className="text-[#a96942]">DI</span>
        <span className="text-[#241b14]">market</span>
      </div>

      {/* Підпис лишаємо тільки на більших розмірах,
          щоб логотип у шапці не виглядав перевантаженим. */}
      {showSubtitle && (
        <div className={`mt-1.5 max-w-[18rem] text-[#5c4d41] ${current.subtitle}`}>
          <div className="flex items-center gap-2">
            <span className="h-px w-5 shrink-0 bg-[rgba(169,105,66,0.35)]" />
            <span className="font-semibold uppercase tracking-[0.14em] leading-[1.35]">
              Everything for construction & renovation
            </span>
          </div>
        </div>
      )}
    </div>
  )

  // Режим text віддає тільки назву бренду.
  if (variant === 'text') {
    return <div className={className}>{wordmark}</div>
  }

  // Режим icon потрібен для місць,
  // де має лишитися тільки знак без тексту.
  if (variant === 'icon') {
    return <BrandMark className={`${current.mark} ${className}`} />
  }

  // Основний режим — знак плюс назва бренду.
  return (
    <div className={`flex items-center ${current.gap} ${className}`}>
      <BrandMark className={current.mark} />
      {wordmark}
    </div>
  )
}

function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className || ''} shrink-0 drop-shadow-[0_12px_28px_rgba(82,54,32,0.10)]`}
      aria-label="DImarket logo"
      role="img"
    >
      {/* М'яка основа під знак, щоб логотип красиво виглядав на світлому glass-фоні. */}
      <rect
        x="7"
        y="7"
        width="114"
        height="114"
        rx="28"
        fill="#FBF7F1"
        stroke="#E7D6C4"
        strokeWidth="1.5"
      />

      {/* Дах робимо тоншим і симетричним,
          щоб вся композиція виглядала спокійно й акуратно. */}
      <path
        d="M21 47L64 16L107 47"
        stroke="#A96942"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Димар тримаємо темним для контрасту й балансу правої частини знака. */}
      <rect x="83" y="18" width="13" height="19" rx="2.5" fill="#5C4D41" />

      {/* Основна форма літери D. */}
      <path
        d="M30 54H56C76.5 54 90 67 90 86C90 105 76.5 118 56 118H30V54Z"
        fill="#241B14"
      />

      {/* Світлий внутрішній виріз робить D чистішою і краще читається на малому розмірі. */}
      <path
        d="M43 68H55C65 68 72 75 72 86C72 97 65 104 55 104H43V68Z"
        fill="#FDFBF7"
      />

      {/* Нижній скошений кут додає знаку характеру
          і прибирає враження важкого прямокутного блоку. */}
      <path d="M30 118L43 104V118H30Z" fill="#FBF7F1" />

      {/* Права стійка працює як стилізована літера I
          і водночас підтримує силует будинку. */}
      <path
        d="M86 53C95 55 102 62 102 72V118H86V53Z"
        fill="#8D5636"
      />

      {/* Основа внизу замикає композицію
          і допомагає знаку стояти впевнено. */}
      <path
        d="M82 118H106"
        stroke="#5C4D41"
        strokeWidth="4.5"
        strokeLinecap="round"
      />

      {/* Синьо-жовте вікно навмисно зберігаємо як окремий впізнаваний акцент. */}
      <rect x="49" y="76" width="8" height="8" rx="1.4" fill="#0057B7" />
      <rect x="59" y="76" width="8" height="8" rx="1.4" fill="#0057B7" />
      <rect x="49" y="86" width="8" height="8" rx="1.4" fill="#FFD700" />
      <rect x="59" y="86" width="8" height="8" rx="1.4" fill="#FFD700" />
    </svg>
  )
}
