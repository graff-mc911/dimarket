import { useEffect, useMemo, useState } from 'react'
import { ExternalLink, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useApp } from '../contexts/AppContext'

interface MobileAdBannerProps {
  variant: 'inline' | 'sticky' | 'horizontal'
}

interface AdRecord {
  id: string | number
  title?: string | null
  description?: string | null
  image_url?: string | null
  link_url?: string | null
  cta_text?: string | null
  company_name?: string | null
  slot?: string | null
  position?: string | null
  placement?: string | null
  device?: string | null
  is_active?: boolean | null
  status?: string | null
  starts_at?: string | null
  ends_at?: string | null
}

export function MobileAdBanner({ variant }: MobileAdBannerProps) {
  const { t } = useApp()

  const [ads, setAds] = useState<AdRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    void loadAds()
  }, [])

  // Для mobile показуємо тільки релевантну рекламу під конкретний variant.
  const activeAd = useMemo(() => {
    return ads.find((ad) => matchesMobilePlacement(ad, variant)) || null
  }, [ads, variant])

  const loadAds = async () => {
    setLoading(true)

    try {
      const resolvedAds = await resolveActiveAds()
      setAds(resolvedAds)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAd = () => {
    if (!activeAd?.link_url) {
      return
    }

    window.open(activeAd.link_url, '_blank', 'noopener,noreferrer')
  }

  if (dismissed || loading || !activeAd) {
    return null
  }

  const headline =
    activeAd.title || activeAd.company_name || t('ads.advertiseHere')
  const description = activeAd.description || ''
  const ctaText = activeAd.cta_text || 'Open'
  const isClickable = Boolean(activeAd.link_url)

  if (variant === 'sticky') {
    return (
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[rgba(197,180,162,0.45)] bg-[rgba(255,251,247,0.92)] p-2 shadow-[0_-8px_24px_rgba(88,72,58,0.08)] backdrop-blur-xl">
        <button
          onClick={() => setDismissed(true)}
          type="button"
          className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#7a7168] transition hover:text-[#2f2a24]"
          aria-label={t('ads.close')}
        >
          <X className="h-4 w-4" />
        </button>

        {isClickable ? (
          <button
            onClick={handleOpenAd}
            type="button"
            className="block w-full text-left"
          >
            <MobileStickyContent
              headline={headline}
              imageUrl={activeAd.image_url || null}
            />
          </button>
        ) : (
          <MobileStickyContent
            headline={headline}
            imageUrl={activeAd.image_url || null}
          />
        )}
      </div>
    )
  }

  const containerClass =
    variant === 'horizontal'
      ? 'lg:hidden relative mb-4 overflow-hidden rounded-[22px] border border-white/70 bg-[rgba(255,250,246,0.82)] p-3 shadow-[0_10px_24px_rgba(88,72,58,0.06)] backdrop-blur-xl'
      : 'lg:hidden relative mb-4 overflow-hidden rounded-[22px] border border-white/70 bg-[rgba(255,250,246,0.82)] p-3 shadow-[0_10px_24px_rgba(88,72,58,0.06)] backdrop-blur-xl'

  return (
    <div className={containerClass}>
      <button
        onClick={() => setDismissed(true)}
        type="button"
        className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#7a7168] transition hover:text-[#2f2a24]"
        aria-label={t('ads.close')}
      >
        <X className="h-4 w-4" />
      </button>

      {isClickable ? (
        <button
          onClick={handleOpenAd}
          type="button"
          className="block w-full text-left"
        >
          <MobileCardContent
            headline={headline}
            description={description}
            imageUrl={activeAd.image_url || null}
            ctaText={ctaText}
            compact={variant === 'horizontal'}
          />
        </button>
      ) : (
        <MobileCardContent
          headline={headline}
          description={description}
          imageUrl={activeAd.image_url || null}
          ctaText={ctaText}
          compact={variant === 'horizontal'}
        />
      )}
    </div>
  )
}

function MobileCardContent({
  headline,
  description,
  imageUrl,
  ctaText,
  compact,
}: {
  headline: string
  description: string
  imageUrl: string | null
  ctaText: string
  compact: boolean
}) {
  return (
    <div>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={headline}
          className={`${compact ? 'h-24' : 'h-36'} w-full rounded-[18px] object-cover`}
        />
      ) : (
        <div
          className={`${
            compact ? 'h-20' : 'h-32'
          } flex w-full items-end rounded-[18px] bg-[linear-gradient(180deg,rgba(236,227,216,0.82),rgba(214,198,180,0.92))] p-4`}
        >
          <div className="text-base font-extrabold leading-tight text-[#2f2a24]">
            {headline}
          </div>
        </div>
      )}

      <div className="px-1 pb-1 pt-3">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9b8773]">
          Advertising
        </div>

        <h3 className="mt-2 text-base font-extrabold leading-tight text-[#2f2a24]">
          {headline}
        </h3>

        {!compact && description && (
          <p className="mt-2 text-sm leading-6 text-[#6f665d]">
            {description}
          </p>
        )}

        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[rgba(170,111,71,0.12)] px-3 py-1.5 text-sm font-semibold text-[#8d5b38]">
          <span>{ctaText}</span>
          <ExternalLink className="h-4 w-4" />
        </div>
      </div>
    </div>
  )
}

