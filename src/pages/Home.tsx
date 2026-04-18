import { useEffect, useState } from 'react'
import { Search, TrendingUp, Shield, Clock, Users } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Category, Profile, ListingWithImages } from '../lib/types'
import { CategoryCard } from '../components/CategoryCard'
import { ProfessionalCard } from '../components/ProfessionalCard'
import { ListingCard } from '../components/ListingCard'
import { useApp } from '../contexts/AppContext'

export function Home() {
  const { t } = useApp()
  const [categories, setCategories] = useState<Category[]>([])
  const [professionals, setProfessionals] = useState<Profile[]>([])
  const [featuredListings, setFeaturedListings] = useState<ListingWithImages[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadCategories()
    loadProfessionals()
    loadFeaturedListings()
  }, [])

  const loadCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .is('parent_id', null)
      .order('name')

    if (data) setCategories(data)
  }

  const loadProfessionals = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_professional', true)
      .order('rating', { ascending: false })
      .limit(6)

    if (data) setProfessionals(data)
  }

  const loadFeaturedListings = async () => {
    const { data } = await supabase
      .from('listings')
      .select(`
        *,
        images:listing_images(*),
        category:categories(*)
      `)
      .eq('status', 'active')
      .gte('expires_at', new Date().toISOString())
      .order('is_premium', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(8)

    if (data) setFeaturedListings(data as ListingWithImages[])
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/listings?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1920)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {t('home.heroTitle')}<br />
              <span className="text-orange-400">{t('home.heroSubtitle')}</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              {t('home.heroDescription')}
            </p>

            <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-8">
              <div className="flex flex-col md:flex-row gap-3">
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
                <button
                  type="submit"
                  className="btn-primary text-lg"
                >
                  {t('home.search')}
                </button>
              </div>
            </form>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/professionals"
                className="btn-outline inline-flex items-center justify-center"
              >
                {t('home.findProfessionals')}
              </a>
              <a
                href="/create-ad"
                className="btn-primary inline-flex items-center justify-center"
              >
                {t('home.postRequest')}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            {t('home.browseByCategory')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('home.topRatedProfessionals')}
            </h2>
            <p className="text-gray-600 text-lg">
              {t('home.topRatedDescription')}
            </p>
          </div>

          {professionals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
            <a
              href="/professionals"
              className="btn-ghost inline-flex items-center"
            >
              {t('home.viewAllProfessionals')}
              <TrendingUp className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('home.recentListings')}
            </h2>
            <p className="text-gray-600 text-lg">
              {t('home.recentListingsDescription')}
            </p>
          </div>

          {featuredListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
            <a
              href="/listings"
              className="btn-ghost inline-flex items-center"
            >
              {t('home.viewAllListings')}
              <TrendingUp className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

      <section className="py-16 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('home.areYouProfessional')}
          </h2>
          <p className="text-xl mb-8 text-orange-100">
            {t('home.joinProfessionals')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="btn-outline bg-white inline-flex items-center justify-center"
            >
              {t('home.registerAsProfessional')}
            </a>
            <a
              href="/create-ad"
              className="relative overflow-hidden px-8 py-3.5 rounded-xl font-semibold border-2 border-white text-white hover:bg-white hover:text-orange-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center shadow-lg hover:shadow-xl"
            >
              {t('header.createAd')}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
