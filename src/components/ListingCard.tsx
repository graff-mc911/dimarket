import { useEffect, useState } from 'react'
import { MapPin, Calendar, Star, Globe, Heart } from 'lucide-react'
import { ListingWithImages } from '../lib/types'
import { useApp } from '../contexts/AppContext'
import { navigateTo } from '../lib/navigation'
import { supabase } from '../lib/supabase'

interface ListingCardProps {
  listing: ListingWithImages
}

export function ListingCard({ listing }: ListingCardProps) {
  const { currency, t, user } = useApp()

  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    checkFavorite()
  }, [user, listing.id])

  const checkFavorite = async () => {
    const { data } = await supabase
      .from('favorite_listings')
      .select('id')
      .eq('user_id', user?.id)
      .eq('listing_id', listing.id)
      .maybeSingle()

    setIsFavorite(Boolean(data))
  }

  const toggleFavorite = async (event: React.MouseEvent) => {
    event.stopPropagation()

    if (!user) {
      navigateTo('/login')
      return
    }

    if (favoriteLoading) return
    setFavoriteLoading(true)

    try {
      if (isFavorite) {
        await supabase
          .from('favorite_listings')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', listing.id)

        setIsFavorite(false)
      } else {
        await supabase
          .from('favorite_listings')
          .insert({
            user_id: user.id,
            listing_id: listing.id,
          })

        setIsFavorite(true)
      }
    } finally {
      setFavoriteLoading(false)
    }
  }

  const primaryImage =
    listing.images?.[0]?.image_url ||
    'https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg?auto=compress&cs=tinysrgb&w=600'

  const formatPrice = (price: number | null) => {
    if (!price) return t('common.contactForPrice') || 'Уточнюйте ціну'
    return `${currency.symbol}${price.toLocaleString()}`
  }

  const getListingTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      service_request: 'Потрібна послуга',
      service_offer: 'Пропоную послугу',
      item_sale: 'Продаж',
      item_wanted: 'Пошук товару',
    }

    return labels[type] || type
  }

  const expiresAt = new Date(listing.expires_at).getTime()
  const now = new Date().getTime()
  const daysRemaining = Math.max(
    0,
    Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24))
  )

  const getVisibilityLabel = (radius: string) => {
    const labels: Record<string, string> = {
      city: 'Місто',
      district: 'Район',
      region: 'Область',
      country: 'Країна',
      state: 'Штат',
      land: 'Земля',
      global: 'Всі користувачі',
    }

    return labels[radius] || radius
  }

  return (
    <div
      onClick={() => navigateTo(`/listing/${listing.id}`)}
      className={`group block w-full text-left bg-white rounded-xl shadow-sm hover:shadow-xl transition-all overflow-hidden border cursor-pointer ${
        listing.is_premium
          ? 'border-orange-300 ring-2 ring-orange-200'
          : 'border-gray-200 hover:border-blue-200'
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

        <button
          onClick={toggleFavorite}
          disabled={favoriteLoading}
          type="button"
          className={`absolute top-2 left-2 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition ${
            isFavorite
              ? 'bg-red-500 text-white'
              : 'bg-white/90 text-gray-700 hover:bg-white hover:text-red-500'
          }`}
          title={isFavorite ? 'Видалити з обраного' : 'Додати в обране'}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

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
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center text-gray-500 text-sm min-w-0">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{listing.location}</span>
            </div>

            {listing.price && (
              <div className="text-lg font-bold text-blue-900 whitespace-nowrap">
                {formatPrice(listing.price)}
              </div>
            )}
          </div>

          {(listing as ListingWithImages & { visibility_radius?: string }).visibility_radius && (
            <div className="flex items-center text-gray-500 text-xs">
              <Globe className="w-3 h-3 mr-1" />
              <span>
                {getVisibilityLabel(
                  (listing as ListingWithImages & { visibility_radius?: string }).visibility_radius || ''
                )}
              </span>
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
            <span>{daysRemaining} дн.</span>
          </div>

          <span>{listing.views_count} переглядів</span>
        </div>
      </div>
    </div>
  )
}