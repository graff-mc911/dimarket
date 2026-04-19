import { Fragment, useEffect, useMemo, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { ListingWithImages, Category } from '../lib/types'
import { ListingCard } from '../components/ListingCard'
import { AdBanner } from '../components/AdBanner'
import { MobileAdBanner } from '../components/MobileAdBanner'
import { useApp } from '../contexts/AppContext'
import { navigateTo } from '../lib/navigation'

export function Listings() {
  const { t } = useApp()

  const [allListings, setAllListings] = useState<ListingWithImages[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlSearch = params.get('search') || ''
    setSearchQuery(urlSearch)
  }, [])

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    setLoading(true)

    try {
      const now = new Date().toISOString()

      const [categoriesResult, listingsResult] = await Promise.all([
        supabase
          .from('categories')
          .select('*')
          .order('name'),

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
          .order('created_at', { ascending: false }),
      ])

      if (categoriesResult.data) setCategories(categoriesResult.data)
      if (listingsResult.data) {
        setAllListings(listingsResult.data as ListingWithImages[])
      }
    } finally {
      setLoading(false)
    }
  }

  const getCategoryTranslation = (categoryName: string) => {
    const key = `category.name.${categoryName.toLowerCase()}` as never
    return t(key) || categoryName
  }

  const filteredListings = useMemo(() => {
    let result = [...allListings]

    if (selectedCategory) {
      result = result.filter((listing) => listing.category_id === selectedCategory)
    }

    if (selectedType) {
      result = result.filter((listing) => listing.listing_type === selectedType)
    }

    const normalizedSearch = searchQuery.trim().toLowerCase()

    if (normalizedSearch) {
      result = result.filter((listing) => {
        const title = listing.title?.toLowerCase() || ''
        const description = listing.description?.toLowerCase() || ''
        const location = listing.location?.toLowerCase() || ''
        const categoryName = listing.category?.name?.toLowerCase() || ''

        return (
          title.includes(normalizedSearch) ||
          description.includes(normalizedSearch) ||
          location.includes(normalizedSearch) ||
          categoryName.includes(normalizedSearch)
        )
      })
    }

    return result
  }, [allListings, selectedCategory, selectedType, searchQuery])

  const handleSearch = () => {
    const query = searchQuery.trim()

    if (query) {
      navigateTo(`/listings?search=${encodeURIComponent(query)}`)
      return
    }

    navigateTo('/listings')
  }

  const resetFilters = () => {
    setSelectedCategory('')
    setSelectedType('')
    setSearchQuery('')
    navigateTo('/listings')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 w-full">
      <div className="w-full px-4 md:px-6 xl:px-8 2xl:px-10">
        <div className="flex gap-6">
          <div className="hidden xl:block w-[260px] 2xl:w-[300px] flex-shrink-0">
            <AdBanner position="left" sticky={true} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {t('listings.title')}
              </h1>

              <div className="flex flex-col xl:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearch()
                    }}
                    placeholder={t('listings.searchPlaceholder')}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  onClick={handleSearch}
                  type="button"
                  className="bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition xl:min-w-[180px]"
                >
                  {t('listings.search')}
                </button>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  type="button"
                  className="flex items-center justify-center space-x-2 bg-white text-gray-700 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition xl:min-w-[180px]"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  <span>{t('listings.filters')}</span>
                </button>
              </div>

              {showFilters && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('listings.category')}
                      </label>

                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">{t('listings.allCategories')}</option>

                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.icon} {getCategoryTranslation(cat.name)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('listings.listingType')}
                      </label>

                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">{t('listings.allTypes')}</option>
                        <option value="service_request">{t('listings.typeServiceRequest')}</option>
                        <option value="service_offer">{t('listings.typeServiceOffer')}</option>
                        <option value="item_sale">{t('listings.typeItemSale')}</option>
                        <option value="item_wanted">{t('listings.typeItemWanted')}</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={resetFilters}
                        type="button"
                        className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                      >
                        {t('listings.clearFilters')}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <MobileAdBanner variant="horizontal" />
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-gray-500">{t('listings.loading')}</div>
              </div>
            ) : filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                {filteredListings.map((listing, index) => (
                  <Fragment key={listing.id}>
                    <ListingCard listing={listing} />

                    {(index + 1) % 6 === 0 && index < filteredListings.length - 1 && (
                      <div className="md:col-span-2 2xl:col-span-3">
                        <MobileAdBanner variant="inline" />
                      </div>
                    )}
                  </Fragment>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-gray-500 mb-4">{t('listings.noFound')}</div>

                <button
                  onClick={() => navigateTo('/create-ad')}
                  type="button"
                  className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
                >
                  {t('listings.createFirst')}
                </button>
              </div>
            )}

            <div className="mt-6">
              <MobileAdBanner variant="inline" />
            </div>
          </div>

          <div className="hidden xl:block w-[260px] 2xl:w-[300px] flex-shrink-0">
            <AdBanner position="right" sticky={true} />
          </div>
        </div>
      </div>

      <MobileAdBanner variant="sticky" />
    </div>
  )
}