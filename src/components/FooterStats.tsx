import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Eye, FileText, Globe2, Users } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { supabase } from '../lib/supabase'

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

  const locale = useMemo(() => {
    return localeMap[language.code] ?? 'en-US'
  }, [language.code])

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

      if (error || !data) {
        if (error) {
          console.error('Помилка завантаження статистики:', error)
        }

        setStats(EMPTY_STATS)
        return
      }

      setStats({
        total_visits: data.total_visits || 0,
        total_listings_created: data.total_listings_created || 0,
        total_successful_listings: data.total_successful_listings || 0,
        total_professionals: data.total_professionals || 0,
        country_ranking: Array.isArray(data.country_ranking) ? data.country_ranking : [],
        updated_at: data.updated_at || null,
      })
    } catch (error) {
      console.error('Неочікувана помилка статистики:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat(locale).format(value || 0)
  }

  const statCards = [
    {
      icon: Eye,
      label: t('footerStats.visits'),
      value: stats.total_visits,
      color: 'text-sky-600',
    },
    {
      icon: FileText,
      label: t('footerStats.listings'),
      value: stats.total_listings_created,
      color: 'text-[#c96d2c]',
    },
    {
      icon: CheckCircle2,
      label: t('footerStats.successful'),
      value: stats.total_successful_listings,
      color: 'text-emerald-600',
    },
    {
      icon: Users,
      label: t('footerStats.professionals'),
      value: stats.total_professionals,
      color: 'text-teal-700',
    },
    {
      icon: Globe2,
      label: t('footerStats.countries'),
      value: stats.country_ranking.length,
      color: 'text-[#8b6f3d]',
    },
  ]

  return (
    <section className="mt-10 border-t border-[rgba(190,168,150,0.28)] pt-8">
      <div className="mb-6">
        <h3 className="text-xl font-extrabold text-[#2f2a24]">
          {t('footerStats.title')}
        </h3>
        <p className="mt-2 text-sm leading-6 text-[#6f665d]">
          {t('footerStats.subtitle')}
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-[24px] border border-white/70 bg-white/55 p-4 shadow-[0_10px_28px_rgba(89,63,48,0.06)]"
          >
            <div className="mb-3 flex items-center gap-3">
              <card.icon className={`h-5 w-5 ${card.color}`} />
              <span className="text-sm font-medium text-[#6f665d]">{card.label}</span>
            </div>

            <div className="text-2xl font-extrabold text-[#2f2a24]">
              {loading ? '...' : formatNumber(card.value)}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[28px] border border-white/70 bg-white/55 p-5 shadow-[0_10px_28px_rgba(89,63,48,0.06)]">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h4 className="text-lg font-extrabold text-[#2f2a24]">
              {t('footerStats.rankingTitle')}
            </h4>
            <p className="mt-1 text-sm leading-6 text-[#6f665d]">
              {t('footerStats.rankingSubtitle')}
            </p>
          </div>

          {stats.updated_at && !loading && (
            <span className="text-xs text-[#7a7168]">
              {t('footerStats.updatedPrefix')}{' '}
              {new Date(stats.updated_at).toLocaleString(locale)}
            </span>
          )}
        </div>

        {loading ? (
          <div className="text-sm text-[#7a7168]">{t('footerStats.loading')}</div>
        ) : stats.country_ranking.length === 0 ? (
          <div className="text-sm text-[#7a7168]">{t('footerStats.empty')}</div>
        ) : (
          <div className="space-y-3">
            {stats.country_ranking.map((item, index) => (
              <div
                key={`${item.country}-${index}`}
                className="flex flex-col gap-3 rounded-[22px] border border-[rgba(190,168,150,0.22)] bg-[rgba(255,250,246,0.82)] p-4 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(242,171,116,0.16)] text-sm font-bold text-[#9a5525]">
                    {index + 1}
                  </div>

                  <div className="min-w-0">
                    <div className="truncate font-semibold text-[#2f2a24]">
                      {item.country}
                    </div>
                    <div className="text-xs text-[#7a7168]">
                      {t('footerStats.score')}: {formatNumber(item.score)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <RankingMetric
                    label={t('footerStats.prosShort')}
                    value={item.professionals}
                    locale={locale}
                  />
                  <RankingMetric
                    label={t('footerStats.jobsShort')}
                    value={item.listings}
                    locale={locale}
                  />
                  <RankingMetric
                    label={t('footerStats.repliesShort')}
                    value={item.responses}
                    locale={locale}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function RankingMetric({
  label,
  value,
  locale,
}: {
  label: string
  value: number
  locale: string
}) {
  return (
    <div>
      <div className="text-[#7a7168]">{label}</div>
      <div className="font-semibold text-[#2f2a24]">
        {new Intl.NumberFormat(locale).format(value || 0)}
      </div>
    </div>
  )
}
