import { useEffect, useState } from 'react'
import {
  AlertTriangle,
  BarChart3,
  FileText,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useApp } from '../contexts/AppContext'
import { AdBanner } from '../components/AdBanner'
import { navigateTo } from '../lib/navigation'
import { Profile } from '../lib/types'

interface OwnerStats {
  totalVisits: number
  totalListings: number
  activeListings: number
  totalAds: number
  pendingAds: number
  feedbackMessages: number
  internalMessages: number
}

interface RecentListing {
  id: string
  title: string
  location: string
  status: string
  created_at: string
}

const EMPTY_STATS: OwnerStats = {
  totalVisits: 0,
  totalListings: 0,
  activeListings: 0,
  totalAds: 0,
  pendingAds: 0,
  feedbackMessages: 0,
  internalMessages: 0,
}

export function Dashboard() {
  const { user } = useApp()

  // Окремо зберігаємо профіль, щоб перевірити роль власника сайту.
  const [profile, setProfile] = useState<Profile | null>(null)

  // У цей стан складаємо зведені метрики для кабінету власника.
  const [stats, setStats] = useState<OwnerStats>(EMPTY_STATS)

  // Показуємо останні оголошення для швидкого контролю контенту.
  const [recentListings, setRecentListings] = useState<RecentListing[]>([])

  // Завантаження сторінки і текст помилки тримаємо окремо для зрозумілого UX.
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Перевіряємо користувача через контекст і, за потреби, напряму через Supabase,
    // щоб не перекинути owner-профіль на /login під час першого монтування.
    void loadOwnerDashboard()
  }, [user])

  const loadOwnerDashboard = async () => {
    setLoading(true)
    setError('')

    try {
      const activeUser = user ?? (await supabase.auth.getUser()).data.user ?? null

      if (!activeUser) {
        navigateTo('/login')
        return
      }

      // Спочатку завжди перевіряємо профіль, бо саме він вирішує,
      // чи можна відкривати особистий кабінет власника сайту.
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', activeUser.id)
        .maybeSingle()

      if (profileError) {
        throw profileError
      }

      if (!profileData) {
        navigateTo('/login')
        return
      }

      setProfile(profileData)

      // Якщо це не власник сайту, далі owner-дані навіть не запитуємо.
      if (!profileData.is_site_owner) {
        return
      }

      // Завантажуємо основні цифри для owner-кабінету.
      const [
        siteStatsResult,
        listingsCountResult,
        activeListingsCountResult,
        adsCountResult,
        pendingAdsCountResult,
        feedbackCountResult,
        messagesCountResult,
        recentListingsResult,
      ] = await Promise.all([
        supabase
          .from('app_site_stats')
          .select('total_visits')
          .eq('id', 1)
          .maybeSingle(),

        supabase
          .from('listings')
          .select('*', { count: 'exact', head: true }),

        supabase
          .from('listings')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active'),

        supabase
          .from('ad_campaigns')
          .select('*', { count: 'exact', head: true }),

        supabase
          .from('ad_campaigns')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending_review'),

        supabase
          .from('feedback_messages')
          .select('*', { count: 'exact', head: true }),

        supabase
          .from('messages')
          .select('*', { count: 'exact', head: true }),

        supabase
          .from('listings')
          .select('id, title, location, status, created_at')
          .order('created_at', { ascending: false })
          .limit(6),
      ])

      // Формуємо зручний об'єкт статистики для карток на сторінці.
      setStats({
        totalVisits: siteStatsResult.data?.total_visits || 0,
        totalListings: listingsCountResult.count || 0,
        activeListings: activeListingsCountResult.count || 0,
        totalAds: adsCountResult.count || 0,
        pendingAds: pendingAdsCountResult.count || 0,
        feedbackMessages: feedbackCountResult.count || 0,
        internalMessages: messagesCountResult.count || 0,
      })

      setRecentListings((recentListingsResult.data as RecentListing[] | null) || [])
    } catch (loadError) {
      console.error('Помилка завантаження owner-кабінету:', loadError)
      setError('Не вдалося завантажити особистий кабінет власника сайту.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="page-bg min-h-screen py-10">
        <div className="mx-auto max-w-4xl px-4 md:px-6 xl:px-8 2xl:px-10">
          <div className="glass-panel p-10 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[rgba(148,163,184,0.18)] border-t-[#64748b]" />
            <p className="mt-4 text-sm text-[#6f665d]">
              Завантажуємо особистий кабінет...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!profile?.is_site_owner) {
    return (
      <div className="page-bg min-h-screen py-10">
        <div className="mx-auto max-w-3xl px-4 md:px-6 xl:px-8 2xl:px-10">
          <div className="glass-panel p-8 text-center md:p-10">
            {/* Цей блок показуємо всім, хто зайшов на /dashboard без owner-ролі. */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[rgba(239,68,68,0.12)] text-[#b91c1c]">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-[#2f2a24]">
              Доступ заборонено
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#6f665d] md:text-base">
              Особистий кабінет власника сайту відкривається тільки для вашого
              owner-профілю. Для інших користувачів ця сторінка недоступна.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={() => navigateTo('/')}
                type="button"
                className="btn-secondary rounded-full"
              >
                На головну
              </button>

              <button
                onClick={() => navigateTo('/settings')}
                type="button"
                className="btn-primary rounded-full"
              >
                Відкрити мій профіль
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      icon: BarChart3,
      title: 'Трафік сайту',
      value: stats.totalVisits,
      text: 'Загальна кількість відвідувань платформи.',
    },
    {
      icon: FileText,
      title: 'Оголошення',
      value: stats.totalListings,
      text: `Активних зараз: ${stats.activeListings}.`,
    },
    {
      icon: Sparkles,
      title: 'Реклама',
      value: stats.totalAds,
      text: `На модерації зараз: ${stats.pendingAds}.`,
    },
    {
      icon: MessageSquare,
      title: 'Повідомлення',
      value: stats.feedbackMessages + stats.internalMessages,
      text: `Форма зворотного зв'язку: ${stats.feedbackMessages}.`,
    },
  ]

  return (
    <div className="page-bg min-h-screen py-8">
      <div className="w-full px-4 md:px-6 xl:px-8 2xl:px-10">
        <div className="flex gap-6">
          <aside className="hidden xl:block w-[220px] 2xl:w-[260px] flex-shrink-0">
            <AdBanner position="left" sticky={true} />
          </aside>

          <main className="min-w-0 flex-1">
            <section className="glass-panel p-5 md:p-6 xl:p-8">
              {/* Шапка owner-кабінету з коротким поясненням призначення сторінки. */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/42 bg-[rgba(248,250,252,0.70)] px-4 py-2 text-sm font-semibold text-[#64748b]">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Особистий кабінет власника</span>
                </div>

                <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#2f2a24] md:text-4xl">
                  Вітаю, {profile.full_name || 'власнику сайту'}
                </h1>

                <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6f665d] md:text-base">
                  Тут бачите тільки ви: загальні цифри сайту, оголошення, рекламу
                  та вхідні повідомлення.
                </p>
              </div>

              {error && (
                <div className="mb-6 rounded-[22px] border border-[rgba(221,138,120,0.35)] bg-[rgba(255,237,232,0.92)] px-4 py-3 text-sm text-[#a44a3a]">
                  {error}
                </div>
              )}

              {/* Верхній рядок ключових owner-метрик. */}
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {statCards.map((card) => (
                  <div
                    key={card.title}
                    className="glass-card p-5"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[rgba(148,163,184,0.14)] text-[#64748b]">
                      <card.icon className="h-6 w-6" />
                    </div>

                    <div className="mt-4 text-3xl font-extrabold text-[#2f2a24]">
                      {card.value.toLocaleString()}
                    </div>

                    <h2 className="mt-2 text-lg font-extrabold text-[#2f2a24]">
                      {card.title}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[#6f665d]">
                      {card.text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                {/* Лівий блок залишаємо для швидкого контролю останніх оголошень. */}
                <section className="glass-card p-5 md:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-extrabold text-[#2f2a24]">
                        Останні оголошення
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-[#6f665d]">
                        Найновіший контент на платформі для швидкої перевірки.
                      </p>
                    </div>

                    <button
                      onClick={() => navigateTo('/listings')}
                      type="button"
                      className="btn-secondary rounded-full"
                    >
                      Відкрити всі
                    </button>
                  </div>

                  <div className="mt-5 space-y-3">
                    {recentListings.length > 0 ? (
                      recentListings.map((listing) => (
                        <div
                          key={listing.id}
                          className="rounded-[22px] border border-[rgba(148,163,184,0.16)] bg-[rgba(255,255,255,0.30)] p-4"
                        >
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <h3 className="truncate text-base font-bold text-[#2f2a24]">
                                {listing.title}
                              </h3>
                              <p className="mt-1 text-sm text-[#6f665d]">
                                {listing.location}
                              </p>
                            </div>

                            <span className="inline-flex self-start rounded-full bg-[rgba(148,163,184,0.14)] px-3 py-1 text-xs font-semibold text-[#475569]">
                              {listing.status}
                            </span>
                          </div>

                          <p className="mt-3 text-xs text-[#7a7168]">
                            Створено: {new Date(listing.created_at).toLocaleString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-[#7a7168]">
                        Поки що немає оголошень для відображення.
                      </p>
                    )}
                  </div>
                </section>

                {/* Правий блок підказує, що саме вже доступно власнику. */}
                <section className="glass-card p-5 md:p-6">
                  <h2 className="text-xl font-extrabold text-[#2f2a24]">
                    Що вже під контролем
                  </h2>

                  <div className="mt-5 space-y-3 text-sm text-[#6f665d]">
                    <OwnerFeatureRow text="Тільки owner-профіль бачить цей кабінет." />
                    <OwnerFeatureRow text="Ви бачите загальний трафік сайту та кількість оголошень." />
                    <OwnerFeatureRow text="Ви бачите кількість рекламних кампаній і заявок на модерацію." />
                    <OwnerFeatureRow text="Ви бачите повідомлення із зворотного зв'язку та внутрішні повідомлення." />
                  </div>

                  <div className="mt-6 rounded-[22px] border border-[rgba(148,163,184,0.16)] bg-[rgba(255,255,255,0.30)] p-4">
                    <p className="text-sm leading-6 text-[#6f665d]">
                      Наступним кроком тут можна буде додати:
                      видалення оголошень, керування рекламою та окремий inbox
                      для звернень.
                    </p>
                  </div>
                </section>
              </div>
            </section>
          </main>

          <aside className="hidden xl:block w-[220px] 2xl:w-[260px] flex-shrink-0">
            <AdBanner position="right" sticky={true} />
          </aside>
        </div>
      </div>
    </div>
  )
}

function OwnerFeatureRow({ text }: { text: string }) {
  return (
    // Короткий рядок-пояснення для owner-функцій.
    <div className="flex items-start gap-3">
      <div className="mt-1.5 h-2.5 w-2.5 rounded-full bg-[rgba(148,163,184,0.55)]" />
      <span>{text}</span>
    </div>
  )
}
