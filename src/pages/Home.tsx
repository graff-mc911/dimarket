import { useEffect, useState } from 'react'
import {
  Search,
  MapPin,
  PlusCircle,
  Hammer,
  Star,
  Megaphone,
  ArrowRight,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Category, ListingWithImages, Profile } from '../lib/types'
import { CategoryCard } from '../components/CategoryCard'
import { ProfessionalCard } from '../components/ProfessionalCard'
import { useApp } from '../contexts/AppContext'
import { navigateTo } from '../lib/navigation'

export function Home() {
  const { currency } = useApp()

  const [categories, setCategories] = useState<Category[]>([])
  const [professionals, setProfessionals] = useState<Profile[]>([])
  const [jobs, setJobs] = useState<ListingWithImages[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [locationQuery, setLocationQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHomeData()
  }, [])

  const loadHomeData = async () => {
    setLoading(true)

    try {
      const now = new Date().toISOString()

      // Завантажуємо категорії, майстрів і свіжі заявки для головної сторінки.
      const [categoriesResult, professionalsResult, jobsResult] = await Promise.all([
        supabase
          .from('categories')
          .select('*')
          .is('parent_id', null)
          .order('name'),

        supabase
          .from('profiles')
          .select('*')
          .eq('is_professional', true)
          .order('rating', { ascending: false })
          .limit(4),

        supabase
          .from('listings')
          .select(`
            *,
            images:listing_images(*),
            category:categories(*)
          `)
          .eq('status', 'active')
          .gte('expires_at', now)
          .order('created_at', { ascending: false })
          .limit(6),
      ])

      if (categoriesResult.data) setCategories(categoriesResult.data)
      if (professionalsResult.data) setProfessionals(professionalsResult.data)
      if (jobsResult.data) setJobs(jobsResult.data as ListingWithImages[])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault()

    const params = new URLSearchParams()

    if (searchQuery.trim()) params.set('search', searchQuery.trim())
    if (locationQuery.trim()) params.set('location', locationQuery.trim())

    const query = params.toString()
    navigateTo(query ? `/listings?${query}` : '/listings')
  }

  return (
    <div className="min-h-screen page-bg">
      {/* Головний блок */}
      <section className="w-full px-4 md:px-6 xl:px-8 2xl:px-10 py-10 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
            <div className="glass-panel p-6 md:p-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50/80 border border-orange-100 text-orange-700 text-sm font-semibold mb-5">
                <Hammer className="w-4 h-4" />
                Будівельні послуги поруч
              </div>

              <h1 className="page-title max-w-3xl">
                Знайди майстра для ремонту, будівництва або монтажу
              </h1>

              <p className="muted-text mt-4 max-w-2xl text-lg">
                Створи заявку або знайди майстра у своєму місті. Dimarket безкоштовний для користувачів.
              </p>

              <form
                onSubmit={handleSearch}
                className="mt-7 grid md:grid-cols-[1fr_240px_150px] gap-3"
              >
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Що потрібно зробити?"
                    className="input-glass pl-12"
                  />
                </div>

                <div className="relative">
                  <MapPin className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    value={locationQuery}
                    onChange={(event) => setLocationQuery(event.target.value)}
                    placeholder="Місто"
                    className="input-glass pl-12"
                  />
                </div>

                <button type="submit" className="btn-primary">
                  Знайти
                </button>
              </form>

              <div className="flex flex-col sm:flex-row gap-3 mt-5">
                <button
                  onClick={() => navigateTo('/create-ad')}
                  type="button"
                  className="btn-secondary"
                >
                  <PlusCircle className="w-5 h-5" />
                  Створити заявку
                </button>

                <button
                  onClick={() => navigateTo('/professionals')}
                  type="button"
                  className="btn-outline"
                >
                  <Hammer className="w-5 h-5" />
                  Знайти майстра
                </button>
              </div>
            </div>

            {/* Реклама справа */}
            <aside className="glass-card p-6 min-h-[280px] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-100/80 text-orange-600 flex items-center justify-center mb-4">
                  <Megaphone className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-extrabold text-gray-950">
                  Реклама
                </h3>

                <p className="muted-text mt-2">
                  Місце для будівельних магазинів, інструментів, матеріалів або локальних компаній.
                </p>
              </div>

              <button
                onClick={() => navigateTo('/advertise')}
                type="button"
                className="btn-primary w-full mt-6"
              >
                Розмістити рекламу
              </button>
            </aside>
          </div>
        </div>
      </section>

      {/* Категорії */}
      <section className="w-full px-4 md:px-6 xl:px-8 2xl:px-10 py-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Популярні категорії"
            text="Основні напрямки будівельних і ремонтних робіт."
            buttonText="Всі категорії"
            onClick={() => navigateTo('/listings')}
          />

          {loading ? (
            <LoadingBlock />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
              {categories.slice(0, 12).map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Свіжі заявки + реклама */}
      <section className="w-full px-4 md:px-6 xl:px-8 2xl:px-10 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_300px] gap-6">
            <div>
              <SectionHeader
                title="Свіжі заявки"
                text="Нові роботи, на які майстри можуть відповісти."
                buttonText="Всі заявки"
                onClick={() => navigateTo('/listings')}
              />

              {loading ? (
                <LoadingBlock />
              ) : jobs.length > 0 ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {jobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      currencySymbol={currency.symbol}
                    />
                  ))}
                </div>
              ) : (
                <EmptyBlock text="Поки що немає активних заявок." />
              )}
            </div>

            <div className="space-y-4">
              <AdBox title="Реклама матеріалів" />
              <AdBox title="Реклама інструментів" />
            </div>
          </div>
        </div>
      </section>

      {/* Майстри */}
      <section className="w-full px-4 md:px-6 xl:px-8 2xl:px-10 py-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Популярні майстри"
            text="Майстри з рейтингом, досвідом і профілем."
            buttonText="Всі майстри"
            onClick={() => navigateTo('/professionals')}
          />

          {loading ? (
            <LoadingBlock />
          ) : professionals.length > 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
              {professionals.map((professional) => (
                <ProfessionalCard
                  key={professional.id}
                  professional={professional}
                />
              ))}
            </div>
          ) : (
            <EmptyBlock text="Поки що немає майстрів." />
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
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
      <div>
        <h2 className="section-title">{title}</h2>
        <p className="muted-text mt-1">{text}</p>
      </div>

      <button
        onClick={onClick}
        type="button"
        className="btn-ghost self-start sm:self-auto"
      >
        {buttonText}
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}

function JobCard({
  job,
  currencySymbol,
}: {
  job: ListingWithImages
  currencySymbol: string
}) {
  return (
    <button
      onClick={() => navigateTo(`/listing/${job.id}`)}
      type="button"
      className="glass-card p-5 text-left hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-extrabold text-gray-950 line-clamp-2">
          {job.title}
        </h3>

        <span className="shrink-0 px-3 py-1 rounded-full bg-green-50/90 text-green-700 text-xs font-bold border border-green-100">
          Активна
        </span>
      </div>

      <p className="muted-text text-sm mt-3 line-clamp-3">
        {job.description}
      </p>

      <div className="flex items-center gap-1 text-sm text-gray-500 mt-4">
        <MapPin className="w-4 h-4" />
        <span>{job.location || 'Локація не вказана'}</span>
      </div>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
        <span className="text-sm text-gray-500">Бюджет</span>

        <span className="font-extrabold text-gray-950">
          {job.price ? `${currencySymbol}${job.price}` : 'За домовленістю'}
        </span>
      </div>
    </button>
  )
}

function AdBox({ title }: { title: string }) {
  return (
    <div className="glass-card p-5 min-h-[180px] flex flex-col justify-center text-center">
      <Megaphone className="w-8 h-8 text-orange-500 mx-auto mb-3" />

      <h3 className="font-extrabold text-gray-950">
        {title}
      </h3>

      <p className="text-sm text-gray-500 mt-2">
        Рекламний блок Dimarket
      </p>
    </div>
  )
}

function LoadingBlock() {
  return (
    <div className="glass-card p-8 text-center text-gray-500">
      Завантаження...
    </div>
  )
}

function EmptyBlock({ text }: { text: string }) {
  return (
    <div className="glass-card p-8 text-center text-gray-500">
      {text}
    </div>
  )
}