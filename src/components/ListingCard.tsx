import { useEffect, useState } from 'react'
import { Star, MapPin, MessageCircle, Heart } from 'lucide-react'
import { Profile } from '../lib/types'
import { navigateTo } from '../lib/navigation'
import { useApp } from '../contexts/AppContext'
import { supabase } from '../lib/supabase'

interface ProfessionalCardProps {
  professional: Profile
}

export function ProfessionalCard({ professional }: ProfessionalCardProps) {
  const { user } = useApp()

  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    checkFavorite()
  }, [user, professional.id])

  const checkFavorite = async () => {
    const { data } = await supabase
      .from('favorite_professionals')
      .select('id')
      .eq('user_id', user?.id)
      .eq('professional_id', professional.id)
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
          .from('favorite_professionals')
          .delete()
          .eq('user_id', user.id)
          .eq('professional_id', professional.id)

        setIsFavorite(false)
      } else {
        await supabase
          .from('favorite_professionals')
          .insert({
            user_id: user.id,
            professional_id: professional.id,
          })

        setIsFavorite(true)
      }
    } finally {
      setFavoriteLoading(false)
    }
  }

  const avatarUrl =
    professional.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      professional.full_name || 'User'
    )}&background=1e3a8a&color=fff`

  const ratingLabel =
    professional.rating > 0 ? professional.rating.toFixed(1) : 'Новий'

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden border border-gray-200">
      <div className="relative h-32 bg-gradient-to-br from-blue-900 to-blue-700">
        <button
          onClick={toggleFavorite}
          disabled={favoriteLoading}
          type="button"
          className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition z-10 ${
            isFavorite
              ? 'bg-red-500 text-white'
              : 'bg-white/90 text-gray-700 hover:bg-white hover:text-red-500'
          }`}
          title={isFavorite ? 'Видалити з обраного' : 'Додати в обране'}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        <div className="absolute -bottom-12 left-6">
          <img
            src={avatarUrl}
            alt={professional.full_name || 'Майстер'}
            className="w-24 h-24 rounded-full border-4 border-white object-cover"
          />
        </div>
      </div>

      <div className="pt-14 px-6 pb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-1">
          {professional.full_name || 'Майстер'}
        </h3>

        {professional.location && (
          <div className="flex items-center text-gray-500 text-sm mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{professional.location}</span>
          </div>
        )}

        <div className="flex items-center mb-3">
          <div className="flex items-center">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="ml-1 font-semibold text-gray-900">
              {ratingLabel}
            </span>
          </div>

          <span className="text-gray-500 text-sm ml-2">
            ({professional.total_reviews} відгуків)
          </span>
        </div>

        {professional.bio && (
          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
            {professional.bio}
          </p>
        )}

        <button
          onClick={() => navigateTo(`/professional/${professional.id}`)}
          type="button"
          className="flex items-center justify-center space-x-2 w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition font-medium"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Переглянути</span>
        </button>
      </div>
    </div>
  )
}