function MobileStickyContent({
  headline,
  imageUrl,
}: {
  headline: string
  imageUrl: string | null
}) {
  return (
    <div className="flex items-center gap-3 rounded-[16px] bg-[rgba(250,244,237,0.92)] p-2.5">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={headline}
          className="h-12 w-12 rounded-[12px] object-cover"
        />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[rgba(170,111,71,0.12)] text-xs font-bold text-[#8d5b38]">
          AD
        </div>
      )}

      <div className="min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9b8773]">
          Advertising
        </div>
        <div className="truncate text-sm font-bold text-[#2f2a24]">
          {headline}
        </div>
      </div>
    </div>
  )
}

async function resolveActiveAds(): Promise<AdRecord[]> {
  const client = supabase as any
  const now = new Date().toISOString()
  const tableNames = ['advertising', 'ad_slots']

  for (const tableName of tableNames) {
    try {
      const { data, error } = await client.from(tableName).select('*').limit(24)

      if (error || !Array.isArray(data)) {
        continue
      }

      return data
        .filter((item) => isRenderableAd(item))
        .filter((item) => isAdActiveNow(item, now))
    } catch {
      continue
    }
  }

  return []
}

function isRenderableAd(ad: AdRecord) {
  return Boolean(ad.title || ad.company_name || ad.image_url || ad.description)
}

function isAdActiveNow(ad: AdRecord, nowIso: string) {
  if (ad.is_active === false) {
    return false
  }

  if (ad.status) {
    const normalizedStatus = ad.status.toLowerCase()
    const activeStatuses = ['active', 'published', 'running']

    if (!activeStatuses.includes(normalizedStatus)) {
      return false
    }
  }

  if (ad.starts_at && ad.starts_at > nowIso) {
    return false
  }

  if (ad.ends_at && ad.ends_at < nowIso) {
    return false
  }

  return true
}

function matchesMobilePlacement(
  ad: AdRecord,
  variant: 'inline' | 'sticky' | 'horizontal'
) {
  const placementValue = [ad.slot, ad.position, ad.placement]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  const deviceValue = (ad.device || '').toLowerCase()

  const matchesDevice =
    deviceValue === '' ||
    deviceValue === 'all' ||
    deviceValue === 'mobile'

  if (!matchesDevice) {
    return false
  }

  if (placementValue === '') {
    return true
  }

  if (variant === 'sticky') {
    return placementValue.includes('sticky') || placementValue.includes('bottom')
  }

  if (variant === 'horizontal') {
    return (
      placementValue.includes('horizontal') ||
      placementValue.includes('top') ||
      placementValue.includes('header')
    )
  }

  return (
    placementValue.includes('inline') ||
    placementValue.includes('between') ||
    placementValue.includes('feed')
  )
}
