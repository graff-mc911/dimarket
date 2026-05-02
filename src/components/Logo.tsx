interface LogoProps {
  compact?: boolean
  className?: string
}

export function Logo({ compact = false, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* 
        ІКОНКА DImarket у стилі Apple / Notion:
        - прості форми
        - мʼякі кути
        - мінімум дрібних деталей
        - добре читається навіть у маленькому розмірі
      */}
      <svg
        width="52"
        height="52"
        viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        role="img"
        aria-label="DImarket logo"
      >
        {/* 
          Основний фон іконки.
          Колір теплий бежевий — під будівництво, дерево, матеріали.
        */}
        <rect
          x="6"
          y="6"
          width="108"
          height="108"
          rx="28"
          fill="#F5E9D8"
        />

        {/* 
          Мʼяка внутрішня тінь/рамка.
          Дає відчуття якісної app icon, але не перевантажує.
        */}
        <rect
          x="6.5"
          y="6.5"
          width="107"
          height="107"
          rx="27.5"
          fill="none"
          stroke="rgba(74, 46, 30, 0.16)"
        />

        {/* 
          Стилізований дах.
          Не як реалістичний будинок, а як чистий геометричний символ.
        */}
        <path
          d="M31 51 L60 30 L89 51"
          fill="none"
          stroke="#E85D04"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 
          Основна форма D.
          Вона велика, масивна і рівна — це головний бренд-символ.
        */}
        <path
          d="M30 58 H55 C73 58 84 70 84 86 C84 102 73 111 55 111 H30 V58 Z"
          fill="#1A1A1A"
        />

        {/* 
          Внутрішній виріз у D.
          Робить літеру читабельною і не дає їй виглядати як чорна пляма.
        */}
        <path
          d="M45 73 H55 C64 73 69 78 69 86 C69 94 64 99 55 99 H45 V73 Z"
          fill="#F5E9D8"
        />

        {/* 
          Літера I.
          Проста вертикальна форма у помаранчевому кольорі.
          Вона балансує чорну D і додає енергію.
        */}
        <rect
          x="90"
          y="58"
          width="10"
          height="53"
          rx="4"
          fill="#E85D04"
        />

        {/* 
          Малий коричневий акцент знизу.
          Дає іконці “будівельну” вагу, але не виглядає як зайва деталь.
        */}
        <rect
          x="88"
          y="108"
          width="16"
          height="4"
          rx="2"
          fill="#4A2E1E"
        />

        {/* 
          Український акцент у вікні:
          верх — синій, низ — жовтий.
          Дуже маленька деталь, але вона додає характер бренду.
        */}
        <rect
          x="50"
          y="80"
          width="10"
          height="5"
          rx="1.5"
          fill="#0057B7"
        />
        <rect
          x="50"
          y="86"
          width="10"
          height="5"
          rx="1.5"
          fill="#FFD700"
        />
      </svg>

      {/* 
        Текстова частина логотипу.
        Якщо compact=true — показуємо тільки іконку.
        Це зручно для мобільного меню, favicon-зони або вузьких місць.
      */}
      {!compact && (
        <div className="leading-none">
          {/* 
            Назва бренду.
            DI — помаранчевий акцент.
            market — чорний, щоб текст виглядав стабільно і дорого.
          */}
          <div className="text-2xl font-sora font-semibold tracking-normal">
            <span className="text-[#E85D04]">DI</span>
            <span className="text-[#1A1A1A]">market</span>
          </div>

          {/* 
            Короткий підпис.
            tracking дуже малий, щоб текст не розтягувався.
          */}
          <div className="text-[10px] font-sora uppercase tracking-[0.004em] text-[#4A2E1E] mt-1">
            Build & Renovate
          </div>
        </div>
      )}
    </div>
  )
}