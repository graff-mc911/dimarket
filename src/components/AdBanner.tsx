import { X } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../contexts/AppContext'

interface AdBannerProps {
  position: 'left' | 'right'
  sticky?: boolean
}

export function AdBanner({ position, sticky = true }: AdBannerProps) {
  const { t } = useApp()
  const [adVisible, setAdVisible] = useState(true)

  if (!adVisible) {
    return null
  }

  const alignClass = position === 'left' ? 'origin-top-left' : 'origin-top-right'

  return (
    <aside
      className={`hidden h-fit w-full lg:block ${sticky ? 'sticky top-20' : ''} ${alignClass}`}
      style={{ maxHeight: sticky ? 'calc(100vh - 6rem)' : undefined }}
    >
      <div className="glass-card relative overflow-hidden border border-[rgba(242,171,116,0.18)] p-5">
        <button
          onClick={() => setAdVisible(false)}
          type="button"
          className="absolute right-3 top-3 rounded-full border border-white/70 bg-white/75 p-1 text-[#7a7168] transition hover:bg-white hover:text-[#2f2a24]"
          aria-label={t('ads.close')}
        >
          <X className="h-3.5 w-3.5" />
        </button>

        <div className="space-y-4 text-center">
          <div className="rounded-[24px] bg-white/80 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <div className="mb-4 flex h-48 w-full items-center justify-center rounded-[22px] bg-[linear-gradient(135deg,rgba(242,171,116,0.92),rgba(201,109,44,0.9))] text-xl font-bold text-white">
              {t('ads.adSpace')}
            </div>

            <p className="text-sm font-semibold text-[#2f2a24]">
              {t('ads.advertiseHere')}
            </p>
            <p className="mt-2 text-xs text-[#7a7168]">300 x 250px</p>
          </div>

          <div className="rounded-[24px] bg-white/80 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <div className="mb-3 flex h-32 w-full items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,rgba(61,122,82,0.92),rgba(39,95,61,0.92))] text-base font-bold text-white">
              {t('ads.bannerAd')}
            </div>

            <p className="text-xs text-[#7a7168]">300 x 100px</p>
          </div>

          <div className="border-t border-[rgba(190,168,150,0.28)] pt-3 text-xs text-[#7a7168]">
            <p>{t('ads.premiumPlacement')}</p>
            <p className="mt-1 font-semibold text-[#9a5525]">{t('ads.contactRates')}</p>
          </div>
        </div>
      </div>

      {sticky && (
        <div className="glass-card mt-4 border border-[rgba(61,122,82,0.16)] p-4">
          <div className="flex h-24 w-full items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,rgba(61,122,82,0.92),rgba(39,95,61,0.92))] text-sm font-bold text-white">
            {t('ads.stickyAdBlock')}
          </div>
          <p className="mt-2 text-center text-xs text-[#7a7168]">300 x 80px</p>
        </div>
      )}
    </aside>
  )
}
