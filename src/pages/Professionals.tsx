import { useEffect, useMemo, useState } from 'react'
import { Search, Star, SlidersHorizontal } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Profile, Category } from '../lib/types'
import { ProfessionalCard } from '../components/ProfessionalCard'
import { MobileAdBanner } from '../components/MobileAdBanner'
import { AdBanner } from '../components/AdBanner'
import { useApp } from '../contexts/AppContext'
import { navigateTo } from '../lib/navigation'

export function Professionals() {
  // Отримуємо функцію перекладу з глобального контексту додатка
  const { t } = useApp()

  // Список усіх майстрів / компаній
  const [professionals, setProfessionals] = useState<Profile[]>([])

  // Список категорій для фільтра
  const [categories, setCategories] = useState<Category[]>([])

  // Стан завантаження сторінки
  const [loading, setLoading] = useState(true)

  // Пошуковий запит
  const [searchQuery, setSearchQuery] = useState('')

  // Вибрана категорія
  const [selectedCategory, setSelectedCategory] = useState('')

  // Сортування:
  // rating  -> за рейтингом
  // newest  -> за новизною
  // views   -> за переглядами
  const [sortBy, setSortBy] = useState<'rating' | 'newest' | 'views'>('rating')

  // Показати / сховати розширені фільтри
  const [showFilters, setShowFilters] = useState(false)

  // Мінімальний рейтинг для фільтра
  const [minRating, setMinRating] = useState(0)

  // Фільтр по локації
  const [locationFilter, setLocationFilter] = useState('')

  useEffect(() => {
    // При першому відкритті сторінки:
    // 1) вантажимо категорії
    // 2) вантажимо список майстрів
    loadCategories()
    loadProfessionals()
  }, [])

  const loadCategories = async () => {
    // Отримуємо всі категорії з бази
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (data) setCategories(data)
  }

  const loadProfessionals = async () => {
    // Вмикаємо стан завантаження
    setLoading(true)

    // Тягнемо всіх професіоналів
    // Спочатку сортуємо по рейтингу, потім по кількості відгуків
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_professional', true)
      .order('rating', { ascending: false })
      .order('total_reviews', { ascending: false })

    if (data) setProfessionals(data)

    // Вимикаємо стан завантаження
    setLoading(false)
  }

  // useMemo потрібен для того, щоб не перераховувати
  // фільтрацію та сортування на кожен дрібний ререндер без потреби
  const filteredProfessionals = useMemo(() => {
    return professionals
      .filter((prof) => {
        // Пошук по:
        // - імені
        // - опису
        // - локації
        const matchesSearch =
          searchQuery === '' ||
          prof.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prof.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prof.location?.toLowerCase().includes(searchQuery.toLowerCase())

        // Якщо minRating = 0, то не фільтруємо по рейтингу
        const matchesRating = minRating === 0 || (prof.rating || 0) >= minRating

        // Якщо locationFilter порожній — фільтр по місцю не застосовується
        const matchesLocation =
          locationFilter === '' ||
          prof.location?.toLowerCase().includes(locationFilter.toLowerCase())

        // Тут category-фільтр поки що м'який.
        // Якщо в профілях немає category_id, ми не ламаємо логіку.
        const matchesCategory = selectedCategory === '' || true

        return matchesSearch && matchesRating && matchesLocation && matchesCategory
      })
      .sort((a, b) => {
        // Сортування залежно від вибору користувача
        switch (sortBy) {
          case 'rating':
            return (b.rating || 0) - (a.rating || 0)

          case 'views':
            return (b.profile_views || 0) - (a.profile_views || 0)

          case 'newest':
            return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()

          default:
            return 0
        }
      })
  }, [professionals, searchQuery, minRating, locationFilter, selectedCategory, sortBy])

  return (
    <div className="min-h-screen bg-gray-50 py-8 w-full">
      {/* 
        Головний full-width контейнер сторінки.
        Саме тут сторінка розтягується майже на всю ширину монітора.
        Ми НЕ використовуємо max-w-7xl, тому контент не стискається в центрі.
      */}
      <div className="w-full px-4 md:px-6 xl:px-8 2xl:px-10">
        {/* 
          Триколонковий layout:
          - ліва реклама
          - центральний контент
          - права реклама

          Раніше вся проблема була в тому, що:
          1) загальний контейнер був вузький
          2) центр був надто вузький
          3) бокові рекламні блоки "з'їдали" простір

          Тепер:
          - весь контейнер широкий
          - реклама має фіксовану ширину
          - центральна колонка займає все інше місце
        */}
        <div className="flex gap-6 items-start">
          {/* 
            ЛІВА БОКОВА РЕКЛАМА
            hidden xl:block -> показуємо тільки на великих екранах
            flex-shrink-0   -> не дозволяємо колонці стискатись
          */}
          <aside className="hidden xl:block w-[240px] 2xl:w-[280px] flex-shrink-0">
            <AdBanner position="left" sticky={true} />
          </aside>

          {/* 
            ГОЛОВНА ЦЕНТРАЛЬНА КОЛОНКА

            flex-1  -> займає весь доступний простір між лівою і правою рекламою
            min-w-0 -> важливо для правильного стискання внутрішніх блоків без поломки layout
          */}
          <main className="flex-1 min-w-0">
            <div className="mb-8">
              {/* Верхній заголовок сторінки */}
              <div className="flex flex-col 2xl:flex-row 2xl:items-center 2xl:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {t('professionals.title')}
                  </h1>
                  <p className="text-gray-600">
                    {t('professionals.subtitle')}
                  </p>
                </div>

                {/* Декоративний блок про рейтинг */}
                <div className="flex items-center space-x-2 text-yellow-500">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="text-gray-700 font-medium">
                    {t('professionals.topRated')}
                  </span>
                </div>
              </div>

              {/* 
                Верхня панель керування:
                - пошук
                - вибір категорії
                - кнопка відкриття фільтрів

                На великих екранах ця панель стає горизонтальною.
              */}
              <div className="flex flex-col 2xl:flex-row gap-4 mb-4">
                {/* Поле пошуку */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('professionals.searchPlaceholder')}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                {/* Вибір категорії */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full 2xl:w-[280px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">{t('listings.allCategories')}</option>

                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>

                {/* Кнопка показу додаткових фільтрів */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  type="button"
                  className="w-full 2xl:w-[200px] px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2 bg-white"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  {t('listings.filters')}
                </button>
              </div>

              {/* 
                Розширені фільтри.
                Показуються лише тоді, коли showFilters = true
              */}
              {showFilters && (
                <div className="mt-4 p-5 bg-white rounded-xl border border-gray-200 space-y-4 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
                    {/* Сортування */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('professionals.sortBy')}
                      </label>

                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'rating' | 'newest' | 'views')}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value="rating">{t('professionals.topRated')}</option>
                        <option value="views">{t('professionals.mostViewed')}</option>
                        <option value="newest">{t('professionals.newest')}</option>
                      </select>
                    </div>

                    {/* Мінімальний рейтинг */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('professionals.minRating')}
                      </label>

                      <select
                        value={minRating}
                        onChange={(e) => setMinRating(Number(e.target.value))}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value="0">{t('professionals.anyRating')}</option>
                        <option value="3">3+ Stars</option>
                        <option value="4">4+ Stars</option>
                        <option value="4.5">4.5+ Stars</option>
                      </select>
                    </div>

                    {/* Фільтр по місцю */}
                    <div className="md:col-span-2 2xl:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('professionals.location')}
                      </label>

                      <input
                        type="text"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        placeholder={t('professionals.locationPlaceholder')}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>

                    {/* Кнопка скидання фільтрів */}
                    <div className="flex items-end">
                      <button
                        onClick={() => {
                          setMinRating(0)
                          setLocationFilter('')
                          setSortBy('rating')
                          setSelectedCategory('')
                          setSearchQuery('')
                        }}
                        type="button"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium transition"
                      >
                        {t('listings.clearFilters')}
                      </button>
                    </div>
                  </div>

                  {/* Підсумок кількості знайдених майстрів */}
                  <div className="pt-2 border-t">
                    <span className="text-sm text-gray-600">
                      {filteredProfessionals.length} {t('professionals.found')}
                    </span>
                  </div>
                </div>
              )}

              {/* Мобільний рекламний блок під фільтрами */}
              <div className="mt-4">
                <MobileAdBanner variant="horizontal" />
              </div>
            </div>

            {/* Стан завантаження */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-gray-500">{t('professionals.loading')}</div>
              </div>
            ) : filteredProfessionals.length > 0 ? (
              /* 
                Сітка карточок майстрів.
                На дуже широких екранах показуємо 3 карточки в ряд у центрі.
                Це дає широку сторінку без надто дрібних карточок.
              */
              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                {filteredProfessionals.map((professional, index) => (
                  <div key={professional.id}>
                    <ProfessionalCard professional={professional} />

                    {/* Вставка мобільної реклами між карточками */}
                    {(index + 1) % 6 === 0 && index < filteredProfessionals.length - 1 && (
                      <div className="mt-6">
                        <MobileAdBanner variant="inline" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              /* Стан, коли нікого не знайдено */
              <div className="text-center py-20">
                <div className="text-gray-500 mb-4">
                  {t('professionals.noFound')}
                </div>

                <p className="text-gray-600 mb-6">
                  {t('professionals.beFirst')}
                </p>

                <button
                  onClick={() => navigateTo('/register')}
                  type="button"
                  className="inline-block bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
                >
                  {t('professionals.registerAsProfessional')}
                </button>
              </div>
            )}

            {/* Нижній мобільний рекламний блок */}
            <div className="mt-8">
              <MobileAdBanner variant="inline" />
            </div>
          </main>

          {/* 
            ПРАВА БОКОВА РЕКЛАМА
            Аналогічна логіка, як і зліва
          */}
          <aside className="hidden xl:block w-[240px] 2xl:w-[280px] flex-shrink-0">
            <AdBanner position="right" sticky={true} />
          </aside>
        </div>
      </div>
    </div>
  )
}