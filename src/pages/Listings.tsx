import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { ListingWithImages, Category } from '../lib/types'
import { ListingCard } from '../components/ListingCard'
import { AdBanner } from '../components/AdBanner'
import { MobileAdBanner } from '../components/MobileAdBanner'
import { useApp } from '../contexts/AppContext'

export function Listings() {
  const { t } = useApp()
  const [listings, setListings] = useState<ListingWithImages[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadCategories()
    loadListings()
  }, [selectedCategory, selectedType])

  const loadCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (data) setCategories(data)
  }

  const getCategoryTranslation = (categoryName: string) => {
    const key = `category.name.${categoryName.toLowerCase()}` as any
    return t(key) || categoryName
  }

  const loadListings = async () => {
    setLoading(true)

    let query = supabase
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

    if (selectedCategory) {
      query = query.eq('category_id', selectedCategory)
    }

    if (selectedType) {
      query = query.eq('listing_type', selectedType)
    }

    const { data } = await query

    if (data) {
      setListings(data as ListingWithImages[])
    }

    setLoading(false)
  }

  const handleSearch = () => {
    const filtered = listings.filter(listing =>
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setListings(filtered)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          <div className="hidden lg:block w-1/5">
            <AdBanner position="left" sticky={true} />
          </div>

          <div className="flex-1 lg:w-3/5">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('listings.title')}</h1>

              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder={t('listings.searchPlaceholder')}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
                >
                  {t('listings.search')}
                </button>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 bg-white text-gray-700 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  <span>{t('listings.filters')}</span>
                </button>
              </div>

              {showFilters && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedCategory('')
                        setSelectedType('')
                        setSearchQuery('')
                      }}
                      className="text-gray-600 hover:text-gray-800 text-sm font-medium"
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
                <div className="text-gray-500">{t('listings.loading')}</div>
              </div>
            ) : listings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {listings.map((listing, index) => (
                  <>
                    <ListingCard key={listing.id} listing={listing} />
                    {(index + 1) % 4 === 0 && index < listings.length - 1 && (
                      <div key={`ad-${index}`} className="md:col-span-2">
                        <MobileAdBanner variant="inline" />
                      </div>
                    )}
                  </>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-gray-500 mb-4">{t('listings.noFound')}</div>
                <a
                  href="/create-ad"
                  className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
                >
                  {t('listings.createFirst')}
                </a>
              </div>
            )}

            <div className="mt-6">
              <MobileAdBanner variant="inline" />
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
