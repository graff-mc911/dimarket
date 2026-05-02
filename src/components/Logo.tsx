interface LogoProps {
  compact?: boolean
  className?: string
}

export function Logo({ compact = false, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>

      {/* 🔥 ВБУДОВАНИЙ ЛОГОТИП */}
      <img
        alt="DImarket"
        className="w-[52px] h-[52px] object-contain shrink-0"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..." 
      />

      {!compact && (
        <div className="leading-none">
          <div className="text-2xl font-semibold tracking-normal">
            <span className="text-[#c47b42]">DI</span>
            <span className="text-[#241b14]">market</span>
          </div>

          <div className="text-[11px] uppercase tracking-[0.02em] text-[#5c4d41] mt-1">
            Build & Renovate
          </div>
        </div>
      )}
    </div>
  )
}