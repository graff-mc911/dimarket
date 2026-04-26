import { useEffect, useState } from 'react'
import { Heart, FileText, Users } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useApp } from '../contexts/AppContext'
import { ListingWithImages, Profile } from '../lib/types'
import { ListingCard } from '../components/ListingCard'
import { ProfessionalCard } from '../components/ProfessionalCard'
import { navigateTo } from '../lib/navigation'

export function Favorites() {
  const { user } = useApp()

  // Активна вкладка:
  // listings       -> обрані оголошення
  // professionals  -> обрані майстри
  const [activeTab, setActiveTab] = useState<'listings' | 'professionals'>('listings')

  // Збережені оголошення користувача
  const [favoriteListings, setFavoriteListings] = useState<ListingWithImages[]>([])

  // Збережені майстри користувача
  const [favoriteProfessionals, setFavoriteProfessionals] = useState<Profile[]>([])

  // Стан завантаження
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Якщо користувач не увійшов, немає сенсу вантажити обране.
    if (!user) {
      setLoading(false)
      return
    }

    loadFavorites()
  }, [user])

  const loadFavorites = async () => {
    setLoading(true)

    try {
      // Одночасно вантажимо:
      // 1) обрані оголошення
      // 2) обраних майстрів
      const [listingsResult, professionalsResult] = await Promise.all([
        supabase
          .from('favorite_listings')
          .select(`
            listing:listings(
              *,
              images:listing_images(*),
              category:categories(*)
            )
          `)
          .eq('user_id', user?.id),

        supabase
          .from('favorite_professionals')
          .select(`
            professional:profiles(*)
          `)
          .eq('user_id', user?.id),
      ])

      // Supabase повертає вкладений обʼєкт listing.
      // Ми витягуємо тільки самі оголошення.
      if (listingsResult.data) {
        const listings = listingsResult.data
          .map((item: any) => item.listing)
          .filter(Boolean)

        setFavoriteListings(listings as ListingWithImages[])
      }

      // Supabase повертає вкладений обʼєкт professional.
      // Ми витягуємо тільки самих майстрів.
      if (professionalsResult.data) {
        const professionals = professionalsResult.data
          .map((item: any) => item.professional)
          .filter(Boolean)

        setFavoriteProfessionals(professionals as Profile[])
      }
    } finally {
      setLoading(false)
    }
  }

  // Якщо користувач не авторизований — показуємо красивий блок входу.
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 w-full">
        <div className="w-full px-4 md:px-6 xl:px-8 2xl:px-10">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
            <Heart className="w-14 h-14 mx-auto mb-4 text-gray-300" />

            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Обране
            </h1>

            <p className="text-gray-600 mb-6">
              Щоб зберігати оголошення та майстрів, потрібно увійти в акаунт.
            </p>

            <button
              onClick={() => navigateTo('/login')}
              type="button"
              className="px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg transition"
            >
              Увійти
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 w-full">
      <div className="w-full px-4 md:px-6 xl:px-8 2xl:px-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Обране
              </h1>

              <p className="text-gray-600">
                Тут зберігаються оголошення та майстри, які тобі цікаві.
              </p>
            </div>
          </div>
        </div>

        {/* Перемикач між обраними оголошеннями і майстрами */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-8 inline-flex gap-2">
          <button
            onClick={() => setActiveTab('listings')}
            type="button"
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition ${
              activeTab === 'listings'
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-5 h-5" />
            Оголошення ({favoriteListings.length})
          </button>

          <button
            onClick={() => setActiveTab('professionals')}
            type="button"
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition ${
              activeTab === 'professionals'
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Users className="w-5 h-5" />
            Майстри ({favoriteProfessionals.length})
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-500">
            Завантаження обраного…
          </div>
        ) : activeTab === 'listings' ? (
          favoriteListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {favoriteListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
              <FileText className="w-14 h-14 mx-auto mb-4 text-gray-300" />

              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Немає збережених оголошень
              </h2>

              <p className="text-gray-600 mb-6">
                Натискай сердечко на оголошеннях, щоб додавати їх сюди.
              </p>

              <button
                onClick={() => navigateTo('/listings')}
                type="button"
                className="px-6 py-3 rounded-lg font-semibold bg-blue-900 text-white hover:bg-blue-800 transition"
              >
                Перейти до оголошень
              </button>
            </div>
          )
        ) : favoriteProfessionals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {favoriteProfessionals.map((professional) => (
              <ProfessionalCard key={professional.id} professional={professional} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
            <Users className="w-14 h-14 mx-auto mb-4 text-gray-300" />

            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Немає збережених майстрів
            </h2>

            <p className="text-gray-600 mb-6">
              Натискай сердечко на картках майстрів, щоб зберігати їх.
            </p>

            <button
              onClick={() => navigateTo('/professionals')}
              type="button"
              className="px-6 py-3 rounded-lg font-semibold bg-blue-900 text-white hover:bg-blue-800 transition"
            >
              Знайти майстрів
            </button>
          </div>
        )}
      </div>
    </div>
  )
}