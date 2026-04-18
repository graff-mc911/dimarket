import { useState, useEffect } from 'react'
import { PlusCircle, Upload, X, MapPin, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useApp } from '../contexts/AppContext'
import { Category, Listing } from '../lib/types'
import { AdBanner } from '../components/AdBanner'
import { getCurrentLocation, searchLocations, LocationSuggestion } from '../lib/geocoding'

export function CreateAd() {
  const { user, currency, t } = useApp()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [listingType, setListingType] = useState<'service_request' | 'service_offer' | 'item_sale' | 'item_wanted'>('service_request')
  const [price, setPrice] = useState('')
  const [location, setLocation] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [duration, setDuration] = useState(30)
  const [imageUrls, setImageUrls] = useState<string[]>([''])
  const [error, setError] = useState('')
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loadingLocation, setLoadingLocation] = useState(false)
  const [visibilityRadius, setVisibilityRadius] = useState<'city' | 'district' | 'region' | 'country' | 'state' | 'land' | 'global'>('city')
  const [showVisibilityDropdown, setShowVisibilityDropdown] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (location.length >= 2) {
        handleLocationSearch(location)
      } else {
        setLocationSuggestions([])
      }
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [location])

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

  const handleGetCurrentLocation = async () => {
    setLoadingLocation(true)
    try {
      const result = await getCurrentLocation()
      if (result) {
        setLocation(result.city)
        setShowSuggestions(false)
      } else {
        setError('Не вдалося визначити місцезнаходження')
      }
    } catch (err) {
      setError('Помилка отримання геолокації')
    } finally {
      setLoadingLocation(false)
    }
  }

  const handleLocationSearch = async (query: string) => {
    const suggestions = await searchLocations(query)
    setLocationSuggestions(suggestions)
    setShowSuggestions(suggestions.length > 0)
  }

  const selectLocationSuggestion = (suggestion: LocationSuggestion) => {
    setLocation(suggestion.name)
    setShowSuggestions(false)
    setLocationSuggestions([])
  }

  const addImageField = () => {
    setImageUrls([...imageUrls, ''])
  }

  const updateImageUrl = (index: number, value: string) => {
    const newUrls = [...imageUrls]
    newUrls[index] = value
    setImageUrls(newUrls)
  }

  const removeImageField = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!contactPhone && !contactEmail) {
        throw new Error('Please provide at least phone or email contact information')
      }

      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + duration)

      const listingData = {
        title,
        description,
        category_id: categoryId || null,
        listing_type: listingType,
        price: price ? parseFloat(price) : null,
        currency: currency.code,
        location,
        visibility_radius: visibilityRadius,
        contact_name: contactName,
        contact_phone: contactPhone || null,
        contact_email: contactEmail || null,
        author_id: user?.id || null,
        duration_days: duration,
        expires_at: expiresAt.toISOString(),
        is_premium: duration >= 365,
        status: 'active',
      }

      const { data: listing, error: listingError } = await supabase
        .from('listings')
        .insert(listingData)
        .select()
        .maybeSingle<Listing>()

      if (listingError) throw listingError
      if (!listing) throw new Error('Failed to create listing')

      const validImageUrls = imageUrls.filter(url => url.trim() !== '')
      if (validImageUrls.length > 0) {
        const imageInserts = validImageUrls.map((url, index) => ({
          listing_id: listing.id,
          image_url: url,
          display_order: index,
        }))

        const { error: imagesError } = await supabase
          .from('listing_images')
          .insert(imageInserts)

        if (imagesError) console.error('Error adding images:', imagesError)
      }

      setSuccess(true)
      setTimeout(() => {
        window.location.href = `/listing/${listing.id}`
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create listing')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          <div className="hidden lg:block w-1/5">
            <AdBanner position="left" sticky={true} />
          </div>

          <div className="flex-1 lg:w-3/5">
            <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center mb-8">
            <div className="bg-gradient-to-br from-orange-600 to-orange-500 p-3 rounded-lg mr-4">
              <PlusCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('createAd.title')}</h1>
              <p className="text-gray-600 mt-1">{t('createAd.noRegistration')}</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
              {t('createAd.success')}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('createAd.adType')} *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setListingType('service_request')}
                  className={`p-4 rounded-lg border-2 transition ${
                    listingType === 'service_request'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold">{t('createAd.needService')}</div>
                  <div className="text-sm text-gray-600">{t('createAd.needServiceDesc')}</div>
                </button>
                <button
                  type="button"
                  onClick={() => setListingType('service_offer')}
                  className={`p-4 rounded-lg border-2 transition ${
                    listingType === 'service_offer'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold">{t('createAd.offerService')}</div>
                  <div className="text-sm text-gray-600">{t('createAd.offerServiceDesc')}</div>
                </button>
                <button
                  type="button"
                  onClick={() => setListingType('item_sale')}
                  className={`p-4 rounded-lg border-2 transition ${
                    listingType === 'item_sale'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold">{t('createAd.sellItem')}</div>
                  <div className="text-sm text-gray-600">{t('createAd.sellItemDesc')}</div>
                </button>
                <button
                  type="button"
                  onClick={() => setListingType('item_wanted')}
                  className={`p-4 rounded-lg border-2 transition ${
                    listingType === 'item_wanted'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold">{t('createAd.wantItem')}</div>
                  <div className="text-sm text-gray-600">{t('createAd.wantItemDesc')}</div>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                {t('createAd.titleLabel')} *
              </label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder={t('createAd.titlePlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                {t('createAd.descriptionLabel')} *
              </label>
              <textarea
                id="description"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder={t('createAd.descriptionPlaceholder')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('createAd.categoryLabel')}
                </label>
                <select
                  id="category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">{t('createAd.selectCategory')}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {getCategoryTranslation(cat.name)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('createAd.priceLabel')} ({currency.symbol})
                </label>
                <input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder={t('createAd.pricePlaceholder')}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                {t('createAd.locationLabel')} *
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    id="location"
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onFocus={() => setShowSuggestions(locationSuggestions.length > 0)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="input-field"
                    placeholder={t('createAd.locationPlaceholder')}
                  />
                  {showSuggestions && locationSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                      {locationSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => selectLocationSuggestion(suggestion)}
                          className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition border-b border-gray-100 last:border-0"
                        >
                          <div className="font-medium text-gray-900">{suggestion.name}</div>
                          <div className="text-xs text-gray-500">{suggestion.displayName}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  disabled={loadingLocation}
                  className="btn-outline flex items-center gap-2 whitespace-nowrap"
                  title="Визначити автоматично"
                >
                  {loadingLocation ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <MapPin className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">Моє місто</span>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Почніть вводити назву міста або індекс
              </p>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('createAd.visibilityRadius')}
              </label>
              <div
                onClick={() => setShowVisibilityDropdown(!showVisibilityDropdown)}
                onBlur={() => setTimeout(() => setShowVisibilityDropdown(false), 200)}
                tabIndex={0}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white hover:border-gray-400 transition flex items-center justify-between"
              >
                <span className="text-gray-900">
                  {t(`createAd.radius.${visibilityRadius}` as any)}
                </span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {showVisibilityDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                  {[
                    { value: 'city' as const },
                    { value: 'district' as const },
                    { value: 'region' as const },
                    { value: 'country' as const },
                    { value: 'state' as const },
                    { value: 'land' as const },
                    { value: 'global' as const },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setVisibilityRadius(option.value);
                        setShowVisibilityDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 hover:bg-orange-50 transition border-b border-gray-100 last:border-0 ${
                        visibilityRadius === option.value ? 'bg-orange-50 text-orange-900 font-medium' : 'text-gray-900'
                      }`}
                    >
                      {t(`createAd.radius.${option.value}` as any)}
                    </button>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {t('createAd.visibilityRadiusDesc')}
              </p>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('createAd.contactInfo')}</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('createAd.yourName')} *
                  </label>
                  <input
                    id="contactName"
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('createAd.phone')}
                    </label>
                    <input
                      id="contactPhone"
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('createAd.email')}
                    </label>
                    <input
                      id="contactEmail"
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-500">* {t('createAd.contactNote')}</p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                {t('createAd.images')}
              </h3>
              <div className="space-y-3">
                {imageUrls.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => updateImageUrl(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder={t('createAd.imagePlaceholder')}
                    />
                    {imageUrls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImageField(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                {imageUrls.length < 10 && (
                  <button
                    type="button"
                    onClick={addImageField}
                    className="text-blue-900 hover:text-blue-700 text-sm font-medium"
                  >
                    {t('createAd.addImage')}
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {t('createAd.imageTip')}{' '}
                <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Pexels.com
                </a>
              </p>
            </div>


            <button
              type="submit"
              disabled={loading || success}
              className="w-full btn-primary text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('createAd.creating') : `${t('createAd.createButton')} - ${t('createAd.free')}`}
            </button>
          </form>
            </div>
          </div>

          <div className="hidden lg:block w-1/5">
            <AdBanner position="right" sticky={true} />
          </div>
        </div>
      </div>
    </div>
  )
}
