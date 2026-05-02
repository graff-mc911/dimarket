import { useEffect, useState, type ReactNode } from 'react'
import {
  ArrowRight,
  Clock3,
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

  return (
    <div className="page-bg min-h-screen">
      <section className="px-4 pb-6 pt-4 md:px-6 md:pb-8 xl:px-8 2xl:px-10">
        <div className="mx-auto grid max-w-7xl gap-5 xl:grid-cols-[minmax(0,1fr)_290px]">
          <div className="glass-panel fade-rise p-6 md:p-7 xl:p-8">
            <div className="eyebrow">
              <ShieldCheck className="h-4 w-4" />
              <span>{t('home.globalEyebrow')}</span>
            </div>

            <h1 className="mt-5 max-w-3xl font-[var(--font-display)] text-[1.82rem] font-semibold leading-[1.06] tracking-[-0.04em] text-[var(--ink-900)] md:text-[2.15rem] xl:text-[2.45rem]">
              {t('home.heroSimpleTitle')}
            </h1>

            <p className="muted-text mt-4 max-w-2xl text-[14px] md:text-[15px]">
              {t('home.heroSimpleDescription')}
            </p>

            <form
              onSubmit={handleSearch}
              className="mt-7 grid gap-3 xl:grid-cols-[minmax(0,1fr)_210px_164px]"
            >
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[var(--ink-500)]" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={t('home.whatNeedsToBeDone')}
                  className="input-glass h-[50px] pl-11"
                />
              </div>

              <div className="relative">
                <MapPin className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[var(--ink-500)]" />
                <input
                  value={locationQuery}
                  onChange={(event) => setLocationQuery(event.target.value)}
                  placeholder={t('home.cityOrCountry')}
                  className="input-glass h-[50px] pl-11"
                />
              </div>

              <button type="submit" className="btn-primary h-[50px] rounded-full px-5 text-sm">
                {t('listings.findRequests')}
              </button>
            </form>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
              <button
                onClick={() => navigateTo('/create-ad')}
                type="button"
                className="btn-primary rounded-full px-5 text-sm"
              >
                <PlusCircle className="h-4 w-4" />
                Додати оголошення
              </button>

              <button
                onClick={() => navigateTo('/professionals')}
                type="button"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-700)] transition hover:text-[var(--ink-900)]"
              >
                <span>{t('home.findProfessionals')}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => navigateTo('/listings')}
                type="button"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--ink-700)] transition hover:text-[var(--accent-700)]"
              >
                <span>{t('home.browseRequests')}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-7 flex flex-wrap gap-2">
              {categories.slice(0, 5).map((category) => (
                <button
                  key={category.id}
                  onClick={() => navigateTo(`/listings?category=${category.slug}`)}
                  type="button"
                  className="stat-chip text-[13px]"
                >
                  {getCategoryName(category)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <InfoCard
              icon={<Sparkles className="h-4 w-4" />}
              title="Як це працює"
              text="Клієнти публікують запити на роботу, майстри відповідають напряму, а DImarket залишається безкоштовним для користувачів."
            />

            <InfoCard
              icon={<Megaphone className="h-4 w-4" />}
              title={t('home.adTitle')}
              text={t('home.adText')}
              actionLabel={t('home.adButton')}
              onClick={() => navigateTo('/advertise')}
            />
          </div>
        </div>
      </section>

      <section className="px-4 py-6 md:px-6 xl:px-8 2xl:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            title={t('home.popularCategoriesTitle')}
            text={t('home.popularCategoriesText')}
            buttonText={t('home.browseRequests')}
            onClick={() => navigateTo('/listings')}
          />

          {loading ? (
            <LoadingBlock text={t('home.loading')} />
          ) : categories.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => navigateTo(`/listings?category=${category.slug}`)}
                  type="button"
                  className="glass-card group p-5 text-left transition duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-[16px] border border-[var(--glass-border)] bg-[rgba(255,248,241,0.34)] text-lg text-[var(--accent-700)]">
                      {category.icon || '•'}
                    </div>

                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[var(--ink-500)] transition group-hover:text-[var(--accent-700)]" />
                  </div>

                  <h3 className="mt-4 text-[1rem] font-semibold tracking-[-0.03em] text-[var(--ink-900)] transition group-hover:text-[var(--accent-700)]">
                    {getCategoryName(category)}
                  </h3>

                  <p className="muted-text mt-3 text-[13px]">{getCategoryDescription(category)}</p>
                </button>
              ))}
            </div>
          ) : (
            <EmptyBlock text={t('home.noCategories')} />
          )}
        </div>
      </section>

      <section className="px-4 py-6 md:px-6 xl:px-8 2xl:px-10">
        <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[minmax(0,1fr)_270px]">
          <div>
            <SectionHeader
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
            <MiniInfoCard
              title="Glass UI"
              text="Тонші межі, м'якше світло і більше повітря між блоками."
            />
            <MiniInfoCard
              title={t('home.adCardOne')}
              text={t('home.sidebarAdOne')}
            />
          </div>
        </div>
      </section>

      <section className="px-4 pb-14 pt-6 md:px-6 xl:px-8 2xl:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
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
  title,
  text,
  buttonText,
  onClick,
}: {
  title: string
  text: string
  buttonText: string
  onClick: () => void
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="font-[var(--font-display)] text-[1.42rem] font-semibold leading-[1.08] tracking-[-0.04em] text-[var(--ink-900)] md:text-[1.7rem]">
          {title}
        </h2>
        <p className="muted-text mt-2 max-w-2xl text-[13px] md:text-[14px]">{text}</p>
      </div>

      <button
        onClick={onClick}
        type="button"
        className="btn-ghost self-start rounded-full px-0 text-sm sm:self-auto"
      >
        {buttonText}
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
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
          <span className="inline-flex rounded-full border border-[var(--glass-border)] bg-[rgba(255,252,248,0.38)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-700)]">
            {categoryLabel || unknownCategoryLabel}
          </span>

          <h3 className="mt-4 line-clamp-2 text-[0.98rem] font-semibold tracking-[-0.03em] text-[var(--ink-900)] transition group-hover:text-[var(--accent-700)] md:text-[1.02rem]">
            {job.title}
          </h3>
        </div>

        <span className="shrink-0 rounded-full border border-[rgba(111,145,125,0.18)] bg-[rgba(111,145,125,0.08)] px-3 py-1 text-[10px] font-semibold text-[#4d755e]">
          {activeLabel}
        </span>
      </div>

      <p className="muted-text mt-3 line-clamp-3 text-[13px]">{job.description}</p>

      <div className="mt-4 space-y-2 text-[13px] text-[var(--ink-700)]">
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
        <span className="text-[13px] text-[var(--ink-500)]">{budgetLabel}</span>
        <span className="text-[15px] font-semibold text-[var(--ink-900)]">{budgetValue}</span>
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
    <div className="glass-card p-5 transition duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] border border-[var(--glass-border)] bg-[rgba(255,248,241,0.42)] text-sm font-semibold text-[var(--accent-700)]">
            {initials}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-[0.98rem] font-semibold tracking-[-0.03em] text-[var(--ink-900)] md:text-[1rem]">
              {professional.full_name || defaultNameLabel}
            </h3>
            <p className="mt-1 text-[13px] text-[var(--ink-500)]">
              {professional.location || globalLabel}
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1 rounded-full border border-[var(--glass-border)] bg-[rgba(255,252,248,0.38)] px-3 py-1 text-[13px] font-semibold text-[#8c6728]">
          <Star className="h-4 w-4 fill-current" />
          <span>{ratingLabel}</span>
        </div>
      </div>

      <p className="muted-text mt-4 line-clamp-3 text-[13px]">
        {professional.bio || noBioLabel}
      </p>

      <div className="mt-5 flex flex-col gap-3 border-t border-[var(--glass-border)] pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-[13px] text-[var(--ink-500)]">
          <UserRound className="h-4 w-4 text-[var(--accent-700)]" />
          <span>
            {professional.total_reviews} {reviewLabel}
          </span>
        </div>

        <button
          onClick={() => navigateTo(`/professional/${professional.id}`)}
          type="button"
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-[var(--accent-700)] transition hover:text-[var(--ink-900)]"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function InfoCard({
  icon,
  title,
  text,
  actionLabel,
  onClick,
}: {
  icon: ReactNode
  title: string
  text: string
  actionLabel?: string
  onClick?: () => void
}) {
  return (
    <div className="glass-card p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-[16px] border border-[var(--glass-border)] bg-[rgba(255,248,241,0.36)] text-[var(--accent-700)]">
        {icon}
      </div>

      <h3 className="mt-4 text-[1rem] font-semibold tracking-[-0.03em] text-[var(--ink-900)]">{title}</h3>
      <p className="muted-text mt-3 text-[13px]">{text}</p>

      {actionLabel && onClick && (
        <button
          onClick={onClick}
          type="button"
          className="btn-secondary mt-5 w-full rounded-full text-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

function MiniInfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="glass-card p-5">
      <h3 className="text-[0.98rem] font-semibold tracking-[-0.03em] text-[var(--ink-900)]">{title}</h3>
      <p className="muted-text mt-3 text-[13px]">{text}</p>
    </div>
  )
}

function LoadingBlock({ text }: { text: string }) {
  return <div className="glass-card p-8 text-center text-[var(--ink-500)]">{text}</div>
}

function EmptyBlock({ text }: { text: string }) {
  return <div className="glass-card p-8 text-center text-[var(--ink-500)]">{text}</div>
}

function getInitials(fullName: string | null) {
  if (!fullName) {
    return 'DI'
  }

  const parts = fullName.trim().split(/\s+/).slice(0, 2)

  return parts.map((part) => part[0]?.toUpperCase() || '').join('') || 'DI'
}
