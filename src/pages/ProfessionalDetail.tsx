/**
 * Сторінка профілю майстра за ID (`/professional/:id`).
 * Показує публічні поля з таблиці profiles. На мобільному — зручні відступи та крупний аватар.
 */
import { useEffect, useState } from 'react'
import { ArrowLeft, MapPin, MessageCircle, Star } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Profile } from '../lib/types'
import { navigateTo } from '../lib/navigation'

interface ProfessionalDetailProps {
  profileId: string
}

export function ProfessionalDetail({ profileId }: ProfessionalDetailProps) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError(null)

      try {
        const { data, error: qError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', profileId)
          .maybeSingle()

        if (cancelled) {
          return
        }

        if (qError) {
          setError(qError.message)
          setProfile(null)
          return
        }

        if (!data) {
          setError('Профіль не знайдено.')
          setProfile(null)
          return
        }

        if (!data.is_professional) {
          setError('Цей профіль не позначений як майстер.')
          setProfile(data)
          return
        }

        setProfile(data)
        setError(null)
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Невідома помилка завантаження.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [profileId])

  if (loading) {
    return (
      <div className="w-full px-4 py-10 md:px-6 text-center text-gray-600">
        Завантаження профілю…
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="w-full px-4 py-10 md:px-6 max-w-2xl mx-auto">
        <button
          type="button"
          onClick={() => navigateTo('/professionals')}
          className="inline-flex items-center gap-2 text-blue-900 font-medium mb-6 min-h-[44px]"
        >
          <ArrowLeft className="w-5 h-5" />
          До каталогу майстрів
        </button>
        <p className="text-gray-700">{error || 'Профіль недоступний.'}</p>
      </div>
    )
  }

  const avatarUrl =
    profile.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      profile.full_name || 'User'
    )}&background=1e3a8a&color=fff`

  const ratingLabel = profile.rating > 0 ? profile.rating.toFixed(1) : 'Новий'

  return (
    <div className="w-full pb-10">
      <div className="w-full px-4 md:px-6 xl:px-8 2xl:px-10 max-w-3xl mx-auto pt-6">
        <button
          type="button"
          onClick={() => navigateTo('/professionals')}
          className="inline-flex items-center gap-2 text-blue-900 font-medium mb-4 min-h-[44px]"
        >
          <ArrowLeft className="w-5 h-5" />
          Назад до майстрів
        </button>

        {error && (
          <p className="mb-4 text-amber-800 text-sm bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="relative h-36 md:h-40 bg-gradient-to-br from-blue-900 to-blue-700">
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0">
              <img
                src={avatarUrl}
                alt={profile.full_name || 'Майстер'}
                className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white object-cover shadow-md"
              />
            </div>
          </div>

          <div className="pt-16 md:pt-14 px-4 md:px-8 pb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center md:text-left">
              {profile.full_name || 'Майстер'}
            </h1>

            {profile.location && (
              <div className="flex items-center justify-center md:justify-start gap-1 text-gray-600 mt-2">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>{profile.location}</span>
              </div>
            )}

            <div className="flex items-center justify-center md:justify-start gap-2 mt-4">
              <Star className="w-6 h-6 text-yellow-400 fill-current" />
              <span className="font-semibold text-gray-900 text-lg">{ratingLabel}</span>
              <span className="text-gray-500 text-sm">({profile.total_reviews} відгуків)</span>
            </div>

            {profile.bio && (
              <p className="mt-6 text-gray-700 leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
            )}

            {profile.website && (
              <p className="mt-4 text-sm break-all">
                <span className="font-medium text-gray-900">Сайт: </span>
                <a href={profile.website} className="text-blue-900 underline" target="_blank" rel="noreferrer">
                  {profile.website}
                </a>
              </p>
            )}

            {profile.phone && (
              <p className="mt-2 text-sm">
                <span className="font-medium text-gray-900">Телефон: </span>
                <a href={`tel:${profile.phone}`} className="text-blue-900 underline">
                  {profile.phone}
                </a>
              </p>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => navigateTo('/listings')}
                className="flex items-center justify-center gap-2 w-full sm:flex-1 bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 transition font-medium min-h-[48px]"
              >
                <MessageCircle className="w-5 h-5" />
                Переглянути оголошення
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}