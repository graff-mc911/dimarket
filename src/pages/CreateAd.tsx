import { useEffect, useState } from 'react'
import { Loader2, MapPin, Upload, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useApp } from '../contexts/AppContext'
import { Category, Listing } from '../lib/types'
import { MobileAdBanner } from '../components/MobileAdBanner'
import { AdBanner } from '../components/AdBanner'
import { getCurrentLocation, searchLocations, LocationSuggestion } from '../lib/geocoding'
import { navigateTo } from '../lib/navigation'

type VisibilityRadius =
  | 'city'
  | 'district'
  | 'region'
  | 'country'
  | 'state'
  | 'land'
  | 'global'

export function CreateAd() {
  const { user, profile, currency, t } = useApp()

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
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

  const [visibilityRadius, setVisibilityRadius] = useState<VisibilityRadius>('city')

  // Тимчасові тексти для нового job-request флоу.
  // Після стабілізації форми винесемо їх у переклади для всіх 24 мов.
  const copy = {
    eyebrow: 'Free job request',
    title: 'Create a construction job request',
    description:
      'Describe the work, add a location, and let professionals contact you directly. No subscription and no posting fee.',
    detailsTitle: 'Job details',
    detailsText:
      'Keep the request specific so professionals can understand the work and send a relevant offer.',
    locationTitle: 'Location and visibility',
    locationText:
      'Choose where the request is located and how widely it should be visible to professionals.',
    contactTitle: 'Contact details',
    contactText:
      'At least one contact method is required so professionals can reach you directly.',
    imagesTitle: 'Photos (optional)',
    imagesText:
      'Add reference photos, plans, or examples to help professionals estimate the job more accurately.',
    freeListTitle: 'What is included',
    freeItemOne: 'Free posting for clients',
    freeItemTwo: 'Direct contact with professionals',
    freeItemThree: 'Optional photos and budget',
    freeItemFour: 'Advertising-funded platform model',
    taskPlaceholder: 'What needs to be done?',
    budgetPlaceholder: 'Optional budget',
    locationPlaceholder: 'City, district, or country',
    titleHint: 'Example: Need drywall repair in living room',
    descriptionHint:
      'Write what needs to be done, size of the job, preferred timing, and any details that matter.',
    contactRule: 'Add phone or email so professionals can contact you.',
    addImage: 'Add another image',
    imagePlaceholder: 'https://example.com/photo.jpg',
    imageHelp: 'Use direct image URLs for now. Local upload can be added later without changing the data model.',
    currentLocation: 'Use my location',
    durationLabel: 'Request duration',
    createButton: 'Publish job request',
    creating: 'Publishing request...',
    success: 'Job request published successfully. Redirecting...',
    missingContact: 'Add at least phone or email before publishing the request.',
    locationHelp: 'Start typing a city or area to get suggestions.',
  }

  useEffect(() => {
    void loadCategories()
  }, [])

  useEffect(() => {
    if (!contactName && profile?.full_name) {
      setContactName(profile.full_name)
    }

    if (!contactEmail && user?.email) {
      setContactEmail(user.email)
    }
  }, [contactEmail, contactName, profile?.full_name, user?.email])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (location.trim().length >= 2) {
        void handleLocationSearch(location)
      } else {
        setLocationSuggestions([])
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [location])

  const loadCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name')
    setCategories(data ?? [])
  }

  const translateUnsafe = (key: string) => {
    return t(key as never)
  }

  const getCategoryTranslation = (category: Category) => {
    const newKey = `category.name.${category.slug}`
    const newValue = translateUnsafe(newKey)

    if (newValue !== newKey) {
      return newValue
    }

    const legacyKey = `category.${category.slug}`
    const legacyValue = translateUnsafe(legacyKey)

    if (legacyValue !== legacyKey) {
      return legacyValue
    }

    return category.name
  }

  const handleGetCurrentLocation = async () => {
    setLoadingLocation(true)

    try {
      const result = await getCurrentLocation()

      if (result) {
        setLocation(result.city)
        setShowSuggestions(false)
      } else {
        setError('Unable to detect your current location.')
      }
    } catch {
      setError('Location lookup failed. Please enter the city manually.')
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
    setImageUrls((current) => [...current, ''])
  }

  const updateImageUrl = (index: number, value: string) => {
    setImageUrls((current) => {
      const next = [...current]
      next[index] = value
      return next
    })
  }

  const removeImageField = (index: number) => {
    setImageUrls((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!contactPhone.trim() && !contactEmail.trim()) {
        throw new Error(copy.missingContact)
      }

      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + duration)

      // Створюємо лише service_request і навмисно не використовуємо premium/product логіку.
      const listingData = {
        title: title.trim(),
        description: description.trim(),
        category_id: categoryId || null,
        listing_type: 'service_request' as const,
        price: price ? parseFloat(price) : null,
        currency: currency.code,
        location: location.trim(),
        visibility_radius: visibilityRadius,
        contact_name: contactName.trim(),
        contact_phone: contactPhone.trim() || null,
        contact_email: contactEmail.trim() || null,
        author_id: user?.id || null,
        duration_days: duration,
        expires_at: expiresAt.toISOString(),
        is_premium: false,
        status: 'active' as const,
      }

      const { data: listing, error: listingError } = await supabase
        .from('listings')
        .insert(listingData)
        .select()
        .maybeSingle<Listing>()

      if (listingError) {
        throw listingError
      }

      if (!listing) {
        throw new Error('Unable to publish the job request.')
      }

      const validImageUrls = imageUrls
        .map((url) => url.trim())
        .filter((url) => url !== '')

      if (validImageUrls.length > 0) {
        const imageInserts = validImageUrls.map((url, index) => ({
          listing_id: listing.id,
          image_url: url,
          display_order: index,
        }))

        const { error: imagesError } = await supabase
          .from('listing_images')
          .insert(imageInserts)

        if (imagesError) {
          console.error('Image insert failed:', imagesError)
        }
      }

      setSuccess(true)

      setTimeout(() => {
        navigateTo('/listings')
      }, 1200)
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Unable to publish the job request.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-bg min-h-screen py-8">
      <div className="w-full px-4 md:px-6 xl:px-8 2xl:px-10">
        <div className="flex gap-6">
          <aside className="hidden xl:block w-[220px] 2xl:w-[260px] flex-shrink-0">
            <AdBanner position="left" sticky={true} />
          </aside>

          <main className="min-w-0 flex-1">
            <section className="glass-panel p-5 md:p-6 xl:p-8">
              <div className="inline-flex items-center rounded-full border border-[rgba(233,202,177,0.7)] bg-[rgba(255,247,239,0.88)] px-4 py-2 text-sm font-semibold text-[#a26233]">
                {copy.eyebrow}
              </div>

              <div className="mt-4 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-[#2f2a24] md:text-4xl">
                    {copy.title}
                  </h1>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-[#6f665d] md:text-base">
                    {copy.description}
                  </p>
                </div>

                <div className="glass-card p-5">
                  <h2 className="text-lg font-extrabold text-[#2f2a24]">
                    {copy.freeListTitle}
                  </h2>
                  <div className="mt-4 space-y-3 text-sm text-[#6f665d]">
                    <BenefitRow text={copy.freeItemOne} />
                    <BenefitRow text={copy.freeItemTwo} />
                    <BenefitRow text={copy.freeItemThree} />
                    <BenefitRow text={copy.freeItemFour} />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <MobileAdBanner variant="horizontal" />
              </div>

              {error && (
                <div className="mt-6 rounded-[22px] border border-[rgba(221,138,120,0.35)] bg-[rgba(255,237,232,0.92)] px-4 py-3 text-sm text-[#a44a3a]">
                  {error}
                </div>
              )}

              {success && (
                <div className="mt-6 rounded-[22px] border border-[rgba(120,181,140,0.35)] bg-[rgba(236,250,240,0.92)] px-4 py-3 text-sm text-[#3d7a52]">
                  {copy.success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-8">
                <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-xl font-extrabold text-[#2f2a24]">
                        {copy.detailsTitle}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-[#6f665d]">
                        {copy.detailsText}
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#5f5a54]">
                        {copy.taskPlaceholder} *
                      </label>
                      <input
                        required
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        className="input-glass"
                        placeholder={copy.titleHint}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#5f5a54]">
                        {t('createAd.descriptionLabel')} *
                      </label>
                      <textarea
                        required
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        rows={7}
                        className="input-glass min-h-[180px] resize-y"
                        placeholder={copy.descriptionHint}
                      />
                    </div>
                  </div>

                  <div className="space-y-5 rounded-[28px] border border-white/70 bg-white/45 p-5">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#5f5a54]">
                        {t('createAd.categoryLabel')}
                      </label>
                      <select
                        value={categoryId}
                        onChange={(event) => setCategoryId(event.target.value)}
                        className="select-glass bg-white/80"
                      >
                        <option value="">{t('createAd.selectCategory')}</option>

                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {getCategoryTranslation(category)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#5f5a54]">
                        {t('createAd.priceLabel')} ({currency.symbol})
                      </label>
                      <input
                        type="number"
                        value={price}
                        onChange={(event) => setPrice(event.target.value)}
                        className="input-glass"
                        placeholder={copy.budgetPlaceholder}
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#5f5a54]">
                        {copy.durationLabel}
                      </label>
                      <select
                        value={duration}
                        onChange={(event) => setDuration(Number(event.target.value))}
                        className="select-glass bg-white/80"
                      >
                        <option value={14}>14 days</option>
                        <option value={30}>30 days</option>
                        <option value={60}>60 days</option>
                        <option value={90}>90 days</option>
                      </select>
                    </div>
                  </div>
                </section>

                <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-xl font-extrabold text-[#2f2a24]">
                        {copy.locationTitle}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-[#6f665d]">
                        {copy.locationText}
                      </p>
                    </div>

                    <div className="relative">
                      <label className="mb-2 block text-sm font-semibold text-[#5f5a54]">
                        {t('createAd.locationLabel')} *
                      </label>

                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            required
                            value={location}
                            onChange={(event) => setLocation(event.target.value)}
                            onFocus={() => setShowSuggestions(locationSuggestions.length > 0)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            className="input-glass"
                            placeholder={copy.locationPlaceholder}
                          />

                          {showSuggestions && locationSuggestions.length > 0 && (
                            <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-[22px] border border-white/70 bg-[rgba(255,250,246,0.96)] p-2 shadow-[0_20px_50px_rgba(89,63,48,0.12)]">
                              {locationSuggestions.map((suggestion, index) => (
                                <button
                                  key={`${suggestion.name}-${index}`}
                                  type="button"
                                  onClick={() => selectLocationSuggestion(suggestion)}
                                  className="block w-full rounded-[18px] px-4 py-3 text-left transition hover:bg-white/80"
                                >
                                  <div className="font-semibold text-[#2f2a24]">
                                    {suggestion.name}
                                  </div>
                                  <div className="text-xs text-[#7a7168]">
                                    {suggestion.displayName}
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={handleGetCurrentLocation}
                          disabled={loadingLocation}
                          className="flex h-12 w-12 items-center justify-center rounded-[18px] border border-white/70 bg-white/70 text-[#5f5a54] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
                          title={copy.currentLocation}
                        >
                          {loadingLocation ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MapPin className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      <p className="mt-2 text-xs text-[#7a7168]">
                        {copy.locationHelp}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5 rounded-[28px] border border-white/70 bg-white/45 p-5">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#5f5a54]">
                        {t('createAd.visibilityRadius')}
                      </label>
                      <select
                        value={visibilityRadius}
                        onChange={(event) =>
                          setVisibilityRadius(event.target.value as VisibilityRadius)
                        }
                        className="select-glass bg-white/80"
                      >
                        <option value="city">{t('createAd.radius.city')}</option>
                        <option value="district">{t('createAd.radius.district')}</option>
                        <option value="region">{t('createAd.radius.region')}</option>
                        <option value="country">{t('createAd.radius.country')}</option>
                        <option value="state">{t('createAd.radius.state')}</option>
                        <option value="land">{t('createAd.radius.land')}</option>
                        <option value="global">{t('createAd.radius.global')}</option>
                      </select>
                      <p className="mt-2 text-xs text-[#7a7168]">
                        {t('createAd.visibilityRadiusDesc')}
                      </p>
                    </div>
                  </div>
                </section>

                <section className="space-y-5">
                  <div>
                    <h2 className="text-xl font-extrabold text-[#2f2a24]">
                      {copy.contactTitle}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-[#6f665d]">
                      {copy.contactText}
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#5f5a54]">
                        {t('createAd.yourName')} *
                      </label>
                      <input
                        required
                        value={contactName}
                        onChange={(event) => setContactName(event.target.value)}
                        className="input-glass"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#5f5a54]">
                        {t('createAd.phone')}
                      </label>
                      <input
                        type="tel"
                        value={contactPhone}
                        onChange={(event) => setContactPhone(event.target.value)}
                        className="input-glass"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#5f5a54]">
                        {t('createAd.email')}
                      </label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(event) => setContactEmail(event.target.value)}
                        className="input-glass"
                      />
                    </div>
                  </div>

                  <p className="text-sm text-[#7a7168]">{copy.contactRule}</p>
                </section>

                <section className="space-y-5">
                  <div>
                    <h2 className="flex items-center gap-2 text-xl font-extrabold text-[#2f2a24]">
                      <Upload className="h-5 w-5 text-[#c96d2c]" />
                      {copy.imagesTitle}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-[#6f665d]">
                      {copy.imagesText}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="url"
                          value={url}
                          onChange={(event) => updateImageUrl(index, event.target.value)}
                          className="input-glass flex-1"
                          placeholder={copy.imagePlaceholder}
                        />

                        {imageUrls.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeImageField(index)}
                            className="flex h-12 w-12 items-center justify-center rounded-[18px] border border-[rgba(221,138,120,0.35)] bg-[rgba(255,237,232,0.92)] text-[#a44a3a] transition hover:bg-[rgba(255,230,223,0.96)]"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addImageField}
                      className="btn-ghost justify-start rounded-full px-0"
                    >
                      {copy.addImage}
                    </button>
                  </div>

                  <p className="text-xs text-[#7a7168]">{copy.imageHelp}</p>
                </section>

                <div>
                  <MobileAdBanner variant="inline" />
                </div>

                <button
                  type="submit"
                  disabled={loading || success}
                  className="btn-primary w-full justify-center rounded-[24px] py-4 text-base disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? copy.creating : copy.createButton}
                </button>
              </form>
            </section>
          </main>

          <aside className="hidden xl:block w-[220px] 2xl:w-[260px] flex-shrink-0">
            <AdBanner position="right" sticky={true} />
          </aside>
        </div>
      </div>
    </div>
  )
}

function BenefitRow({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[rgba(242,171,116,0.72)]" />
      <span>{text}</span>
    </div>
  )
}
