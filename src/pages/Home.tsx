import { useEffect, useState } from 'react'
import { Search, TrendingUp, Shield, Clock, Users } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Category, Profile, ListingWithImages } from '../lib/types'
import { CategoryCard } from '../components/CategoryCard'
import { ProfessionalCard } from '../components/ProfessionalCard'
import { ListingCard } from '../components/ListingCard'
import { useApp } from '../contexts/AppContext'
import { navigateTo } from '../lib/navigation'

export function Home() {
  const { t } = useApp()

  const [categories, setCategories] = useState<Category[]>([])
  const [professionals, setProfessionals] = useState<Profile[]>([])
  const [featuredListings, setFeaturedListings] = useState<ListingWithImages[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true)

      try {
        const now = new Date().toISOString()

        const [categoriesResult, professionalsResult, listingsResult] = await Promise.all([
          supabase
            .from('categories')
            .select('*')
            .is('parent_id', null)
            .order('name'),

          supabase
            .from('profiles')
            .select('*')
            .eq('is_professional', true)
            .order('rating', { ascending: false })
            .limit(6),

          supabase
            .from('listings')
            .select(`
              *,
              images:listing_images(*),
              category:categories(*)
            `)
            .eq('status', 'active')
            .gte('expires_at', now)
            .order('is_premium', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(8),
        ])

        if (categoriesResult.data) setCategories(categoriesResult.data)
        if (professionalsResult.data) setProfessionals(professionalsResult.data)
        if (listingsResult.data) {
          setFeaturedListings(listingsResult.data as ListingWithImages[])
        }
      } finally {
        setLoading(false)
      }
    }

    loadHomeData()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const query = searchQuery.trim()

    if (!query) {
      navigateTo('/listings')
      return
    }

    navigateTo(`/listings?search=${encodeURIComponent(query)}`)
  }

  return (
    <div className="min-h-screen w-full">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20 overflow-hidden w-full">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'url(https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1920)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </div>

        <div className="relative w-full px-4 md:px-6 xl:px-8 2xl:px-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {t('home.heroTitle')}
              <br />
              <span className="text-orange-400">{t('home.heroSubtitle')}</span>
            </h1>

            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-5xl mx-auto">
              {t('home.heroDescription')}
            </p>

            <form onSubmit={handleSearch} className="w-full max-w-none mb-8">
              <div className="flex flex-col xl:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('home.searchPlaceholder')}
                    className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
                  />
                </div>

                <button type="submit" className="btn-primary text-lg xl:min-w-[220px]">
                  {t('home.search')}
                </button>
              </div>
            </form>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigateTo('/professionals')}
                type="button"
                className="btn-outline inline-flex items-center justify-center"
              >
                {t('home.findProfessionals')}
              </button>

              <button
                onClick={() => navigateTo('/create-ad')}
                type="button"
                className="btn-primary inline-flex items-center justify-center"
              >
                {t('home.postRequest')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Категорії */}
      <section className="py-16 bg-gray-50 w-full">
        <div className="w-full px-4 md:px-6 xl:px-8 2xl:px-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            {t('home.browseByCategory')}
          </h2>

          {loading ? (
            <div className="text-center py-10 text-gray-500">
              {t('listings.loading')}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-7 gap-6">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Майстри */}
      <section className="py-16 bg-white w-full">
        <div className="w-full px-4 md:px-6 xl:px-8 2xl:px-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('home.topRatedProfessionals')}
            </h2>
            <p className="text-gray-600 text-lg">
              {t('home.topRatedDescription')}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500">
              {t('listings.loading')}
            </div>
          ) : professionals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              {professionals.map((professional) => (
                <ProfessionalCard key={professional.id} professional={professional} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>{t('home.noProfessionals')}</p>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={() => navigateTo('/professionals')}
              type="button"
              className="btn-ghost inline-flex items-center"
            >
              {t('home.viewAllProfessionals')}
              <TrendingUp className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Оголошення */}
      <section className="py-16 bg-gray-50 w-full">
        <div className="w-full px-4 md:px-6 xl:px-8 2xl:px-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('home.recentListings')}
            </h2>
            <p className="text-gray-600 text-lg">
              {t('home.recentListingsDescription')}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500">
              {t('listings.loading')}
            </div>
          ) : featuredListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              {featuredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>{t('home.noListings')}</p>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={() => navigateTo('/listings')}
              type="button"
              className="btn-ghost inline-flex items-center"
            >
              {t('home.viewAllListings')}
              <TrendingUp className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Переваги */}
      <section className="py-16 bg-white w-full">
        <div className="w-full px-4 md:px-6 xl:px-8 2xl:px-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            {t('home.whyChoose')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-900 rounded-full mb-4">
                <Shield className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('home.verifiedProfessionals')}
              </h3>

              <p className="text-gray-600">
                {t('home.verifiedDescription')}
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-600 rounded-full mb-4">
                <Clock className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('home.quickEasy')}
              </h3>

              <p className="text-gray-600">
                {t('home.quickEasyDescription')}
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-900 rounded-full mb-4">
                <Users className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('home.directCommunication')}
              </h3>

              <p className="text-gray-600">
                {t('home.directCommunicationDescription')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-orange-500 to-orange-600 text-white w-full">
        <div className="w-full px-4 md:px-6 xl:px-8 2xl:px-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('home.areYouProfessional')}
          </h2>

          <p className="text-xl mb-8 text-orange-100">
            {t('home.joinProfessionals')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigateTo('/register')}
              type="button"
              className="btn-outline bg-white text-orange-600 border-white hover:bg-orange-50"
            >
              {t('home.registerAsProfessional')}
            </button>

            <button
              onClick={() => navigateTo('/create-ad')}
              type="button"
              className="btn-primary bg-orange-700 hover:bg-orange-800"
            >
              {t('home.postFirstAd')}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}