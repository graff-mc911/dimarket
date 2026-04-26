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
      return 'Construction service'
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

  const formatBudget = () => {
    if (!listing.price) {
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
      className="glass-card group flex h-full flex-col overflow-hidden text-left transition duration-200 hover:-translate-y-0.5"
    >
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="rounded-full bg-[rgba(242,171,116,0.18)] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#9a5525]">
              {typeLabel}
            </span>

            <span className="rounded-full bg-white/65 px-3 py-1 text-xs font-semibold text-[#6f665d]">
              {categoryLabel}
            </span>
          </div>

          <span className="rounded-full bg-[rgba(126,180,141,0.16)] px-3 py-1 text-xs font-bold text-[#3d7a52]">
            {listing.status}
          </span>
        </div>

        <div className="flex gap-4">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={listing.title}
              className="h-24 w-24 shrink-0 rounded-[22px] object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[22px] bg-[linear-gradient(135deg,rgba(255,244,234,0.95),rgba(244,186,134,0.72))] text-[#9a5525]">
              <ClipboardList className="h-8 w-8" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-xl font-extrabold leading-tight text-[#2f2a24] transition group-hover:text-[#9a5525]">
              {listing.title}
            </h3>

            <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#6f665d]">
              {listing.description}
            </p>
          </div>
        </div>

        <div className="grid gap-2 text-sm text-[#7a7168]">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>{listing.location || 'Location not specified'}</span>
          </div>

          {visibilityRadius && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 shrink-0" />
              <span>{getVisibilityLabel(visibilityRadius)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto border-t border-[rgba(190,168,150,0.28)] px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9d8b7a]">
              Budget
            </div>
            <div className="mt-1 text-lg font-extrabold text-[#2f2a24]">
              {formatBudget()}
            </div>
          </div>

          <div className="text-right text-xs text-[#7a7168]">
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
    </button>
  )
}
