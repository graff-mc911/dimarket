import { useEffect, useState } from 'react'
import {
  ArrowRight,
  Clock3,
  Hammer,
  MapPin,
  Megaphone,
  PlusCircle,
  Search,
  ShieldCheck,
  Star,
  UserRound,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Category, ListingWithImages, Profile } from '../lib/types'
import { useApp } from '../contexts/AppContext'
import { navigateTo } from '../lib/navigation'

export function Home() {
  const { currency, language, t } = useApp()

  // Дані для головної сторінки: категорії, майстри, світі job requests.
  const [categories, setCategories] = useState<Category[]>([])
  const [professionals, setProfessionals] = useState<Profile[]>([])
  const [jobs, setJobs] = useState<ListingWithImages[]>([])

  // Поля пошуку у hero-блоці.
  const [searchQuery, setSearchQuery] = useState('')
  const [locationQuery, setLocationQuery] = useState('')

  // Стан початкового завантаження сторінки.
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // При першому відкритті сторінки підтягуємо весь потрібний контент.
    void loadHomeData()
  }, [])

  const loadHomeData = async () => {
    setLoading(true)

    try {
      const now = new Date().toISOString()

      // Для головної сторінки беремо:
      // - верхні категорії
      // - популярних майстрів
      // - тільки активні service_request, щоб блок був релевантним клієнтам і майстрам.
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

    // Передаємо фільтри через query params,
    // щоб сторінка listings відкрилась уже з готовим пошуком.
    const query = params.toString()
    navigateTo(query ? `/listings?${query}` : '/listings')
  }

  // Допоміжний виклик перекладу для динамічних ключів категорій.
  const translateUnsafe = (key: string) => {
    return t(key)
  }

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
      {/* Верхній hero-блок із швидким пошуком */}
      <section className="px-4 pb-6 pt-4 md:px-6 md:pb-8 xl:px-8 2xl:px-10">
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="glass-panel overflow-hidden p-5 md:p-8">
            {/* Невеликий бейдж над заголовком */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/42 bg-[rgba(248,250,252,0.70)] px-4 py-2 text-sm font-semibold text-[#64748b]">
              <ShieldCheck className="h-4 w-4" />
              <span>{t('home.globalEyebrow')}</span>
            </div>

            <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-[#2f2a24] md:text-5xl">
              {t('home.heroSimpleTitle')}
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-[#6f665d] md:text-lg">
              {t('home.heroSimpleDescription')}
            </p>

            {/* Пошук по типу роботи і локації */}
            <form
              onSubmit={handleSearch}
              className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_240px_180px]"
            >
              <div className="relative sm:col-span-2 xl:col-span-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={t('home.whatNeedsToBeDone')}
                  className="input-glass h-14 pl-12"
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  value={locationQuery}
                  onChange={(event) => setLocationQuery(event.target.value)}
                  placeholder={t('home.cityOrCountry')}
                  className="input-glass h-14 pl-12"
                />
              </div>

              <button type="submit" className="btn-primary h-14 rounded-[20px]">
                {t('listings.findRequests')}
              </button>
            </form>

            {/* Швидкі кнопки переходу */}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => navigateTo('/create-ad')}
                type="button"
                className="btn-secondary rounded-[20px]"
              >
                <PlusCircle className="h-5 w-5" />
                {t('home.postJob')}
              </button>

              <button
                onClick={() => navigateTo('/listings')}
                type="button"
                className="btn-outline rounded-[20px]"
              >
                <Hammer className="h-5 w-5" />
                {t('home.browseRequests')}
              </button>
            </div>

            {/* Швидкі категорії під hero-блоком */}
            <div className="mt-7 flex flex-wrap gap-2">
              {categories.slice(0, 4).map((category) => (
                <button
                  key={category.id}
                  onClick={() => navigateTo(`/listings?category=${category.slug}`)}
                  type="button"
                  className="rounded-full border border-white/38 bg-[rgba(255,255,255,0.34)] px-4 py-2 text-sm font-semibold text-[#5f5a54] transition hover:bg-[rgba(255,255,255,0.52)] hover:text-[#2f2a24]"
                >
                  {getCategoryName(category)}
                </button>
              ))}
            </div>
          </div>

          {/* Бокова рекламна картка у hero-частині */}
          <aside className="glass-card flex min-h-[320px] flex-col justify-between p-5">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[rgba(148,163,184,0.16)] text-[#64748b]">
                <Megaphone className="h-6 w-6" />
              </div>

              <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-[#2f2a24]">
                {t('home.adTitle')}
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#6f665d]">
                {t('home.adText')}
              </p>

              <div className="mt-5 grid gap-3">
                <AdPill label={t('home.adCardOne')} />
                <AdPill label={t('home.adCardTwo')} />
                <AdPill label={t('home.adCardThree')} />
              </div>
            </div>

            <button
              onClick={() => navigateTo('/advertise')}
              type="button"
              className="btn-primary mt-6 w-full rounded-[20px]"
            >
              {t('home.adButton')}
            </button>
          </aside>
        </div>
      </section>

      {/* Блок популярних категорій */}
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
                  className="glass-card group p-5 text-left transition duration-200 hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-3xl text-[#64748b]">
                        {category.icon || '...'}
                      </div>
                      <h3 className="mt-4 text-xl font-extrabold text-[#2f2a24] transition group-hover:text-[#475569]">
                        {getCategoryName(category)}
                      </h3>
                    </div>

                    <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-[#94a3b8] transition group-hover:text-[#475569]" />
                  </div>

                  <p className="mt-3 text-sm leading-6 text-[#6f665d]">
                    {getCategoryDescription(category)}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <EmptyBlock text={t('home.noCategories')} />
          )}
        </div>
      </section>

      {/* Блок свіжих job requests */}
      <section className="px-4 py-6 md:px-6 xl:px-8 2xl:px-10">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
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
                {jobs.map((job, index) => (
                  <div key={job.id} className="contents">
                    <HomeJobCard
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

                    {/* Вставляємо проміжну рекламну картку між job cards */}
                    {index === 1 && (
                      <InlineAdCard
                        title={t('home.adTitle')}
                        text={t('home.sponsoredPlacement')}
                        actionLabel={t('home.adButton')}
                        onClick={() => navigateTo('/advertise')}
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyBlock text={t('home.noJobs')} />
            )}
          </div>

          {/* Бокові рекламні підказки */}
          <div className="space-y-4">
            <SidebarAdCard
              title={t('home.adCardOne')}
              text={t('home.sidebarAdOne')}
            />
            <SidebarAdCard
              title={t('home.adCardTwo')}
              text={t('home.sidebarAdTwo')}
            />
          </div>
        </div>
      </section>

      {/* Блок популярних майстрів */}
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
    // Універсальна шапка секції:
    // заголовок, пояснення та кнопка переходу праворуч.
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-[#2f2a24] md:text-3xl">
          {title}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6f665d] md:text-base">
          {text}
        </p>
      </div>

      <button
        onClick={onClick}
        type="button"
        className="btn-ghost self-start rounded-full px-0 sm:self-auto"
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
  // Форматуємо дату створення в локалі поточної мови.
  const createdLabel = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
  }).format(new Date(job.created_at))

  // Якщо бюджету немає, показуємо запасний текст.
  const budgetValue = job.price
    ? `${currencySymbol}${job.price.toLocaleString()}`
    : noBudgetLabel

  return (
    <button
      onClick={() => navigateTo(`/listing/${job.id}`)}
      type="button"
      className="glass-card group p-5 text-left transition duration-200 hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="inline-flex rounded-full bg-[rgba(148,163,184,0.14)] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#475569]">
            {categoryLabel || unknownCategoryLabel}
          </span>

          <h3 className="mt-3 line-clamp-2 text-xl font-extrabold text-[#2f2a24] transition group-hover:text-[#475569]">
            {job.title}
          </h3>
        </div>

        <span className="shrink-0 rounded-full bg-[rgba(126,180,141,0.16)] px-3 py-1 text-xs font-bold text-[#3d7a52]">
          {activeLabel}
        </span>
      </div>

      <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#6f665d]">
        {job.description}
      </p>

      <div className="mt-4 flex items-center gap-2 text-sm text-[#7a7168]">
        <MapPin className="h-4 w-4" />
        <span>{job.location || noLocationLabel}</span>
      </div>

      <div className="mt-2 flex items-center gap-2 text-sm text-[#7a7168]">
        <Clock3 className="h-4 w-4" />
        <span>{createdLabel}</span>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-[rgba(148,163,184,0.16)] pt-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm text-[#7a7168]">{budgetLabel}</span>
        <span className="text-lg font-extrabold text-[#2f2a24]">{budgetValue}</span>
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
  // Формуємо ініціали, якщо в майстра немає фото.
  const initials = getInitials(professional.full_name)

  // Якщо рейтингу ще немає, показуємо бейдж "new".
  const ratingLabel =
    professional.rating > 0 ? professional.rating.toFixed(1) : newLabel

  return (
    <div className="glass-card overflow-hidden p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,rgba(248,250,252,0.92),rgba(203,213,225,0.72))] text-lg font-extrabold text-[#475569]">
            {initials}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-lg font-extrabold text-[#2f2a24]">
              {professional.full_name || defaultNameLabel}
            </h3>
            <p className="mt-1 text-sm text-[#7a7168]">
              {professional.location || globalLabel}
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1 rounded-full bg-[rgba(241,245,249,0.92)] px-3 py-1 text-sm font-bold text-[#475569]">
          <Star className="h-4 w-4 fill-current" />
          <span>{ratingLabel}</span>
        </div>
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#6f665d]">
        {professional.bio || noBioLabel}
      </p>

      <div className="mt-5 flex flex-col gap-3 border-t border-[rgba(148,163,184,0.16)] pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-[#7a7168]">
          <UserRound className="h-4 w-4" />
          <span>
            {professional.total_reviews} {reviewLabel}
          </span>
        </div>

        <button
          onClick={() => navigateTo(`/professional/${professional.id}`)}
          type="button"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[rgba(148,163,184,0.16)] px-4 py-2 text-sm font-bold text-[#475569] transition hover:bg-[rgba(148,163,184,0.24)] sm:w-auto"
        >
          <ArrowRight className="h-4 w-4" />
          <span>{actionLabel}</span>
        </button>
      </div>
    </div>
  )
}

function AdPill({ label }: { label: string }) {
  return (
    // Невеликий декоративний елемент для рекламних напрямків.
    <div className="rounded-[20px] border border-white/38 bg-[rgba(255,255,255,0.30)] px-4 py-3 text-sm font-semibold text-[#5f5a54]">
      {label}
    </div>
  )
}

function InlineAdCard({
  title,
  text,
  actionLabel,
  onClick,
}: {
  title: string
  text: string
  actionLabel: string
  onClick: () => void
}) {
  return (
    // Рекламна картка всередині сітки job requests.
    <div className="glass-card flex flex-col justify-between p-5 text-left">
      <div>
        <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[rgba(148,163,184,0.16)] text-[#64748b]">
          <Megaphone className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-xl font-extrabold text-[#2f2a24]">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-[#6f665d]">{text}</p>
      </div>

      <button
        onClick={onClick}
        type="button"
        className="btn-secondary mt-5 w-full rounded-[20px]"
      >
        {actionLabel}
      </button>
    </div>
  )
}

function SidebarAdCard({
  title,
  text,
}: {
  title: string
  text: string
}) {
  return (
    // Бокова рекламна картка для правої колонки.
    <div className="glass-card p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[rgba(148,163,184,0.16)] text-[#64748b]">
        <Megaphone className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-lg font-extrabold text-[#2f2a24]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#6f665d]">{text}</p>
    </div>
  )
}

function LoadingBlock({ text }: { text: string }) {
  return (
    // Універсальний стан завантаження для секцій home.
    <div className="glass-card p-8 text-center text-[#7a7168]">
      {text}
    </div>
  )
}

function EmptyBlock({ text }: { text: string }) {
  return (
    // Універсальний пустий стан, якщо даних ще немає.
    <div className="glass-card p-8 text-center text-[#7a7168]">
      {text}
    </div>
  )
}

function getInitials(fullName: string | null) {
  if (!fullName) {
    return 'DM'
  }

  const parts = fullName.trim().split(/\s+/).slice(0, 2)

  return parts.map((part) => part[0]?.toUpperCase() || '').join('') || 'DM'
}
