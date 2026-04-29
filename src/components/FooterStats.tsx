import { useEffect, useMemo, useState } from 'react'
import { Eye, FileText, CheckCircle2, Users, Globe2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useApp } from '../contexts/AppContext'

interface CountryRankingItem {
  country: string
  score: number
  professionals: number
  listings: number
  responses: number
}

interface FooterStatsData {
  total_visits: number
  total_listings_created: number
  total_successful_listings: number
  total_professionals: number
  country_ranking: CountryRankingItem[]
  updated_at: string | null
}

const EMPTY_STATS: FooterStatsData = {
  total_visits: 0,
  total_listings_created: 0,
  total_successful_listings: 0,
  total_professionals: 0,
  country_ranking: [],
  updated_at: null,
}

const localeMap: Record<string, string> = {
  en: 'en-US',
  uk: 'uk-UA',
  kk: 'kk-KZ',
  pl: 'pl-PL',
  es: 'es-ES',
  de: 'de-DE',
  fr: 'fr-FR',
  it: 'it-IT',
  pt: 'pt-PT',
  ro: 'ro-RO',
  cs: 'cs-CZ',
  sk: 'sk-SK',
  hu: 'hu-HU',
  bg: 'bg-BG',
  sr: 'sr-RS',
  hr: 'hr-HR',
  sl: 'sl-SI',
  lt: 'lt-LT',
  lv: 'lv-LV',
  et: 'et-EE',
  tr: 'tr-TR',
  ar: 'ar-SA',
  zh: 'zh-CN',
  ja: 'ja-JP',
}

export function FooterStats() {
  const { t, language } = useApp()
  const [stats, setStats] = useState<FooterStatsData>(EMPTY_STATS)
  const [loading, setLoading] = useState(true)

  const locale = useMemo(
    () => localeMap[language.code] ?? 'en-US',
    [language.code],
  )

  useEffect(() => {
    void loadStats()
  }, [])

  const loadStats = async () => {
    setLoading(true)

    try {
      await supabase.rpc('refresh_app_site_stats')

      const { data, error } = await supabase
        .from('app_site_stats')
        .select('*')
        .eq('id', 1)
        .maybeSingle()

      if (error) {
        console.error('Error loading footer stats:', error)
        return
      }

      if (!data) {
        setStats(EMPTY_STATS)
        return
      }

      setStats({
        total_visits: data.total_visits || 0,
        total_listings_created: data.total_listings_created || 0,
        total_successful_listings: data.total_successful_listings || 0,
        total_professionals: data.total_professionals || 0,
        country_ranking: Array.isArray(data.country_ranking)
          ? data.country_ranking
          : [],
        updated_at: data.updated_at || null,
      })
    } catch (err) {
      console.error('Unexpected footer stats error:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat(locale).format(value || 0)
  }

  return (
    <section className="mt-10 border-t border-gray-800 pt-8">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">
          {t('footerStats.title')}
        </h3>

        <p className="text-sm text-gray-400">{t('footerStats.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <Eye className="w-5 h-5 text-sky-400" />
            <span className="text-sm text-gray-300">
              {t('footerStats.visits')}
            </span>
          </div>

          <div className="text-2xl font-bold text-white">
            {loading ? '—' : formatNumber(stats.total_visits)}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="w-5 h-5 text-orange-400" />
            <span className="text-sm text-gray-300">
              {t('footerStats.listings')}
            </span>
          </div>

          <div className="text-2xl font-bold text-white">
            {loading ? '—' : formatNumber(stats.total_listings_created)}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-gray-300">
              {t('footerStats.successful')}
            </span>
          </div>

          <div className="text-2xl font-bold text-white">
            {loading ? '—' : formatNumber(stats.total_successful_listings)}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-5 h-5 text-violet-400" />
            <span className="text-sm text-gray-300">
              {t('footerStats.professionals')}
            </span>
          </div>

          <div className="text-2xl font-bold text-white">
            {loading ? '—' : formatNumber(stats.total_professionals)}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <Globe2 className="w-5 h-5 text-cyan-400" />
            <span className="text-sm text-gray-300">
              {t('footerStats.countries')}
            </span>
          </div>

          <div className="text-2xl font-bold text-white">
            {loading ? '—' : formatNumber(stats.country_ranking.length)}
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div>
            <h4 className="text-lg font-semibold text-white">
              {t('footerStats.rankingTitle')}
            </h4>

            <p className="text-sm text-gray-400">
              {t('footerStats.rankingSubtitle')}
            </p>
          </div>

          {stats.updated_at && !loading && (
            <span className="text-xs text-gray-500">
              {t('footerStats.updatedPrefix')}{' '}
              {new Date(stats.updated_at).toLocaleString(locale)}
            </span>
          )}
        </div>

        {loading ? (
          <div className="text-gray-400">{t('footerStats.loading')}</div>
        ) : stats.country_ranking.length === 0 ? (
          <div className="text-gray-400">{t('footerStats.empty')}</div>
        ) : (
          <div className="space-y-3">
            {stats.country_ranking.map((item, index) => (
              <div
                key={`${item.country}-${index}`}
                className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 p-4 rounded-xl bg-black/20 border border-white/5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold text-white">
                    {index + 1}
                  </div>

                  <div className="min-w-0">
                    <div className="text-white font-medium truncate">
                      {item.country}
                    </div>

                    <div className="text-xs text-gray-400">
                      {t('footerStats.score')}: {formatNumber(item.score)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">
                      {t('footerStats.prosShort')}
                    </div>
                    <div className="text-white font-semibold">
                      {formatNumber(item.professionals)}
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-400">
                      {t('footerStats.jobsShort')}
                    </div>
                    <div className="text-white font-semibold">
                      {formatNumber(item.listings)}
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-400">
                      {t('footerStats.repliesShort')}
                    </div>
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
