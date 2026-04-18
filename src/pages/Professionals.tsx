import { useState, useEffect } from 'react'
import { Search, Star, SlidersHorizontal } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Profile, Category } from '../lib/types'
import { ProfessionalCard } from '../components/ProfessionalCard'
import { AdBanner } from '../components/AdBanner'
import { MobileAdBanner } from '../components/MobileAdBanner'
import { useApp } from '../contexts/AppContext'

export function Professionals() {
  const { t } = useApp()
  const [professionals, setProfessionals] = useState<Profile[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState<'rating' | 'newest' | 'views'>('rating')
  const [showFilters, setShowFilters] = useState(false)
  const [minRating, setMinRating] = useState(0)
  const [locationFilter, setLocationFilter] = useState('')

  useEffect(() => {
    loadCategories()
    loadProfessionals()
  }, [selectedCategory])

  const loadCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (data) setCategories(data)
  }

  const loadProfessionals = async () => {
    setLoading(true)

    let query = supabase
      .from('profiles')
      .select('*')
      .eq('is_professional', true)
      .order('rating', { ascending: false })
      .order('total_reviews', { ascending: false })

    const { data } = await query

    if (data) setProfessionals(data)
    setLoading(false)
  }

  const filteredProfessionals = professionals
    .filter(prof => {
      const matchesSearch = searchQuery === '' ||
        prof.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prof.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prof.location?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesRating = minRating === 0 || (prof.rating || 0) >= minRating

      const matchesLocation = locationFilter === '' ||
        prof.location?.toLowerCase().includes(locationFilter.toLowerCase())

      return matchesSearch && matchesRating && matchesLocation
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        case 'views':
          return (b.profile_views || 0) - (a.profile_views || 0)
        case 'newest':
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        default:
          return 0
      }
    })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          <div className="hidden lg:block w-1/5">
            <AdBanner position="left" sticky={true} />
          </div>

          <div className="flex-1 lg:w-3/5">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('professionals.title')}</h1>
                  <p className="text-gray-600">{t('professionals.subtitle')}</p>
                </div>
                <div className="flex items-center space-x-2 text-yellow-500">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="text-gray-700 font-medium">{t('professionals.topRated')}</span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('professionals.searchPlaceholder')}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">{t('listings.allCategories')}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  {t('listings.filters')}
                </button>
              </div>

              {showFilters && (
                <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('professionals.sortBy')}
                      </label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="rating">{t('professionals.topRated')}</option>
                        <option value="views">{t('professionals.mostViewed')}</option>
                        <option value="newest">{t('professionals.newest')}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('professionals.minRating')}
                      </label>
                      <select
                        value={minRating}
                        onChange={(e) => setMinRating(Number(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="0">{t('professionals.anyRating')}</option>
                        <option value="3">3+ Stars</option>
                        <option value="4">4+ Stars</option>
                        <option value="4.5">4.5+ Stars</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('professionals.location')}
                      </label>
                      <input
                        type="text"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        placeholder={t('professionals.locationPlaceholder')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm text-gray-600">
                      {filteredProfessionals.length} {t('professionals.found')}
                    </span>
                    <button
                      onClick={() => {
                        setMinRating(0)
                        setLocationFilter('')
                        setSortBy('rating')
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {t('listings.clearFilters')}
                    </button>
                  </div>
                </div>
              )}

              <MobileAdBanner variant="horizontal" />
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-gray-500">{t('professionals.loading')}</div>
              </div>
            ) : filteredProfessionals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProfessionals.map((professional, index) => (
                  <>
                    <ProfessionalCard key={professional.id} professional={professional} />
                    {(index + 1) % 4 === 0 && index < filteredProfessionals.length - 1 && (
                      <div key={`ad-${index}`} className="md:col-span-2">
                        <MobileAdBanner variant="inline" />
                      </div>
                    )}
                  </>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-gray-500 mb-4">{t('professionals.noFound')}</div>
                <p className="text-gray-600 mb-6">{t('professionals.beFirst')}</p>
                <a
                  href="/register"
                  className="inline-block bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
                >
                  {t('professionals.registerAsProfessional')}
                </a>
              </div>
            )}

            <div className="mt-6">
              <MobileAdBanner variant="inline" />
            </div>

            <div className="mt-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-8 text-white text-center">
              <h2 className="text-2xl font-bold mb-4">
                {t('professionals.joinTitle')}
              </h2>
              <p className="text-lg mb-6 text-orange-100">
                {t('professionals.joinDesc')}
              </p>
              <a
                href="/register"
                className="inline-block bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition"
              >
                {t('professionals.getStartedToday')}
              </a>
            </div>
          </div>

          <div className="hidden lg:block w-1/5">
            <AdBanner position="right" sticky={true} />
          </div>
        </div>
      </div>

      <MobileAdBanner variant="sticky" />
    </div>
  )
}
