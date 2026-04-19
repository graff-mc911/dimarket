import { useEffect, useMemo, useState } from 'react'
import { Search, SlidersHorizontal, Users } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Profile } from '../lib/types'
import { ProfessionalCard } from '../components/ProfessionalCard'
import { useApp } from '../contexts/AppContext'

export function Professionals() {
  const { t } = useApp()

  const [professionals, setProfessionals] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [minRating, setMinRating] = useState('')
  const [onlyVerified, setOnlyVerified] = useState(false)

  useEffect(() => {
    loadProfessionals()
  }, [])

  const loadProfessionals = async () => {
    setLoading(true)

    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_professional', true)
        .order('rating', { ascending: false })

      if (data) {
        setProfessionals(data)
      }
    } finally {
      setLoading(false)
    }
  }

  const filteredProfessionals = useMemo(() => {
    let result = [...professionals]

    const normalizedSearch = searchQuery.trim().toLowerCase()

    if (normalizedSearch) {
      result = result.filter((professional) => {
        const fullName = professional.full_name?.toLowerCase() || ''
        const bio = professional.bio?.toLowerCase() || ''
        const location = professional.location?.toLowerCase() || ''

        return (
          fullName.includes(normalizedSearch) ||
          bio.includes(normalizedSearch) ||
          location.includes(normalizedSearch)
        )
      })
    }

    if (minRating) {
      result = result.filter(
        (professional) => Number(professional.rating || 0) >= Number(minRating)
      )
    }

    if (onlyVerified) {
      result = result.filter((professional) => Boolean(professional.is_verified))
    }

    return result
  }, [professionals, searchQuery, minRating, onlyVerified])

  const resetFilters = () => {
    setSearchQuery('')
    setMinRating('')
    setOnlyVerified(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 w-full">
      <div className="w-full px-4 md:px-6 xl:px-8 2xl:px-10">
        {/* Верхній блок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t('header.findProfessionals')}
          </h1>

          <div className="flex flex-col xl:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('home.findProfessionals')}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              type="button"
              className="flex items-center justify-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition xl:min-w-[180px]"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>{t('listings.filters')}</span>
            </button>
          </div>

          {showFilters && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Мінімальний рейтинг
                  </label>

                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Будь-який</option>
                    <option value="5">5</option>
                    <option value="4">4+</option>
                    <option value="3">3+</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-3 text-sm font-medium text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlyVerified}
                      onChange={(e) => setOnlyVerified(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span>Лише перевірені профілі</span>
                  </label>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={resetFilters}
                    type="button"
                    className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                  >
                    Скинути фільтри
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Список майстрів */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="text-gray-500">{t('listings.loading')}</div>
          </div>
        ) : filteredProfessionals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {filteredProfessionals.map((professional) => (
              <ProfessionalCard key={professional.id} professional={professional} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <Users className="w-14 h-14 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Майстрів не знайдено
            </h2>
            <p className="text-gray-500">
              Спробуй змінити пошук або скинути фільтри.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}