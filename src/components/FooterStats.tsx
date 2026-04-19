import { useEffect, useState } from 'react'
import { Eye, FileText, CheckCircle2, Users, Globe2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { AppSiteStats, CountryRankingItem } from '../lib/types'

interface FooterStatsState {
  total_visits: number
  total_listings_created: number
  total_successful_listings: number
  total_professionals: number
  country_ranking: CountryRankingItem[]
  updated_at: string | null
}

const EMPTY_STATS: FooterStatsState = {
  total_visits: 0,
  total_listings_created: 0,
  total_successful_listings: 0,
  total_professionals: 0,
  country_ranking: [],
  updated_at: null,
}

export function FooterStats() {
  // Тут зберігаємо всю статистику, яку покажемо внизу додатку
  const [stats, setStats] = useState<FooterStatsState>(EMPTY_STATS)

  // Індикатор завантаження
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    setLoading(true)

    try {
      // Спочатку просимо бекенд перерахувати статистику.
      // Це дозволяє показувати свіжі цифри:
      // - нові оголошення
      // - нових майстрів
      // - нові реакції на оголошення
      await supabase.rpc('refresh_app_site_stats')

      // Потім забираємо вже готовий агрегований рядок
      const { data, error } = await supabase
        .from('app_site_stats')
        .select('*')
        .eq('id', 1)
        .maybeSingle<AppSiteStats>()

      if (error) {
        console.error('Помилка завантаження статистики:', error)
        return
      }

      if (!data) {
        setStats(EMPTY_STATS)
        return
      }

      // country_ranking зберігається як JSON.
      // Перетворюємо його в масив для безпечного відображення.
      const ranking = Array.isArray(data.country_ranking)
        ? (data.country_ranking as CountryRankingItem[])
        : []

      setStats({
        total_visits: data.total_visits ?? 0,
        total_listings_created: data.total_listings_created ?? 0,
        total_successful_listings: data.total_successful_listings ?? 0,
        total_professionals: data.total_professionals ?? 0,
        country_ranking: ranking,
        updated_at: data.updated_at ?? null,
      })
    } catch (err) {
      console.error('Непередбачена помилка статистики:', err)
    } finally {
      setLoading(false)
    }
  }

  // Форматування великого числа для гарного вигляду
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('uk-UA').format(value || 0)
  }

  return (
    <section className="mt-10 border-t border-gray-800 pt-8">
      {/* Заголовок статистики */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">
          Статистика платформи
        </h3>

        <p className="text-sm text-gray-400">
          Тут показуються поточні показники активності DImarket.
        </p>
      </div>

      {/* Верхній блок з основними цифрами */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <Eye className="w-5 h-5 text-sky-400" />
            <span className="text-sm text-gray-300">Відвідали додаток</span>
          </div>

          <div className="text-2xl font-bold text-white">
            {loading ? '—' : formatNumber(stats.total_visits)}
          </div>

          <p className="mt-2 text-xs text-gray-400">
            Загальна кількість зареєстрованих візитів
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="w-5 h-5 text-orange-400" />
            <span className="text-sm text-gray-300">Створено оголошень</span>
          </div>

          <div className="text-2xl font-bold text-white">
            {loading ? '—' : formatNumber(stats.total_listings_created)}
          </div>

          <p className="mt-2 text-xs text-gray-400">
            Усі оголошення за весь час
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-gray-300">Оголошення спрацювали</span>
          </div>

          <div className="text-2xl font-bold text-white">
            {loading ? '—' : formatNumber(stats.total_successful_listings)}
          </div>

          <p className="mt-2 text-xs text-gray-400">
            Є хоча б одна реакція користувачів
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-5 h-5 text-violet-400" />
            <span className="text-sm text-gray-300">Майстрів зареєструвалось</span>
          </div>

          <div className="text-2xl font-bold text-white">
            {loading ? '—' : formatNumber(stats.total_professionals)}
          </div>

          <p className="mt-2 text-xs text-gray-400">
            Профілі з роллю професіонала
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <Globe2 className="w-5 h-5 text-cyan-400" />
            <span className="text-sm text-gray-300">Країн у рейтингу</span>
          </div>

          <div className="text-2xl font-bold text-white">
            {loading ? '—' : formatNumber(stats.country_ranking.length)}
          </div>

          <p className="mt-2 text-xs text-gray-400">
            Країни з найбільшою активністю
          </p>
        </div>
      </div>

      {/* Нижній блок: рейтинг по країнах */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h4 className="text-lg font-semibold text-white">
              Рейтинг по країнах
            </h4>
            <p className="text-sm text-gray-400">
              Формується на основі майстрів, оголошень і реакцій на них
            </p>
          </div>

          {stats.updated_at && !loading && (
            <span className="text-xs text-gray-500">
              Оновлено: {new Date(stats.updated_at).toLocaleString('uk-UA')}
            </span>
          )}
        </div>

        {loading ? (
          <div className="text-gray-400">Завантаження статистики…</div>
        ) : stats.country_ranking.length === 0 ? (
          <div className="text-gray-400">
            Поки що недостатньо даних для рейтингу по країнах.
          </div>
        ) : (
          <div className="space-y-3">
            {stats.country_ranking.map((item, index) => (
              <div
                key={`${item.country}-${index}`}
                className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 p-4 rounded-xl bg-black/20 border border-white/5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold text-white flex-shrink-0">
                    {index + 1}
                  </div>

                  <div className="min-w-0">
                    <div className="text-white font-medium truncate">
                      {item.country}
                    </div>

                    <div className="text-xs text-gray-400">
                      Score: {formatNumber(item.score)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 lg:gap-6 text-sm">
                  <div>
                    <div className="text-gray-400">Майстри</div>
                    <div className="text-white font-semibold">
                      {formatNumber(item.professionals)}
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-400">Оголошення</div>
                    <div className="text-white font-semibold">
                      {formatNumber(item.listings)}
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-400">Реакції</div>
                    <div className="text-white font-semibold">
                      {formatNumber(item.responses)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}