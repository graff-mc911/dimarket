import { Fragment, useEffect, useMemo, useState } from 'react'
import { MapPin, PlusCircle, Search, SlidersHorizontal } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Category, ListingWithImages } from '../lib/types'
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
          <aside className="hidden xl:block w-[260px] 2xl:w-[300px] flex-shrink-0">
            <AdBanner position="left" sticky={true} />
          </aside>

          <main className="min-w-0 flex-1">
            <section className="glass-panel mb-6 p-6 md:p-7 xl:p-8">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                <div className="max-w-3xl">
                  <div className="eyebrow">{t('listings.eyebrow')}</div>
                  <h1 className="mt-5 font-[var(--font-display)] text-[1.72rem] font-bold leading-[1.08] tracking-[-0.035em] text-[var(--ink-900)] md:text-[2rem] xl:text-[2.2rem]">
                    {t('listings.simpleTitle')}
                  </h1>
                  <p className="muted-text mt-4 max-w-2xl text-[14px] md:text-[15px]">
                    {t('listings.simpleDescription')}
                  </p>
                </div>

                <button
                  onClick={() => navigateTo('/create-ad')}
                  type="button"
                  className="btn-primary rounded-full px-5 text-sm"
                >
                  <PlusCircle className="h-4 w-4" />
                  Додати оголошення
                </button>
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  applyFiltersToUrl()
                }}
                className="mt-7 grid gap-3 xl:grid-cols-[minmax(0,1fr)_220px_156px_156px]"
              >
                <div className="relative xl:col-span-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[var(--ink-500)]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder={t('listings.whatNeedsToBeDone')}
                    className="input-glass h-[50px] pl-11"
                  />
                </div>

                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[var(--ink-500)]" />
                  <input
                    type="text"
                    value={locationQuery}
                    onChange={(event) => setLocationQuery(event.target.value)}
                    placeholder={t('listings.cityOrCountry')}
                    className="input-glass h-[50px] pl-11"
                  />
                </div>

                <button type="submit" className="btn-primary h-[50px] rounded-full px-5 text-sm">
                  {t('listings.findRequests')}
                </button>

                <button
                  onClick={() => setShowFilters((value) => !value)}
                  type="button"
                  className="btn-secondary h-[50px] rounded-full px-5 text-sm"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {activeFiltersCount > 0
                    ? `${t('listings.filtersButton')} (${activeFiltersCount})`
                    : t('listings.filtersButton')}
                </button>
              </form>

              {showFilters && (
                <div className="mt-4 rounded-[24px] border border-[var(--glass-border)] bg-[rgba(255,255,255,0.34)] p-4 backdrop-blur-md">
                  <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[var(--ink-700)]">
                        {t('listings.categoryLabel')}
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(event) => setSelectedCategory(event.target.value)}
                        className="select-glass"
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
                      className="btn-ghost justify-start rounded-full px-0 text-sm md:justify-center"
                    >
                      {t('listings.clearFiltersSimple')}
                    </button>
                  </div>
                </div>
              )}
            </section>

            <MobileAdBanner variant="horizontal" />

            <div className="mb-4 mt-6 flex flex-wrap items-center justify-between gap-3">
              <div className="text-[13px] font-semibold text-[var(--ink-700)] md:text-sm">
                {loading
                  ? t('listings.loadingRequests')
                  : `${filteredListings.length} ${t('listings.countSuffix')}`}
              </div>

              {activeFiltersCount > 0 && !loading && (
                <button
                  onClick={resetFilters}
                  type="button"
                  className="btn-ghost rounded-full px-0 text-[13px] md:text-sm"
                >
                  {t('listings.clearFiltersSimple')}
                </button>
              )}
            </div>

            {loading ? (
              <div className="glass-card p-8 text-center text-[var(--ink-500)]">
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
                <h2 className="font-[var(--font-display)] text-[1.25rem] font-bold tracking-[-0.02em] text-[var(--ink-900)] md:text-[1.45rem]">
                  {t('listings.emptyTitle')}
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-[13px] leading-6 text-[var(--ink-700)] md:text-[14px]">
                  {t('listings.emptyText')}
                </p>
                <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <button
                    onClick={resetFilters}
                    type="button"
                    className="btn-secondary rounded-full text-sm"
                  >
                    {t('listings.clearFiltersSimple')}
                  </button>
                  <button
                    onClick={() => navigateTo('/create-ad')}
                    type="button"
                    className="btn-primary rounded-full text-sm"
                  >
                    Додати оголошення
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6">
              <MobileAdBanner variant="inline" />
            </div>
          </main>

          <aside className="hidden xl:block w-[260px] 2xl:w-[300px] flex-shrink-0">
            <AdBanner position="right" sticky={true} />
          </aside>
        </div>
      </div>

      <MobileAdBanner variant="sticky" />
    </div>
  )
}
