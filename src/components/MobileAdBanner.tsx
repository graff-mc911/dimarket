import { Megaphone, X } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../contexts/AppContext'

interface MobileAdBannerProps {
  variant: 'inline' | 'sticky' | 'horizontal'
}

export function MobileAdBanner({ variant }: MobileAdBannerProps) {
  const { t } = useApp()
  const [adVisible, setAdVisible] = useState(true)

  if (!adVisible) {
    return null
  }

  if (variant === 'sticky') {
    return (
      <div className="fixed bottom-3 left-3 right-3 z-40 lg:hidden">
        <div className="glass-card relative overflow-hidden border border-[rgba(242,171,116,0.28)] px-4 py-3 shadow-[0_18px_45px_rgba(89,63,48,0.14)]">
          <button
            onClick={() => setAdVisible(false)}
            type="button"
            className="absolute right-3 top-3 rounded-full border border-white/70 bg-white/75 p-1 text-[#7a7168] transition hover:bg-white hover:text-[#2f2a24]"
            aria-label={t('ads.close')}
          >
            <X className="h-3.5 w-3.5" />
          </button>

          <div className="pr-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(242,171,116,0.18)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#9a5525]">
              <Megaphone className="h-3.5 w-3.5" />
              <span>{t('ads.adSpace')}</span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-extrabold text-[#2f2a24]">
                  {t('ads.stickyAdBlock')}
                </div>
                <p className="mt-1 text-xs leading-5 text-[#6f665d]">
                  {t('ads.premiumPlacement')}
                </p>
              </div>

              <div className="rounded-full bg-[rgba(242,171,116,0.18)] px-3 py-2 text-xs font-semibold text-[#9a5525]">
                320 x 50
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const cardHeightClass = variant === 'horizontal' ? 'h-20' : 'h-28'
  const text = variant === 'horizontal' ? t('ads.bannerAd') : t('ads.advertiseHere')
  const sizeLabel = variant === 'horizontal' ? '320 x 60' : '320 x 100'

  return (
    <div className="lg:hidden">
      <div className="glass-card relative overflow-hidden border border-[rgba(242,171,116,0.24)] p-4 shadow-[0_16px_38px_rgba(89,63,48,0.08)]">
        <button
          onClick={() => setAdVisible(false)}
          type="button"
          className="absolute right-3 top-3 rounded-full border border-white/70 bg-white/75 p-1 text-[#7a7168] transition hover:bg-white hover:text-[#2f2a24]"
          aria-label={t('ads.close')}
        >
          <X className="h-3.5 w-3.5" />
        </button>

        <div className="flex items-start gap-3 pr-8">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[16px] bg-[rgba(242,171,116,0.18)] text-[#9a5525]">
            <Megaphone className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <div className="text-sm font-extrabold text-[#2f2a24]">
              {t('ads.adSpace')}
            </div>
            <p className="mt-1 text-xs leading-5 text-[#6f665d]">
              {text}
            </p>
          </div>
        </div>

        <div
          className={`mt-4 flex w-full items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,rgba(242,171,116,0.92),rgba(201,109,44,0.9))] text-sm font-bold text-white ${cardHeightClass}`}
        >
          {variant === 'horizontal' ? t('ads.bannerAd') : t('ads.adSpace')}
        </div>

        <div className="mt-3 text-center text-xs font-medium text-[#7a7168]">
          {sizeLabel}
        </div>
      </div>
    </div>
  )
}
