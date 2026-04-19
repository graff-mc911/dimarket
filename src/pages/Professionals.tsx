import { useEffect, useMemo, useState } from 'react'
import { Search, Star, SlidersHorizontal } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Profile, Category } from '../lib/types'
import { ProfessionalCard } from '../components/ProfessionalCard'
import { MobileAdBanner } from '../components/MobileAdBanner'
import { AdBanner } from '../components/AdBanner'
import { useApp } from '../contexts/AppContext'
import { navigateTo } from '../lib/navigation'

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
  }, [])

  const loadCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (data) setCategories(data)
  }

  const loadProfessionals = async () => {
    setLoading(true)

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_professional', true)
      .order('rating', { ascending: false })
      .order('total_reviews', { ascending: false })

    if (data) setProfessionals(data)
    setLoading(false)
  }

  const filteredProfessionals = useMemo(() => {
    return professionals
      .filter((prof) => {
        const matchesSearch =
          searchQuery === '' ||
          prof.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prof.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prof.location?.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesRating = minRating === 0 || (prof.rating || 0) >= minRating

        const matchesLocation =
          locationFilter === '' ||
          prof.location?.toLowerCase().includes(locationFilter.toLowerCase())

        // Якщо в профілях немає category_id, не ламаємо фільтр
        const matchesCategory = selectedCategory === '' || true

        return matchesSearch && matchesRating && matchesLocation && matchesCategory
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
  }, [professionals, searchQuery, minRating, locationFilter, selectedCategory, sortBy])

  return (
    <div className="min-h-screen bg-gray-50 py-8 w-full">
      <div className="w-full px-4 md:px-6 xl:px-8 2xl:px-10">
        <div className="w-full">
          {/* Верхній рекламний блок */}
          <div className="mb-6">
            <AdBanner position="top" />
          </div>

          <div className="mb-8">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {t('professionals.title')}
                </h1>
                <p className="text-gray-600">
                  {t('professionals.subtitle')}
                </p>
              </div>

              <div className="flex items-center space-x-2 text-yellow-500">
                <Star className="w-5 h-5 fill-current" />
                <span className="text-gray-700 font-medium">
                  {t('professionals.topRated')}
                </span>
              </div>
            </div>

            {/* Пошук і фільтри */}
            <div className="flex flex-col 2xl:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('professionals.searchPlaceholder')}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full 2xl:w-[320px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                type="button"
                className="w-full 2xl:w-[220px] px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2 bg-white"
              >
                <SlidersHorizontal className="w-5 h-5" />
                {t('listings.filters')}
              </button>
            </div>

            {showFilters && (
              <div className="mt-4 p-5 bg-white rounded-xl border border-gray-200 space-y-4 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('professionals.sortBy')}
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'rating' | 'newest' | 'views')}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
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
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="0">{t('professionals.anyRating')}</option>
                      <option value="3">3+ Stars</option>
                      <option value="4">4+ Stars</option>
                      <option value="4.5">4.5+ Stars</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 2xl:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('professionals.location')}
                    </label>
                    <input
                      type="text"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      placeholder={t('professionals.locationPlaceholder')}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setMinRating(0)
                        setLocationFilter('')
                        setSortBy('rating')
                        setSelectedCategory('')
                        setSearchQuery('')
                      }}
                      type="button"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium transition"
                    >
                      {t('listings.clearFilters')}
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <span className="text-sm text-gray-600">
                    {filteredProfessionals.length} {t('professionals.found')}
                  </span>
                </div>
              </div>
            )}

            <div className="mt-4">
              <MobileAdBanner variant="horizontal" />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-gray-500">{t('professionals.loading')}</div>
            </div>
          ) : filteredProfessionals.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {filteredProfessionals.map((professional, index) => (
                  <div key={professional.id}>
                    <ProfessionalCard professional={professional} />

                    {/* Вбудована реклама між картками */}
                    {(index + 1) % 8 === 0 && index < filteredProfessionals.length - 1 && (
                      <div className="mt-6">
                        <MobileAdBanner variant="inline" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Нижній рекламний блок */}
              <div className="mt-8">
                <AdBanner position="bottom" />
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="text-gray-500 mb-4">
                {t('professionals.noFound')}
              </div>

              <p className="text-gray-600 mb-6">
                {t('professionals.beFirst')}
              </p>

              <button
                onClick={() => navigateTo('/register')}
                type="button"
                className="inline-block bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
              >
                {t('professionals.registerAsProfessional')}
              </button>
            </div>
          )}

          <div className="mt-8">
            <MobileAdBanner variant="inline" />
          </div>
        </div>
      </div>
    </div>
  )
}