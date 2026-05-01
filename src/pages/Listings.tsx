import { Fragment, useEffect, useMemo, useState } from 'react'
import { MapPin, Search, SlidersHorizontal } from 'lucide-react'
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
  const [locationQuery, setLocationQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const syncFiltersFromUrl = () => {
      const params = new URLSearchParams(window.location.search)
      setSearchQuery(params.get('search') || '')
      setLocationQuery(params.get('location') || '')
      setSelectedCategory(params.get('category') || '')
    }

    syncFiltersFromUrl()
    window.addEventListener('popstate', syncFiltersFromUrl)

    return () => {
      window.removeEventListener('popstate', syncFiltersFromUrl)
    }
  }, [])

  useEffect(() => {
    void loadInitialData()
  }, [])

  const loadInitialData = async () => {
    setLoading(true)

    try {
      const now = new Date().toISOString()

      const [categoriesResult, listingsResult] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase
          .from('listings')
          .select(`
            *,
            images:listing_images(*),
            category:categories(*)
          `)
          .eq('listing_type', 'service_request')
          .eq('status', 'active')
          .gte('expires_at', now)
          .order('created_at', { ascending: false }),
      ])

      setCategories(categoriesResult.data ?? [])
      setAllListings((listingsResult.data as ListingWithImages[] | null) ?? [])
    } finally {
      setLoading(false)
    }
  }

  const translateCategory = (category: Category) => {
    const newKey = `category.name.${category.slug}`
    const newValue = t(newKey)

    if (newValue !== newKey) {
      return newValue
    }

    const legacyKey = `category.${category.slug}`
    const legacyValue = t(legacyKey)

    if (legacyValue !== legacyKey) {
      return legacyValue
    }

    return category.name
  }

  const filteredListings = useMemo(() => {
    let result = [...allListings]

    const normalizedSearch = searchQuery.trim().toLowerCase()
    const normalizedLocation = locationQuery.trim().toLowerCase()

    if (selectedCategory) {
      result = result.filter((listing) => {
        const categorySlug = listing.category?.slug || ''
        return categorySlug === selectedCategory || listing.category_id === selectedCategory
      })
    }

    if (normalizedSearch) {
      result = result.filter((listing) => {
        const title = listing.title?.toLowerCase() || ''
        const description = listing.description?.toLowerCase() || ''
        const categoryName = listing.category?.name?.toLowerCase() || ''

        return (
          title.includes(normalizedSearch) ||
          description.includes(normalizedSearch) ||
          categoryName.includes(normalizedSearch)
        )
      })
    }

    if (normalizedLocation) {
      result = result.filter((listing) => {
        const location = listing.location?.toLowerCase() || ''
        return location.includes(normalizedLocation)
      })
    }

    return result
  }, [allListings, locationQuery, searchQuery, selectedCategory])

  const activeFiltersCount = [searchQuery, locationQuery, selectedCategory].filter(Boolean).length

  const applyFiltersToUrl = () => {
    const params = new URLSearchParams()

    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim())
    }

    if (locationQuery.trim()) {
      params.set('location', locationQuery.trim())
    }

    if (selectedCategory) {
      params.set('category', selectedCategory)
    }

    const query = params.toString()
    navigateTo(query ? `/listings?${query}` : '/listings')
  }

  const resetFilters = () => {
    setSearchQuery('')
    setLocationQuery('')
    setSelectedCategory('')
    navigateTo('/listings')
  }

  return (
    <div className="page-bg min-h-screen py-8 pb-24 lg:pb-8">
      <div className="w-full px-4 md:px-6 xl:px-8 2xl:px-10">
        <div className="flex gap-6">
          <div className="hidden xl:block w-[260px] 2xl:w-[300px] flex-shrink-0">
            <AdBanner position="left" sticky={true} />
          </div>

          <div className="min-w-0 flex-1">
            <section className="glass-panel mb-6 p-5 md:p-6">
              <div className="inline-flex items-center rounded-full border border-[rgba(233,202,177,0.7)] bg-[rgba(255,247,239,0.88)] px-4 py-2 text-sm font-semibold text-[#a26233]">
                {t('listings.eyebrow')}
              </div>

              <div className="mt-4 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div className="max-w-3xl">
                  <h1 className="text-3xl font-extrabold tracking-tight text-[#2f2a24] md:text-4xl">
                    {t('listings.simpleTitle')}
                  </h1>
                  <p className="mt-3 text-sm leading-6 text-[#6f665d] md:text-base">
                    {t('listings.simpleDescription')}
                  </p>
                </div>

                <button
                  onClick={() => navigateTo('/create-ad')}
                  type="button"
                  className="btn-secondary rounded-full"
                >
                  {t('listings.postJob')}
                </button>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_220px_180px_160px]">
                <div className="relative sm:col-span-2 xl:col-span-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#b59a84]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        applyFiltersToUrl()
                      }
                    }}
                    placeholder={t('listings.whatNeedsToBeDone')}
                    className="input-glass h-14 pl-12"
                  />
                </div>

                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#b59a84]" />
                  <input
                    type="text"
                    value={locationQuery}
                    onChange={(event) => setLocationQuery(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        applyFiltersToUrl()
                      }
                    }}
                    placeholder={t('listings.cityOrCountry')}
                    className="input-glass h-14 pl-12"
                  />
                </div>

                <button
                  onClick={applyFiltersToUrl}
                  type="button"
                  className="btn-primary h-14 rounded-[20px]"
                >
                  {t('listings.findRequests')}
                </button>

                <button
                  onClick={() => setShowFilters((value) => !value)}
                  type="button"
                  className="btn-outline h-14 rounded-[20px] sm:col-span-2 xl:col-span-1"
                >
                  <SlidersHorizontal className="h-5 w-5" />
                  {activeFiltersCount > 0
                    ? `${t('listings.filtersButton')} (${activeFiltersCount})`
                    : t('listings.filtersButton')}
                </button>
              </div>

              {showFilters && (
                <div className="mt-4 rounded-[26px] border border-white/70 bg-white/45 p-4">
                  <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#5f5a54]">
                        {t('listings.categoryLabel')}
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(event) => setSelectedCategory(event.target.value)}
                        className="select-glass bg-white/80"
                      >
                        <option value="">{t('listings.allCategoriesSimple')}</option>

                        {categories.map((category) => (
                          <option key={category.id} value={category.slug}>
                            {translateCategory(category)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={resetFilters}
                      type="button"
                      className="btn-ghost justify-start rounded-full px-0 md:justify-center"
                    >
                      {t('listings.clearFiltersSimple')}
                    </button>
                  </div>
                </div>
              )}
            </section>

            <MobileAdBanner variant="horizontal" />

            <div className="mb-4 mt-6 text-sm font-semibold text-[#6f665d]">
              {loading
                ? t('listings.loadingRequests')
                : `${filteredListings.length} ${t('listings.countSuffix')}`}
            </div>

            {loading ? (
              <div className="glass-card p-8 text-center text-[#7a7168]">
                {t('listings.loadingRequests')}
              </div>
            ) : filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
                {filteredListings.map((listing, index) => (
                  <Fragment key={listing.id}>
                    <ListingCard listing={listing} />

                    {(index + 1) % 4 === 0 && index < filteredListings.length - 1 && (
                      <div className="md:col-span-2 2xl:col-span-3">
                        <MobileAdBanner variant="inline" />
                      </div>
                    )}
                  </Fragment>
                ))}
              </div>
            ) : (
              <div className="glass-card p-10 text-center">
                <h2 className="text-xl font-extrabold text-[#2f2a24]">
                  {t('listings.emptyTitle')}
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#6f665d]">
                  {t('listings.emptyText')}
                </p>
                <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <button
                    onClick={resetFilters}
                    type="button"
                    className="btn-secondary rounded-full"
                  >
                    {t('listings.clearFiltersSimple')}
                  </button>
                  <button
                    onClick={() => navigateTo('/create-ad')}
                    type="button"
                    className="btn-primary rounded-full"
                  >
                    {t('listings.postJob')}
                  </button>
                </div>
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
