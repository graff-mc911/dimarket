import { useEffect, useState } from 'react'
import {
  Search,
  Hammer,
  MapPin,
  PlusCircle,
  Users,
  ShieldCheck,
  MessageCircle,
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
  const { t, currency } = useApp()

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

      // Завантажуємо головні дані для стартової сторінки:
      // категорії, майстрів і тільки будівельні заявки.
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
          .limit(6),

        supabase
          .from('listings')
          .select(`
            *,
            images:listing_images(*),
            category:categories(*)
          `)
          .eq('status', 'active')
          .eq('listing_type', 'service_request')
          .gte('expires_at', now)
          .order('created_at', { ascending: false })
          .limit(6),
      ])

      if (categoriesResult.data) {
        setCategories(categoriesResult.data)
      }

      if (professionalsResult.data) {
        setProfessionals(professionalsResult.data)
      }

      if (jobsResult.data) {
        setJobs(jobsResult.data as ListingWithImages[])
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault()

    const params = new URLSearchParams()

    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim())
    }

    if (locationQuery.trim()) {
      params.set('location', locationQuery.trim())
    }

    const queryString = params.toString()

    navigateTo(queryString ? `/listings?${queryString}` : '/listings')
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Головний екран.
          Тут користувач одразу має зрозуміти:
          Dimarket — це не барахолка, а платформа будівельних послуг. */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_#f97316,_transparent_35%),radial-gradient(circle_at_bottom_right,_#2563eb,_transparent_30%)]" />

        <div className="relative w-full px-4 md:px-6 xl:px-8 2xl:px-10 py-16 md:py-24">
          <div className="grid lg:grid-cols-[1fr_360px] gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/15 text-orange-300 border border-orange-400/20 mb-6">
                <Hammer className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  Безкоштовно для користувачів. Заробіток тільки з реклами.
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight max-w-5xl">
                Знайди майстра для будівельних робіт у своєму місті
              </h1>

              <p className="text-lg md:text-xl text-gray-300 mt-6 max-w-3xl">
                Створи заявку, отримай пропозиції від майстрів і домовляйся напряму.
                Без комісій, без підписок, без складної системи.
              </p>

              {/* Головний пошук */}
              <form
                onSubmit={handleSearch}
                className="bg-white rounded-3xl shadow-2xl p-3 mt-8 grid md:grid-cols-[1fr_260px_180px] gap-3"
              >
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Що потрібно зробити? Наприклад: плитка, ремонт, фасад..."
                    className="w-full bg-transparent outline-none text-gray-900 placeholder-gray-500"
                  />
                </div>

                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <input
                    value={locationQuery}
                    onChange={(event) => setLocationQuery(event.target.value)}
                    placeholder="Місто або країна"
                    className="w-full bg-transparent outline-none text-gray-900 placeholder-gray-500"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold px-6 py-3 hover:shadow-lg transition"
                >
                  Знайти
                </button>
              </form>

              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  onClick={() => navigateTo('/create-ad')}
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 font-bold text-white hover:bg-orange-600 transition"
                >
                  <PlusCircle className="w-5 h-5" />
                  Створити заявку
                </button>

                <button
                  onClick={() => navigateTo('/professionals')}
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-6 py-4 font-bold text-white border border-white/20 hover:bg-white/15 transition"
                >
                  <Users className="w-5 h-5" />
                  Знайти майстра
                </button>
              </div>
            </div>

            {/* Рекламний блок справа.
                Це майбутнє джерело доходу Dimarket. */}
            <aside className="bg-white/10 border border-white/15 rounded-3xl p-6 backdrop-blur">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center">
                  <Megaphone className="w-6 h-6 text-white" />
                </div>

                <div>
                  <h3 className="font-bold text-lg">Місце для реклами</h3>
                  <p className="text-sm text-gray-300">Будматеріали / інструменти / локальні компанії</p>
                </div>
              </div>

              <div className="h-52 rounded-2xl border border-dashed border-white/30 flex items-center justify-center text-center text-gray-300 px-4">
                Банер 300×250
              </div>

              <button
                onClick={() => navigateTo('/advertise')}
                type="button"
                className="w-full mt-4 rounded-2xl bg-white text-gray-950 font-bold py-3 hover:bg-gray-100 transition"
              >
                Розмістити рекламу
              </button>
            </aside>
          </div>
        </div>
      </section>

      {/* Як працює Dimarket */}
      <section className="py-14 bg-white">
        <div className="w-full px-4 md:px-6 xl:px-8 2xl:px-10">
          <div className="grid md:grid-cols-3 gap-6">
            <InfoCard
              icon={<PlusCircle className="w-7 h-7" />}
              title="1. Клієнт створює заявку"
              text="Описує роботу, місто, бюджет і додає фото за потреби."
            />

            <InfoCard
              icon={<Hammer className="w-7 h-7" />}
              title="2. Майстри відповідають"
              text="Майстри бачать заявки у своїй категорії та надсилають пропозиції."
            />

            <InfoCard
              icon={<MessageCircle className="w-7 h-7" />}
              title="3. Прямий контакт"
              text="Клієнт обирає майстра і домовляється напряму без комісії платформи."
            />
          </div>
        </div>
      </section>

      {/* Категорії */}
      <section className="py-16 bg-gray-50">
        <div className="w-full px-4 md:px-6 xl:px-8 2xl:px-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">
                Категорії будівельних послуг
              </h2>
              <p className="text-gray-600 mt-2">
                Вибери напрямок роботи: ремонт, плитка, електрика, сантехніка, фасад та інше.
              </p>
            </div>

            <button
              onClick={() => navigateTo('/listings')}
              type="button"
              className="inline-flex items-center gap-2 text-orange-600 font-bold"
            >
              Всі заявки
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {loading ? (
            <LoadingBlock />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-7 gap-5">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Останні заявки */}
      <section className="py-16 bg-white">
        <div className="w-full px-4 md:px-6 xl:px-8 2xl:px-10">
          <div className="grid lg:grid-cols-[1fr_320px] gap-8">
            <div>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900">
                    Нові заявки на роботи
                  </h2>
                  <p className="text-gray-600 mt-2">
                    Реальні запити від клієнтів. Майстри можуть відповідати напряму.
                  </p>
                </div>

                <button
                  onClick={() => navigateTo('/listings')}
                  type="button"
                  className="inline-flex items-center gap-2 text-orange-600 font-bold"
                >
                  Переглянути всі
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {loading ? (
                <LoadingBlock />
              ) : jobs.length > 0 ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {jobs.map((job) => (
                    <JobCard key={job.id} job={job} currencySymbol={currency.symbol} />
                  ))}
                </div>
              ) : (
                <EmptyBlock text="Поки що немає активних заявок. Створи першу заявку." />
              )}
            </div>

            {/* Реклама біля заявок */}
            <aside className="space-y-4">
              <AdBox title="Реклама будівельного магазину" />
              <AdBox title="Реклама інструментів" />
            </aside>
          </div>
        </div>
      </section>

      {/* Майстри */}
      <section className="py-16 bg-gray-50">
        <div className="w-full px-4 md:px-6 xl:px-8 2xl:px-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">
                Майстри на Dimarket
              </h2>
              <p className="text-gray-600 mt-2">
                Профілі майстрів, рейтинг, відгуки та прямий контакт.
              </p>
            </div>

            <button
              onClick={() => navigateTo('/professionals')}
              type="button"
              className="inline-flex items-center gap-2 text-orange-600 font-bold"
            >
              Всі майстри
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {loading ? (
            <LoadingBlock />
          ) : professionals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {professionals.map((professional) => (
                <ProfessionalCard key={professional.id} professional={professional} />
              ))}
            </div>
          ) : (
            <EmptyBlock text="Поки що немає майстрів. Зареєструйся як перший майстер." />
          )}
        </div>
      </section>

      {/* Переваги */}
      <section className="py-16 bg-white">
        <div className="w-full px-4 md:px-6 xl:px-8 2xl:px-10">
          <div className="grid md:grid-cols-3 gap-6">
            <InfoCard
              icon={<ShieldCheck className="w-7 h-7" />}
              title="Просто і зрозуміло"
              text="Без зайвих функцій. Тільки заявка, майстер, пропозиція і контакт."
            />

            <InfoCard
              icon={<Users className="w-7 h-7" />}
              title="Безкоштовно для людей"
              text="Користувачі та майстри не платять за створення заявок і контакт."
            />

            <InfoCard
              icon={<Megaphone className="w-7 h-7" />}
              title="Монетизація через рекламу"
              text="Дохід іде від банерів, локальної реклами, будмагазинів і брендів."
            />
          </div>
        </div>
      </section>

      {/* Фінальний заклик */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="w-full px-4 md:px-6 xl:px-8 2xl:px-10 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Почни з простої заявки
          </h2>

          <p className="text-orange-100 text-lg mb-8">
            Напиши, що треба зробити, і дозволь майстрам запропонувати рішення.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigateTo('/create-ad')}
              type="button"
              className="rounded-2xl bg-white text-orange-600 font-bold px-7 py-4 hover:bg-orange-50 transition"
            >
              Створити заявку
            </button>

            <button
              onClick={() => navigateTo('/register')}
              type="button"
              className="rounded-2xl bg-orange-700 text-white font-bold px-7 py-4 hover:bg-orange-800 transition"
            >
              Я майстер
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
      <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-5">
        {icon}
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {title}
      </h3>

      <p className="text-gray-600 leading-relaxed">
        {text}
      </p>
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
      className="text-left bg-white border border-gray-200 rounded-3xl p-5 shadow-sm hover:shadow-lg transition"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
            {job.title}
          </h3>

          <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
          Активна
        </span>
      </div>

      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
        {job.description}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          Бюджет
        </span>

        <span className="font-extrabold text-gray-900">
          {job.price ? `${currencySymbol}${job.price}` : 'За домовленістю'}
        </span>
      </div>
    </button>
  )
}

function AdBox({ title }: { title: string }) {
  return (
    <div className="bg-white border border-dashed border-gray-300 rounded-3xl p-6 min-h-[220px] flex flex-col items-center justify-center text-center">
      <Megaphone className="w-9 h-9 text-orange-500 mb-3" />
      <p className="font-bold text-gray-900">{title}</p>
      <p className="text-sm text-gray-500 mt-2">
        Рекламне місце Dimarket
      </p>
    </div>
  )
}

function LoadingBlock() {
  return (
    <div className="py-12 text-center text-gray-500">
      Завантаження...
    </div>
  )
}

function EmptyBlock({ text }: { text: string }) {
  return (
    <div className="py-14 text-center bg-white border border-gray-200 rounded-3xl text-gray-500">
      {text}
    </div>
  )
}