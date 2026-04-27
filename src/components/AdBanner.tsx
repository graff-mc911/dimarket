import { useState } from 'react'
import { useApp } from '../contexts/AppContext'

interface AdBannerProps {
  position: 'left' | 'right'
  sticky?: boolean
}

export function AdBanner({ position, sticky = true }: AdBannerProps) {
  const { t } = useApp()
  const [adVisible, setAdVisible] = useState(true)

  if (!adVisible) return null

  return (
    <aside
      className={`hidden lg:block w-full ${sticky ? 'sticky top-20' : ''} h-fit`}
      style={{ maxHeight: sticky ? 'calc(100vh - 6rem)' : undefined }}
    >
      <div className="bg-gradient-to-br from-cream-50 to-cream rounded-lg p-6 relative overflow-hidden border-2 border-primary/20">
        <button
          onClick={() => setAdVisible(false)}
          className="absolute top-2 right-2 text-dark-gray/40 hover:text-dark-gray text-xs transition"
          aria-label={t('ads.close')}
        >
          ✕
        </button>

        <div className="text-center space-y-4">
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="w-full h-48 bg-gradient-to-br from-primary to-primary-hover rounded-lg flex items-center justify-center text-white font-bold text-xl mb-4">
              {t('ads.adSpace')}
            </div>
            <p className="text-sm text-dark-gray mb-2">
              {t('ads.advertiseHere')}
            </p>
            <p className="text-xs text-dark-gray/60">
              300 x 250px
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="w-full h-32 bg-gradient-to-br from-secondary to-secondary-hover rounded-lg flex items-center justify-center text-white font-bold mb-3">
              {t('ads.bannerAd')}
            </div>
            <p className="text-xs text-dark-gray/60">
              300 x 100px
            </p>
          </div>

          <div className="text-xs text-dark-gray/60 pt-2 border-t border-primary/20">
            <p>{t('ads.premiumPlacement')}</p>
            <p className="text-primary font-semibold mt-1">{t('ads.contactRates')}</p>
          </div>
        </div>
      </div>

      {sticky && (
        <div className="bg-white border-2 border-secondary/20 rounded-lg p-4 mt-4">
          <div className="w-full h-24 bg-gradient-to-r from-secondary to-secondary-hover rounded flex items-center justify-center text-white font-bold text-sm">
            {t('ads.stickyAdBlock')}
          </div>
          <p className="text-xs text-dark-gray/60 text-center mt-2">300 x 80px</p>
        </div>
      )}
    </aside>
  )
}
