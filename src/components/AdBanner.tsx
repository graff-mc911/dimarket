import { useEffect, useMemo, useState } from 'react'
import { ExternalLink, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useApp } from '../contexts/AppContext'

interface AdBannerProps {
  position: 'left' | 'right'
  sticky?: boolean
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

export function AdBanner({ position, sticky = true }: AdBannerProps) {
  const { t } = useApp()

  const [ads, setAds] = useState<AdRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    void loadAds()
  }, [])

  // Вибираємо лише ту рекламу, яка підходить під desktop-позицію банера.
  const activeAd = useMemo(() => {
    return ads.find((ad) => matchesDesktopPlacement(ad, position)) || null
  }, [ads, position])

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

  return (
    <aside
      className={`hidden lg:block w-full ${sticky ? 'sticky top-20' : ''} h-fit`}
      style={{ maxHeight: sticky ? 'calc(100vh - 6rem)' : undefined }}
    >
      <div className="glass-card relative overflow-hidden p-3">
        <button
          onClick={() => setDismissed(true)}
          type="button"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(255,251,247,0.82)] text-[#7a7168] transition hover:bg-white hover:text-[#2f2a24]"
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
            <AdCardContent
              headline={headline}
              description={description}
              imageUrl={activeAd.image_url || null}
              ctaText={ctaText}
              showCta={true}
            />
          </button>
        ) : (
          <AdCardContent
            headline={headline}
            description={description}
            imageUrl={activeAd.image_url || null}
            ctaText={ctaText}
            showCta={false}
          />
        )}
      </div>
    </aside>
  )
}

function AdCardContent({
  headline,
  description,
  imageUrl,
  ctaText,
  showCta,
}: {
  headline: string
  description: string
  imageUrl: string | null
  ctaText: string
  showCta: boolean
}) {
  return (
    <div>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={headline}
          className="h-[220px] w-full rounded-[20px] object-cover"
        />
      ) : (
        <div className="flex h-[220px] w-full items-end rounded-[20px] bg-[linear-gradient(180deg,rgba(236,227,216,0.82),rgba(214,198,180,0.92))] p-5">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8e7b69]">
              Advertising
            </div>
            <div className="mt-2 text-xl font-extrabold leading-tight text-[#2f2a24]">
              {headline}
            </div>
          </div>
        </div>
      )}

      <div className="px-1 pb-1 pt-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9b8773]">
          Advertising
        </div>

        <h3 className="mt-2 text-lg font-extrabold leading-tight text-[#2f2a24]">
          {headline}
        </h3>

        {description && (
          <p className="mt-2 text-sm leading-6 text-[#6f665d]">
            {description}
          </p>
        )}

        {showCta && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[rgba(170,111,71,0.12)] px-4 py-2 text-sm font-semibold text-[#8d5b38]">
            <span>{ctaText}</span>
            <ExternalLink className="h-4 w-4" />
          </div>
        )}
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

function matchesDesktopPlacement(ad: AdRecord, position: 'left' | 'right') {
  const placementValue = [ad.slot, ad.position, ad.placement]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  const deviceValue = (ad.device || '').toLowerCase()

  const matchesDevice =
    deviceValue === '' ||
    deviceValue === 'all' ||
    deviceValue === 'desktop' ||
    deviceValue === 'web'

  if (!matchesDevice) {
    return false
  }

  if (placementValue === '') {
    return true
  }

  if (position === 'left') {
    return placementValue.includes('left') || placementValue.includes('sidebar')
  }

  return placementValue.includes('right') || placementValue.includes('sidebar')
}
