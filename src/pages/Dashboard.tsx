import { useEffect, useState } from 'react'
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Eye,
  FileText,
  Mail,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Trash2,
  XCircle,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useApp } from '../contexts/AppContext'
import { AdBanner } from '../components/AdBanner'
import { navigateTo } from '../lib/navigation'
import { AdCampaign, FeedbackMessage, Profile } from '../lib/types'

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

  // Тут зберігаємо рекламні кампанії для модерації прямо в кабінеті owner.
  const [adCampaigns, setAdCampaigns] = useState<AdCampaign[]>([])

  // Тут зберігаємо повідомлення із форми зворотного зв'язку.
  const [feedbackInbox, setFeedbackInbox] = useState<FeedbackMessage[]>([])

  // Через ці стани показуємо глобальні й локальні дії користувачу.
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [campaignActionId, setCampaignActionId] = useState<string | null>(null)
  const [feedbackActionId, setFeedbackActionId] = useState<string | null>(null)

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

      // Завантажуємо основні цифри, останні оголошення, рекламні кампанії
      // і повідомлення зі зворотного зв'язку в один прохід.
      const [
        siteStatsResult,
        listingsCountResult,
        activeListingsCountResult,
        adsCountResult,
        pendingAdsCountResult,
        feedbackCountResult,
        messagesCountResult,
        recentListingsResult,
        adCampaignsResult,
        feedbackInboxResult,
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

        supabase
          .from('ad_campaigns')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10),

        supabase
          .from('feedback_messages')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(12),
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
      setAdCampaigns((adCampaignsResult.data as AdCampaign[] | null) || [])
      setFeedbackInbox((feedbackInboxResult.data as FeedbackMessage[] | null) || [])
    } catch (loadError) {
      console.error('Помилка завантаження owner-кабінету:', loadError)
      setError('Не вдалося завантажити особистий кабінет власника сайту.')
    } finally {
      setLoading(false)
    }
  }

  const handleApproveCampaign = async (campaignId: string) => {
    if (!profile) {
      return
    }

    setCampaignActionId(campaignId)
    setNotice('')
    setError('')

    try {
      // Під час підтвердження переводимо рекламу в active
      // і фіксуємо, хто саме її схвалив.
      const { error: updateError } = await supabase
        .from('ad_campaigns')
        .update({
          status: 'active',
          approved_by: profile.id,
          approved_at: new Date().toISOString(),
          review_note: null,
        })
        .eq('id', campaignId)

      if (updateError) {
        throw updateError
      }

      setNotice('Рекламну кампанію підтверджено.')
      await loadOwnerDashboard()
    } catch (actionError) {
      console.error('Помилка підтвердження кампанії:', actionError)
      setError('Не вдалося підтвердити рекламну кампанію.')
    } finally {
      setCampaignActionId(null)
    }
  }

  const handleRejectCampaign = async (campaignId: string) => {
    setCampaignActionId(campaignId)
    setNotice('')
    setError('')

    try {
      // Відхилену рекламу залишаємо в базі зі статусом rejected,
      // щоб рекламодавець бачив результат модерації.
      const { error: updateError } = await supabase
        .from('ad_campaigns')
        .update({
          status: 'rejected',
          review_note: 'Відхилено власником сайту під час модерації.',
        })
        .eq('id', campaignId)

      if (updateError) {
        throw updateError
      }

      setNotice('Рекламну кампанію відхилено.')
      await loadOwnerDashboard()
    } catch (actionError) {
      console.error('Помилка відхилення кампанії:', actionError)
      setError('Не вдалося відхилити рекламну кампанію.')
    } finally {
      setCampaignActionId(null)
    }
  }

  const handleDeleteCampaign = async (campaignId: string) => {
    const confirmed = window.confirm(
      'Ви впевнені, що хочете видалити цю рекламну кампанію?'
    )

    if (!confirmed) {
      return
    }

    setCampaignActionId(campaignId)
    setNotice('')
    setError('')

    try {
      // Видаляємо кампанію повністю, якщо вона більше не потрібна.
      const { error: deleteError } = await supabase
        .from('ad_campaigns')
        .delete()
        .eq('id', campaignId)

      if (deleteError) {
        throw deleteError
      }

      setNotice('Рекламну кампанію видалено.')
      await loadOwnerDashboard()
    } catch (actionError) {
      console.error('Помилка видалення кампанії:', actionError)
      setError('Не вдалося видалити рекламну кампанію.')
    } finally {
      setCampaignActionId(null)
    }
  }

  const handleMarkFeedbackRead = async (messageId: string) => {
    setFeedbackActionId(messageId)
    setNotice('')
    setError('')

    try {
      // Позначаємо повідомлення як прочитане, не змінюючи його основний статус.
      const { error: updateError } = await supabase
        .from('feedback_messages')
        .update({
          is_read: true,
        })
        .eq('id', messageId)

      if (updateError) {
        throw updateError
      }

      setNotice('Повідомлення позначено як прочитане.')
      await loadOwnerDashboard()
    } catch (actionError) {
      console.error('Помилка оновлення повідомлення:', actionError)
      setError('Не вдалося позначити повідомлення як прочитане.')
    } finally {
      setFeedbackActionId(null)
    }
  }

  const handleResolveFeedback = async (messageId: string) => {
    setFeedbackActionId(messageId)
    setNotice('')
    setError('')

    try {
      // Коли питання вже закрите, переводимо повідомлення в resolved.
      const { error: updateError } = await supabase
        .from('feedback_messages')
        .update({
          is_read: true,
          status: 'resolved',
        })
        .eq('id', messageId)

      if (updateError) {
        throw updateError
      }

      setNotice('Повідомлення позначено як вирішене.')
      await loadOwnerDashboard()
    } catch (actionError) {
      console.error('Помилка завершення повідомлення:', actionError)
      setError('Не вдалося позначити повідомлення як вирішене.')
    } finally {
      setFeedbackActionId(null)
    }
  }

  const handleDeleteFeedback = async (messageId: string) => {
    const confirmed = window.confirm(
      'Ви впевнені, що хочете видалити це повідомлення?'
    )

    if (!confirmed) {
      return
    }

    setFeedbackActionId(messageId)
    setNotice('')
    setError('')

    try {
      // Видаляємо повідомлення, якщо воно вже не потрібне в inbox.
      const { error: deleteError } = await supabase
        .from('feedback_messages')
        .delete()
        .eq('id', messageId)

      if (deleteError) {
        throw deleteError
      }

      setNotice('Повідомлення видалено.')
      await loadOwnerDashboard()
    } catch (actionError) {
      console.error('Помилка видалення повідомлення:', actionError)
      setError('Не вдалося видалити повідомлення.')
    } finally {
      setFeedbackActionId(null)
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

              {notice && (
                <div className="mb-6 rounded-[22px] border border-[rgba(120,181,140,0.35)] bg-[rgba(236,250,240,0.92)] px-4 py-3 text-sm text-[#3d7a52]">
                  {notice}
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

              <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                {/* Лівий блок показує останні оголошення для швидкого контролю контенту. */}
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
                </section>
              </div>

              {/* Окремий блок модерації реклами дозволяє owner швидко підтверджувати,
                  відхиляти або видаляти кампанії без переходу в інші сторінки. */}
              <section className="glass-card mt-6 p-5 md:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-extrabold text-[#2f2a24]">
                      Керування рекламою
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-[#6f665d]">
                      Тут ви можете підтверджувати, відхиляти або видаляти рекламні кампанії.
                    </p>
                  </div>

                  <div className="rounded-full bg-[rgba(148,163,184,0.14)] px-4 py-2 text-sm font-semibold text-[#475569]">
                    На модерації: {stats.pendingAds}
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  {adCampaigns.length > 0 ? (
                    adCampaigns.map((campaign) => {
                      const isBusy = campaignActionId === campaign.id

                      return (
                        <div
                          key={campaign.id}
                          className="rounded-[24px] border border-[rgba(148,163,184,0.16)] bg-[rgba(255,255,255,0.30)] p-4"
                        >
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <h3 className="truncate text-lg font-extrabold text-[#2f2a24]">
                                  {campaign.title}
                                </h3>
                                <StatusBadge status={campaign.status} />
                              </div>

                              {campaign.description && (
                                <p className="mt-3 text-sm leading-6 text-[#6f665d]">
                                  {campaign.description}
                                </p>
                              )}

                              <div className="mt-4 grid gap-2 text-sm text-[#6f665d] md:grid-cols-2">
                                <div>
                                  <span className="font-semibold text-[#2f2a24]">Розміщення:</span>{' '}
                                  {getPlacementLabel(campaign.placement)}
                                </div>
                                <div>
                                  <span className="font-semibold text-[#2f2a24]">Географія:</span>{' '}
                                  {getGeoTargetLabel(campaign)}
                                </div>
                                <div>
                                  <span className="font-semibold text-[#2f2a24]">Період:</span>{' '}
                                  {getCampaignPeriodLabel(campaign)}
                                </div>
                                <div>
                                  <span className="font-semibold text-[#2f2a24]">Створено:</span>{' '}
                                  {campaign.created_at
                                    ? new Date(campaign.created_at).toLocaleString()
                                    : '—'}
                                </div>
                              </div>

                              <div className="mt-3 break-all text-xs text-[#7a7168]">
                                {campaign.link_url}
                              </div>
                            </div>

                            {/* Кнопки дій owner по конкретній рекламній кампанії. */}
                            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                              <button
                                onClick={() => handleApproveCampaign(campaign.id)}
                                type="button"
                                disabled={isBusy || campaign.status === 'active'}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-[rgba(34,197,94,0.14)] px-4 py-2 text-sm font-semibold text-[#15803d] transition hover:bg-[rgba(34,197,94,0.22)] disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                Підтвердити
                              </button>

                              <button
                                onClick={() => handleRejectCampaign(campaign.id)}
                                type="button"
                                disabled={isBusy || campaign.status === 'rejected'}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-[rgba(239,68,68,0.12)] px-4 py-2 text-sm font-semibold text-[#b91c1c] transition hover:bg-[rgba(239,68,68,0.18)] disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <XCircle className="h-4 w-4" />
                                Відхилити
                              </button>

                              <button
                                onClick={() => handleDeleteCampaign(campaign.id)}
                                type="button"
                                disabled={isBusy}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-[rgba(100,116,139,0.14)] px-4 py-2 text-sm font-semibold text-[#475569] transition hover:bg-[rgba(100,116,139,0.22)] disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <Trash2 className="h-4 w-4" />
                                Видалити
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-sm text-[#7a7168]">
                      Поки що немає рекламних кампаній для модерації.
                    </p>
                  )}
                </div>
              </section>

              {/* Тут показуємо всі повідомлення із форми зворотного зв'язку,
                  щоб owner міг читати і обробляти їх прямо в кабінеті. */}
              <section className="glass-card mt-6 p-5 md:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-extrabold text-[#2f2a24]">
                      Зворотний зв'язок
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-[#6f665d]">
                      Тут відображаються всі повідомлення, які користувачі надсилають через форму зворотного зв'язку.
                    </p>
                  </div>

                  <div className="rounded-full bg-[rgba(148,163,184,0.14)] px-4 py-2 text-sm font-semibold text-[#475569]">
                    Усього: {stats.feedbackMessages}
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  {feedbackInbox.length > 0 ? (
                    feedbackInbox.map((message) => {
                      const isBusy = feedbackActionId === message.id

                      return (
                        <div
                          key={message.id}
                          className="rounded-[24px] border border-[rgba(148,163,184,0.16)] bg-[rgba(255,255,255,0.30)] p-4"
                        >
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div className="min-w-0">
                                  <h3 className="truncate text-lg font-extrabold text-[#2f2a24]">
                                    {message.subject}
                                  </h3>
                                  <p className="mt-1 text-sm text-[#6f665d]">
                                    {message.name} • {message.email}
                                  </p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                  {!message.is_read && (
                                    <span className="inline-flex rounded-full bg-[rgba(245,158,11,0.14)] px-3 py-1 text-xs font-semibold text-[#b45309]">
                                      Непрочитане
                                    </span>
                                  )}
                                  <FeedbackStatusBadge status={message.status} />
                                </div>
                              </div>

                              {message.phone && (
                                <p className="mt-3 text-sm text-[#6f665d]">
                                  Телефон: {message.phone}
                                </p>
                              )}

                              <div className="mt-4 rounded-[18px] bg-[rgba(255,255,255,0.34)] p-4 text-sm leading-6 text-[#2f2a24]">
                                {message.message}
                              </div>

                              <div className="mt-3 text-xs text-[#7a7168]">
                                Отримано: {message.created_at ? new Date(message.created_at).toLocaleString() : '—'}
                              </div>
                            </div>

                            {/* Кнопки дозволяють owner швидко керувати вхідними зверненнями. */}
                            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                              <button
                                onClick={() => handleMarkFeedbackRead(message.id)}
                                type="button"
                                disabled={isBusy || message.is_read}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-[rgba(59,130,246,0.12)] px-4 py-2 text-sm font-semibold text-[#2563eb] transition hover:bg-[rgba(59,130,246,0.18)] disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <Eye className="h-4 w-4" />
                                Прочитано
                              </button>

                              <button
                                onClick={() => handleResolveFeedback(message.id)}
                                type="button"
                                disabled={isBusy || message.status === 'resolved'}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-[rgba(34,197,94,0.14)] px-4 py-2 text-sm font-semibold text-[#15803d] transition hover:bg-[rgba(34,197,94,0.22)] disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                Вирішено
                              </button>

                              <button
                                onClick={() => handleDeleteFeedback(message.id)}
                                type="button"
                                disabled={isBusy}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-[rgba(239,68,68,0.12)] px-4 py-2 text-sm font-semibold text-[#b91c1c] transition hover:bg-[rgba(239,68,68,0.18)] disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <Trash2 className="h-4 w-4" />
                                Видалити
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="rounded-[22px] border border-[rgba(148,163,184,0.16)] bg-[rgba(255,255,255,0.24)] p-5 text-sm text-[#7a7168]">
                      Поки що немає повідомлень із форми зворотного зв'язку.
                    </div>
                  )}
                </div>
              </section>
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

function StatusBadge({ status }: { status: AdCampaign['status'] }) {
  const styles: Record<AdCampaign['status'], string> = {
    draft: 'bg-[rgba(148,163,184,0.14)] text-[#475569]',
    pending_review: 'bg-[rgba(245,158,11,0.14)] text-[#b45309]',
    active: 'bg-[rgba(34,197,94,0.14)] text-[#15803d]',
    paused: 'bg-[rgba(100,116,139,0.14)] text-[#475569]',
    rejected: 'bg-[rgba(239,68,68,0.14)] text-[#b91c1c]',
    expired: 'bg-[rgba(148,163,184,0.14)] text-[#64748b]',
    deleted: 'bg-[rgba(148,163,184,0.14)] text-[#64748b]',
  }

  const labels: Record<AdCampaign['status'], string> = {
    draft: 'Чернетка',
    pending_review: 'На модерації',
    active: 'Активна',
    paused: 'Призупинена',
    rejected: 'Відхилена',
    expired: 'Завершена',
    deleted: 'Видалена',
  }

  return (
    // Бейдж статусу допомагає owner швидко читати стан реклами.
    <span className={`inline-flex self-start rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}

function FeedbackStatusBadge({ status }: { status: FeedbackMessage['status'] }) {
  const styles: Record<FeedbackMessage['status'], string> = {
    new: 'bg-[rgba(245,158,11,0.14)] text-[#b45309]',
    in_progress: 'bg-[rgba(59,130,246,0.12)] text-[#2563eb]',
    resolved: 'bg-[rgba(34,197,94,0.14)] text-[#15803d]',
    archived: 'bg-[rgba(148,163,184,0.14)] text-[#475569]',
  }

  const labels: Record<FeedbackMessage['status'], string> = {
    new: 'Нове',
    in_progress: 'В роботі',
    resolved: 'Вирішено',
    archived: 'Архів',
  }

  return (
    // Бейдж статусу зворотного зв'язку допомагає швидко сортувати звернення візуально.
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}

function getPlacementLabel(placement: AdCampaign['placement']) {
  const labels: Record<AdCampaign['placement'], string> = {
    home: 'Головна сторінка',
    listings: 'Сторінка оголошень',
    sidebar: 'Боковий блок',
    footer: 'Нижній блок',
    mobile_sticky: 'Мобільний sticky-блок',
  }

  return labels[placement]
}

function getGeoTargetLabel(campaign: AdCampaign) {
  // Перетворюємо структуру гео-полів у короткий і зрозумілий підпис.
  if (campaign.geo_scope === 'global') {
    return 'Весь світ'
  }

  if (campaign.geo_scope === 'country') {
    return campaign.country_name || 'Одна країна'
  }

  if (campaign.geo_scope === 'region') {
    return `${campaign.region_name || 'Регіон'} / ${campaign.country_name || 'Країна'}`
  }

  return `${campaign.city_name || 'Місто'} / ${campaign.country_name || 'Країна'}`
}

function getCampaignPeriodLabel(campaign: AdCampaign) {
  // Акуратно формуємо людський підпис періоду кампанії.
  if (!campaign.starts_at && !campaign.ends_at) {
    return 'Без обмеження'
  }

  if (campaign.starts_at && !campaign.ends_at) {
    return `з ${new Date(campaign.starts_at).toLocaleString()}`
  }

  if (!campaign.starts_at && campaign.ends_at) {
    return `до ${new Date(campaign.ends_at).toLocaleString()}`
  }

  return `${new Date(campaign.starts_at as string).toLocaleString()} - ${new Date(campaign.ends_at as string).toLocaleString()}`
}
