import { MapPin, Calendar, Star, Globe } from 'lucide-react'
import { ListingWithImages } from '../lib/types'
import { useApp } from '../contexts/AppContext'

interface ListingCardProps {
  listing: ListingWithImages
}

export function ListingCard({ listing }: ListingCardProps) {
  const { currency, t } = useApp()
  const primaryImage = listing.images?.[0]?.image_url || 'https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg?auto=compress&cs=tinysrgb&w=600'

  const formatPrice = (price: number | null) => {
    if (!price) return 'Contact for price'
    return `${currency.symbol}${price.toLocaleString()}`
  }

  const getListingTypeLabel = (type: string) => {
    const labels = {
      service_request: 'Service Needed',
      service_offer: 'Service Offered',
      item_sale: 'For Sale',
      item_wanted: 'Wanted',
    }
    return labels[type as keyof typeof labels] || type
  }

  const daysRemaining = Math.ceil(
    (new Date(listing.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )

  const getVisibilityLabel = (radius: string) => {
    const labels: Record<string, string> = {
      city: t('visibility.city') || 'Місто',
      district: t('visibility.district') || 'Район',
      region: t('visibility.region') || 'Область',
      country: t('visibility.country') || 'Країна',
      state: t('visibility.state') || 'Штат',
      land: t('visibility.land') || 'Земля (DE)',
      global: t('visibility.global') || 'Всі користувачі',
    }
    return labels[radius] || radius
  }

  return (
    <a
      href={`/listing/${listing.id}`}
      className={`group block bg-white rounded-xl shadow-sm hover:shadow-xl transition-all overflow-hidden border ${
        listing.is_premium ? 'border-orange-300 ring-2 ring-orange-200' : 'border-gray-200 hover:border-blue-200'
      }`}
    >
      {listing.is_premium && (
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-semibold px-3 py-1 flex items-center">
          <Star className="w-3 h-3 mr-1 fill-current" />
          PREMIUM
        </div>
      )}

      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={primaryImage}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 bg-blue-900 text-white text-xs px-2 py-1 rounded-md">
          {getListingTypeLabel(listing.listing_type)}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-900 transition line-clamp-2 mb-2">
          {listing.title}
        </h3>

        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {listing.description}
        </p>

        <div className="space-y-2 mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-500 text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{listing.location}</span>
            </div>
            {listing.price && (
              <div className="text-lg font-bold text-blue-900">
                {formatPrice(listing.price)}
              </div>
            )}
          </div>
          {(listing as any).visibility_radius && (
            <div className="flex items-center text-gray-500 text-xs">
              <Globe className="w-3 h-3 mr-1" />
              <span>{getVisibilityLabel((listing as any).visibility_radius)}</span>
            </div>
          )}
        </div>

        {listing.category && (
          <div className="inline-block text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md mb-2">
            {listing.category.name}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{daysRemaining} days left</span>
          </div>
          <span>{listing.views_count} views</span>
        </div>
      </div>
    </a>
  )
}
