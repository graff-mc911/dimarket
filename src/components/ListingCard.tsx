import { Calendar, ClipboardList, Globe, MapPin } from 'lucide-react'
import { ListingWithImages } from '../lib/types'
import { useApp } from '../contexts/AppContext'
import { navigateTo } from '../lib/navigation'

interface ListingCardProps {
  listing: ListingWithImages
}

export function ListingCard({ listing }: ListingCardProps) {
  const { currency, t } = useApp()

  const primaryImage = listing.images?.[0]?.image_url || null
  const daysRemaining = Math.max(
    0,
    Math.ceil(
      (new Date(listing.expires_at).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    )
  )

  const translateUnsafe = (key: string) => {
    return t(key as never)
  }

  const getListingTypeLabel = () => {
    const labels: Record<string, string> = {
      service_request: t('listings.typeServiceRequest'),
      service_offer: t('listings.typeServiceOffer'),
      item_sale: t('listings.typeItemSale'),
      item_wanted: t('listings.typeItemWanted'),
    }

    return labels[listing.listing_type] || listing.listing_type
  }

  const getCategoryLabel = () => {
    if (!listing.category) {
      return t('listing.constructionService')
    }

    const newKey = `category.name.${listing.category.slug}`
    const newValue = translateUnsafe(newKey)

    if (newValue !== newKey) {
      return newValue
    }

    const legacyKey = `category.${listing.category.slug}`
    const legacyValue = translateUnsafe(legacyKey)

    if (legacyValue !== legacyKey) {
      return legacyValue
    }

    return listing.category.name
  }

  const getVisibilityLabel = (radius: string) => {
    const labels: Record<string, string> = {
      city: t('visibility.city'),
      district: t('visibility.district'),
      region: t('visibility.region'),
      country: t('visibility.country'),
      state: t('visibility.state'),
      land: t('visibility.land'),
      global: t('visibility.global'),
    }

    return labels[radius] || radius
  }

  const getStatusLabel = () => {
    if (listing.status === 'active') {
      return t('home.activeLabel')
    }

    return listing.status
  }

  const formatBudget = () => {
    if (listing.price === null || listing.price === undefined) {
      return t('listing.contactForPrice')
    }

    return `${currency.symbol}${listing.price.toLocaleString()}`
  }

  const typeLabel = getListingTypeLabel()
  const categoryLabel = getCategoryLabel()
  const visibilityRadius = (listing as { visibility_radius?: string | null }).visibility_radius

  return (
    <button
      onClick={() => navigateTo(`/listing/${listing.id}`)}
      type="button"
      className="glass-card group flex h-full flex-col overflow-hidden text-left transition duration-300 hover:-translate-y-1"
    >
      {primaryImage ? (
        <img
          src={primaryImage}
          alt={listing.title}
          className="h-52 w-full object-cover"
        />
      ) : (
        <div className="flex h-52 w-full items-center justify-center bg-[linear-gradient(135deg,rgba(255,248,241,0.82),rgba(244,210,180,0.56))] text-[var(--accent-700)]">
          <ClipboardList className="h-12 w-12" />
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="rounded-full border border-[var(--glass-border)] bg-[rgba(242,171,116,0.14)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-700)]">
              {typeLabel}
            </span>

            <span className="rounded-full border border-[var(--glass-border)] bg-[rgba(255,252,248,0.38)] px-3 py-1 text-[11px] font-semibold text-[var(--ink-700)]">
              {categoryLabel}
            </span>
          </div>

          <span className="rounded-full border border-[rgba(111,145,125,0.18)] bg-[rgba(111,145,125,0.08)] px-3 py-1 text-[10px] font-semibold text-[#3d7a52]">
            {getStatusLabel()}
          </span>
        </div>

        <h3 className="mt-4 line-clamp-2 text-[1.02rem] font-bold leading-[1.3] tracking-[-0.02em] text-[var(--ink-900)] transition group-hover:text-[var(--accent-700)] md:text-[1.08rem]">
          {listing.title}
        </h3>

        <p className="muted-text mt-3 line-clamp-3 text-[13px]">
          {listing.description}
        </p>

        <div className="mt-4 space-y-2 text-[13px] text-[var(--ink-700)]">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-[var(--accent-700)]" />
            <span>{listing.location || t('listing.locationNotSpecified')}</span>
          </div>

          {visibilityRadius && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 shrink-0 text-[var(--accent-700)]" />
              <span>{getVisibilityLabel(visibilityRadius)}</span>
            </div>
          )}
        </div>

        <div className="mt-5 border-t border-[var(--glass-border)] pt-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-500)]">
                {t('listing.budget')}
              </div>
              <div className="mt-1 text-[1rem] font-bold text-[var(--ink-900)]">
                {formatBudget()}
              </div>
            </div>

            <div className="text-right text-[12px] text-[var(--ink-500)]">
              <div className="flex items-center justify-end gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {daysRemaining} {t('listing.daysLeft')}
                </span>
              </div>
              <div className="mt-1">
                {listing.views_count} {t('listing.views')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}
