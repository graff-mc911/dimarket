import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  ArrowRight,
  Clock3,
  Hammer,
  MapPin,
  Megaphone,
  PlusCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Category, ListingWithImages, Profile } from '../lib/types'
import { useApp } from '../contexts/AppContext'
import { navigateTo } from '../lib/navigation'

export function Home() {
  const { currency, language, t } = useApp()

  const [categories, setCategories] = useState<Category[]>([])
  const [professionals, setProfessionals] = useState<Profile[]>([])
  const [jobs, setJobs] = useState<ListingWithImages[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [locationQuery, setLocationQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void loadHomeData()
  }, [])

  const loadHomeData = async () => {
    setLoading(true)

    try {
      const now = new Date().toISOString()

      const [categoriesResult, professionalsResult, jobsResult] = await Promise.all([
        supabase
          .from('categories')
          .select('*')
          .is('parent_id', null)
          .order('name')
          .limit(8),

        supabase
          .from('profiles')
          .select('*')
          .eq('is_professional', true)
          .order('rating', { ascending: false })
          .order('total_reviews', { ascending: false })
          .limit(4),

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
          .order('created_at', { ascending: false })
          .limit(6),
      ])

      setCategories(categoriesResult.data ?? [])
      setProfessionals(professionalsResult.data ?? [])
      setJobs((jobsResult.data as ListingWithImages[] | null) ?? [])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const params = new URLSearchParams()

    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim())
    }

    if (locationQuery.trim()) {
      params.set('location', locationQuery.trim())
    }

    const query = params.toString()
    navigateTo(query ? `/listings?${query}` : '/listings')
  }

  const translateUnsafe = (key: string) => t(key)

  const getCategoryName = (category: Category) => {
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

  const getCategoryDescription = (category: Category) => {
    const legacyKey = `category.${category.slug}Desc`
    const legacyValue = translateUnsafe(legacyKey)

    if (legacyValue !== legacyKey) {
      return legacyValue
    }

    return category.description || t('home.unknownCategory')
  }

  const getListingCategoryName = (job: ListingWithImages) => {
    if (!job.category) {
      return t('home.unknownCategory')
    }

    return getCategoryName(job.category)
  }

  const heroStats = useMemo(
    () => [
      { value: categories.length || 8, label: t('home.popularCategoriesTitle') },
      { value: jobs.length || 6, label: t('home.freshRequestsTitle') },
      { value: professionals.length || 4, label: t('home.popularProsTitle') },
    ],
    [categories.length, jobs.length, professionals.length, t]
  )

  const featuredCategories = categories.slice(0, 5)

  return (
    <div className="page-bg min-h-screen">
      <section className="px-4 pb-6 pt-4 md:px-6 md:pb-8 xl:px-8 2xl:px-10">
        <div className="mx-auto grid max-w-7xl gap-5 xl:grid-cols-[minmax(0,1.18fr)_360px]">
          <div className="hero-glass fade-rise p-6 md:p-8 xl:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,220,194,0.20)] bg-[rgba(255,245,236,0.10)] px-4 py-2 text-sm font-semibold text-[rgba(255,239,227,0.92)] backdrop-blur-md">
              <ShieldCheck className="h-4 w-4" />
              <span>{t('home.globalEyebrow')}</span>
            </div>

            <h1 className="hero-title mt-6 max-w-4xl">
              {t('home.heroSimpleTitle')}
            </h1>

            <p className="hero-muted-text mt-4 max-w-3xl text-base md:text-lg">
              {t('home.heroSimpleDescription')}
            </p>

            <form
              onSubmit={handleSearch}
              className="mt-8 grid gap-3 xl:grid-cols-[minmax(0,1fr)_240px_190px]"
            >
              <div className="relative xl:col-span-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[rgba(255,236,220,0.66)]" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={t('home.whatNeedsToBeDone')}
                  className="input-hero h-14 pl-11"
                />
              </div>

              <div className="relative">
                <MapPin className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[rgba(255,236,220,0.66)]" />
                <input
                  value={locationQuery}
                  onChange={(event) => setLocationQuery(event.target.value)}
                  placeholder={t('home.cityOrCountry')}
                  className="input-hero h-14 pl-11"
                />
              </div>

              <button type="submit" className="btn-primary h-14 rounded-full">
                {t('listings.findRequests')}
              </button>
            </form>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                onClick={() => navigateTo('/create-ad')}
                type="button"
                className="btn-primary rounded-full"
              >
                <PlusCircle className="h-4 w-4" />
                Додати оголошення
              </button>

              <button
                onClick={() => navigateTo('/professionals')}
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(255,223,199,0.20)] bg-[rgba(255,248,241,0.08)] px-6 py-3.5 font-semibold text-[rgba(255,244,234,0.94)] transition hover:bg-[rgba(255,248,241,0.14)]"
              >
                <Hammer className="h-4 w-4" />
                {t('home.findProfessionals')}
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {featuredCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => navigateTo(`/listings?category=${category.slug}`)}
                  type="button"
                  className="rounded-full border border-[rgba(255,223,199,0.18)] bg-[rgba(255,248,241,0.08)] px-4 py-2 text-sm font-medium text-[rgba(255,242,231,0.88)] transition hover:bg-[rgba(255,248,241,0.15)]"
                >
                  {getCategoryName(category)}
                </button>
              ))}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {heroStats.map((item, index) => (
                <div
                  key={item.label}
                  className={`rounded-[24px] border border-[rgba(255,223,199,0.16)] bg-[rgba(255,248,241,0.08)] px-4 py-4 backdrop-blur-md fade-rise ${
                    index === 0 ? 'stagger-1' : index === 1 ? 'stagger-2' : 'stagger-3'
                  }`}
                >
                  <div className="text-2xl font-semibold text-[#fff8f2]">{item.value}</div>
                  <div className="mt-1 text-sm text-[rgba(255,240,228,0.72)]">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="glass-card fade-rise p-6">
              <div className="eyebrow">DImarket</div>
              <h2 className="section-title mt-5 text-[2rem]">Спокійний пошук без зайвого шуму</h2>
              <p className="muted-text mt-4 text-sm md:text-base">
                Один простий вхід: знайти майстра, переглянути оголошення або залишити свій запит.
              </p>

              <div className="mt-5 space-y-3">
                <InfoRow text="Пошук по сайту прямо з головної сторінки" />
                <InfoRow text="Тонкі помаранчеві акценти замість грубих блоків" />
                <InfoRow text="Зручна мобільна версія без перевантаження" />
              </div>
            </div>

            <div className="glass-card fade-rise p-6 stagger-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-[20px] border border-[var(--glass-border)] bg-[rgba(255,247,239,0.42)] text-[var(--accent-700)]">
                <Megaphone className="h-5 w-5" />
              </div>

              <h3 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-[var(--ink-900)]">
                {t('home.adTitle')}
              </h3>

              <p className="muted-text mt-3 text-sm md:text-base">
                {t('home.adText')}
              </p>

              <div className="mt-5 space-y-3">
                <MiniGlassPill label={t('home.adCardOne')} />
                <MiniGlassPill label={t('home.adCardTwo')} />
                <MiniGlassPill label={t('home.adCardThree')} />
              </div>

              <button
                onClick={() => navigateTo('/advertise')}
                type="button"
                className="btn-secondary mt-6 w-full rounded-full"
              >
                {t('home.adButton')}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-6 md:px-6 xl:px-8 2xl:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow={t('home.popularCategoriesTitle')}
            title={t('home.popularCategoriesTitle')}
            text={t('home.popularCategoriesText')}
            buttonText={t('home.browseRequests')}
            onClick={() => navigateTo('/listings')}
          />

          {loading ? (
            <LoadingBlock text={t('home.loading')} />
          ) : categories.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {categories.map((category, index) => (
                <CategorySpotlightCard
                  key={category.id}
                  category={category}
                  index={index}
                  title={getCategoryName(category)}
                  description={getCategoryDescription(category)}
                />
              ))}
            </div>
          ) : (
            <EmptyBlock text={t('home.noCategories')} />
          )}
        </div>
      </section>

      <section className="px-4 py-6 md:px-6 xl:px-8 2xl:px-10">
        <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <SectionHeader
              eyebrow={t('home.freshRequestsTitle')}
              title={t('home.freshRequestsTitle')}
              text={t('home.freshRequestsText')}
              buttonText={t('home.allRequests')}
              onClick={() => navigateTo('/listings')}
            />

            {loading ? (
              <LoadingBlock text={t('home.loading')} />
            ) : jobs.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {jobs.map((job) => (
                  <HomeJobCard
                    key={job.id}
                    job={job}
                    categoryLabel={getListingCategoryName(job)}
                    currencySymbol={currency.symbol}
                    locale={language.code}
                    budgetLabel={t('home.budgetLabel')}
                    activeLabel={t('home.activeLabel')}
                    noBudgetLabel={t('listing.contactForPrice')}
                    noLocationLabel={t('home.noLocation')}
                    unknownCategoryLabel={t('home.unknownCategory')}
                  />
                ))}
              </div>
            ) : (
              <EmptyBlock text={t('home.noJobs')} />
            )}
          </div>

          <div className="space-y-4">
            <InlineInfoCard
              icon={<Sparkles className="h-5 w-5" />}
              title="Glass UI для щоденного користування"
              text="Картки, поля й панелі тепер читаються легше, виглядають тонше і не тиснуть візуально."
            />
            <InlineInfoCard
              icon={<Megaphone className="h-5 w-5" />}
              title={t('home.adCardOne')}
              text={t('home.sidebarAdOne')}
            />
            <InlineInfoCard
              icon={<Megaphone className="h-5 w-5" />}
              title={t('home.adCardTwo')}
              text={t('home.sidebarAdTwo')}
            />
          </div>
        </div>
      </section>

      <section className="px-4 pb-14 pt-6 md:px-6 xl:px-8 2xl:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow={t('home.popularProsTitle')}
            title={t('home.popularProsTitle')}
            text={t('home.popularProsText')}
            buttonText={t('home.allPros')}
            onClick={() => navigateTo('/professionals')}
          />

          {loading ? (
            <LoadingBlock text={t('home.loading')} />
          ) : professionals.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {professionals.map((professional) => (
                <ProfessionalPreviewCard
                  key={professional.id}
                  professional={professional}
                  noBioLabel={t('home.noBio')}
                  defaultNameLabel={t('professional.defaultName')}
                  globalLabel={t('professional.global')}
                  newLabel={t('professional.new')}
                  reviewLabel={t('professional.reviews')}
                  actionLabel={t('professional.contact')}
                />
              ))}
            </div>
          ) : (
            <EmptyBlock text={t('home.noProfessionals')} />
          )}
        </div>
      </section>
    </div>
  )
}

