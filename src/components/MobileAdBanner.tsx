import { useState } from 'react'
import { useApp } from '../contexts/AppContext'

interface MobileAdBannerProps {
  variant: 'inline' | 'sticky' | 'horizontal'
}

export function MobileAdBanner({ variant }: MobileAdBannerProps) {
  const { t } = useApp()
  const [adVisible, setAdVisible] = useState(true)

  if (!adVisible) return null

  if (variant === 'inline') {
    return (
      <div className="lg:hidden bg-gradient-to-br from-cream-50 to-cream rounded-lg p-4 relative mb-4 border border-primary/20">
        <button
          onClick={() => setAdVisible(false)}
          className="absolute top-1 right-1 text-dark-gray/40 hover:text-dark-gray text-xs transition z-10"
          aria-label={t('ads.close')}
        >
          ✕
        </button>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="w-full h-32 bg-gradient-to-br from-primary to-primary-hover rounded flex items-center justify-center text-white font-bold text-sm">
            {t('ads.adSpace')}
          </div>
          <p className="text-xs text-dark-gray/60 text-center mt-2">320 x 100px</p>
        </div>
      </div>
    )
  }

  if (variant === 'sticky') {
    return (
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-secondary/20 p-2 shadow-lg z-40">
        <button
          onClick={() => setAdVisible(false)}
          className="absolute top-1 right-1 text-dark-gray/40 hover:text-dark-gray text-xs transition z-10"
          aria-label={t('ads.close')}
        >
          ✕
        </button>
        <div className="w-full h-16 bg-gradient-to-r from-secondary to-secondary-hover rounded flex items-center justify-center text-white font-bold text-sm">
          {t('ads.stickyAdBlock')}
        </div>
        <p className="text-xs text-dark-gray/60 text-center mt-1">320 x 50px</p>
      </div>
    )
  }

  if (variant === 'horizontal') {
    return (
      <div className="lg:hidden bg-gradient-to-r from-cream-50 to-cream rounded-lg p-3 relative mb-4 border border-primary/20">
        <button
          onClick={() => setAdVisible(false)}
          className="absolute top-1 right-1 text-dark-gray/40 hover:text-dark-gray text-xs transition z-10"
          aria-label={t('ads.close')}
        >
          ✕
        </button>
        <div className="w-full h-20 bg-gradient-to-r from-primary to-secondary rounded flex items-center justify-center text-white font-bold text-sm">
          {t('ads.bannerAd')}
        </div>
        <p className="text-xs text-dark-gray/60 text-center mt-1">320 x 60px</p>
      </div>
    )
  }

  return null
}