function SectionHeader({
  eyebrow,
  title,
  text,
  buttonText,
  onClick,
}: {
  eyebrow: string
  title: string
  text: string
  buttonText: string
  onClick: () => void
}) {
  return (
    <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        <div className="eyebrow">{eyebrow}</div>
        <h2 className="section-title mt-4">{title}</h2>
        <p className="muted-text mt-3 text-sm md:text-base">{text}</p>
      </div>

      <button
        onClick={onClick}
        type="button"
        className="btn-ghost self-start rounded-full px-0 md:self-auto"
      >
        {buttonText}
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  )
}

function CategorySpotlightCard({
  category,
  index,
  title,
  description,
}: {
  category: Category
  index: number
  title: string
  description: string
}) {
  return (
    <button
      onClick={() => navigateTo(`/listings?category=${category.slug}`)}
      type="button"
      className={`glass-card fade-rise group p-5 text-left transition duration-300 hover:-translate-y-1 ${
        index < 3 ? `stagger-${index + 1}` : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-[22px] border border-[var(--glass-border)] bg-[rgba(255,247,239,0.46)] text-2xl text-[var(--accent-700)]">
          {category.icon || '•'}
        </div>

        <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-[var(--ink-500)] transition group-hover:text-[var(--accent-700)]" />
      </div>

      <h3 className="mt-5 text-[1.45rem] font-semibold tracking-[-0.04em] text-[var(--ink-900)] transition group-hover:text-[var(--accent-700)]">
        {title}
      </h3>

      <p className="muted-text mt-3 text-sm">{description}</p>
    </button>
  )
}

function HomeJobCard({
  job,
  categoryLabel,
  currencySymbol,
  locale,
  budgetLabel,
  activeLabel,
  noBudgetLabel,
  noLocationLabel,
  unknownCategoryLabel,
}: {
  job: ListingWithImages
  categoryLabel: string
  currencySymbol: string
  locale: string
  budgetLabel: string
  activeLabel: string
  noBudgetLabel: string
  noLocationLabel: string
  unknownCategoryLabel: string
}) {
  const createdLabel = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
  }).format(new Date(job.created_at))

  const budgetValue = job.price
    ? `${currencySymbol}${job.price.toLocaleString()}`
    : noBudgetLabel

  return (
    <button
      onClick={() => navigateTo(`/listing/${job.id}`)}
      type="button"
      className="glass-card group p-5 text-left transition duration-300 hover:-translate-y-1"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="inline-flex rounded-full border border-[var(--glass-border)] bg-[rgba(255,248,241,0.42)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-700)]">
            {categoryLabel || unknownCategoryLabel}
          </span>

          <h3 className="mt-4 line-clamp-2 text-[1.35rem] font-semibold tracking-[-0.04em] text-[var(--ink-900)] transition group-hover:text-[var(--accent-700)]">
            {job.title}
          </h3>
        </div>

        <span className="shrink-0 rounded-full border border-[rgba(111,145,125,0.22)] bg-[rgba(111,145,125,0.10)] px-3 py-1 text-xs font-semibold text-[#4d755e]">
          {activeLabel}
        </span>
      </div>

      <p className="muted-text mt-3 line-clamp-3 text-sm">{job.description}</p>

      <div className="mt-5 grid gap-2 text-sm text-[var(--ink-700)]">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-[var(--accent-700)]" />
          <span>{job.location || noLocationLabel}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-[var(--accent-700)]" />
          <span>{createdLabel}</span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-[var(--glass-border)] pt-4">
        <span className="text-sm text-[var(--ink-500)]">{budgetLabel}</span>
        <span className="text-lg font-semibold text-[var(--ink-900)]">{budgetValue}</span>
      </div>
    </button>
  )
}

function ProfessionalPreviewCard({
  professional,
  noBioLabel,
  defaultNameLabel,
  globalLabel,
  newLabel,
  reviewLabel,
  actionLabel,
}: {
  professional: Profile
  noBioLabel: string
  defaultNameLabel: string
  globalLabel: string
  newLabel: string
  reviewLabel: string
  actionLabel: string
}) {
  const initials = getInitials(professional.full_name)
  const ratingLabel =
    professional.rating > 0 ? professional.rating.toFixed(1) : newLabel

  return (
    <div className="glass-card overflow-hidden p-5 transition duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] border border-[var(--glass-border)] bg-[linear-gradient(135deg,rgba(255,247,239,0.64),rgba(242,204,171,0.46))] text-lg font-semibold text-[var(--accent-700)]">
            {initials}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-[1.2rem] font-semibold tracking-[-0.04em] text-[var(--ink-900)]">
              {professional.full_name || defaultNameLabel}
            </h3>
            <p className="mt-1 text-sm text-[var(--ink-500)]">
              {professional.location || globalLabel}
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1 rounded-full border border-[var(--glass-border)] bg-[rgba(255,248,241,0.42)] px-3 py-1 text-sm font-semibold text-[#8c6728]">
          <Star className="h-4 w-4 fill-current" />
          <span>{ratingLabel}</span>
        </div>
      </div>

      <p className="muted-text mt-4 line-clamp-3 text-sm">
        {professional.bio || noBioLabel}
      </p>

      <div className="mt-5 flex flex-col gap-3 border-t border-[var(--glass-border)] pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-[var(--ink-500)]">
          <UserRound className="h-4 w-4 text-[var(--accent-700)]" />
          <span>
            {professional.total_reviews} {reviewLabel}
          </span>
        </div>

        <button
          onClick={() => navigateTo(`/professional/${professional.id}`)}
          type="button"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-700)] transition hover:text-[var(--ink-900)]"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function InlineInfoCard({
  icon,
  title,
  text,
}: {
  icon: ReactNode
  title: string
  text: string
}) {
  return (
    <div className="glass-card p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-[18px] border border-[var(--glass-border)] bg-[rgba(255,247,239,0.42)] text-[var(--accent-700)]">
        {icon}
      </div>
      <h3 className="mt-4 text-[1.3rem] font-semibold tracking-[-0.04em] text-[var(--ink-900)]">{title}</h3>
      <p className="muted-text mt-3 text-sm">{text}</p>
    </div>
  )
}

function MiniGlassPill({ label }: { label: string }) {
  return (
    <div className="rounded-[20px] border border-[var(--glass-border)] bg-[rgba(255,250,245,0.40)] px-4 py-3 text-sm font-medium text-[var(--ink-700)] backdrop-blur-sm">
      {label}
    </div>
  )
}

function InfoRow({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-[20px] border border-[var(--glass-border)] bg-[rgba(255,250,245,0.36)] px-4 py-3 backdrop-blur-sm">
      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgba(169,105,66,0.12)] text-[var(--accent-700)]">
        <Sparkles className="h-3.5 w-3.5" />
      </div>
      <span className="text-sm text-[var(--ink-700)]">{text}</span>
    </div>
  )
}

function LoadingBlock({ text }: { text: string }) {
  return (
    <div className="glass-card p-8 text-center text-[var(--ink-500)]">
      {text}
    </div>
  )
}

function EmptyBlock({ text }: { text: string }) {
  return (
    <div className="glass-card p-8 text-center text-[var(--ink-500)]">
      {text}
    </div>
  )
}

function getInitials(fullName: string | null) {
  if (!fullName) {
    return 'DI'
  }

  const parts = fullName.trim().split(/\s+/).slice(0, 2)

  return parts.map((part) => part[0]?.toUpperCase() || '').join('') || 'DI'
}
