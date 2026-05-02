import { useEffect, useMemo, useState } from 'react'
import {
  Building2,
  CalendarRange,
  CheckCircle2,
  Globe2,
  ImagePlus,
  Layers3,
  Link2,
  LogIn,
  MapPin,
  Megaphone,
  MonitorSmartphone,
  Newspaper,
  PanelsTopLeft,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { navigateTo } from '../lib/navigation'
import { useApp } from '../contexts/AppContext'
import { AdCampaign } from '../lib/types'

type PlacementValue = 'home' | 'listings' | 'sidebar' | 'footer' | 'mobile_sticky'
type GeoScopeValue = 'city' | 'region' | 'country' | 'global'

type FeedbackState = {
  type: 'success' | 'error'
  text: string
}

const placementOptions: Array<{
  value: PlacementValue
  title: string
  text: string
  icon: typeof PanelsTopLeft
}> = [
  {
    value: 'home',
    title: 'Головна сторінка',
    text: 'Максимальна видимість для нових відвідувачів платформи.',
    icon: PanelsTopLeft,
  },
  {
    value: 'listings',
    title: 'Сторінка оголошень',
    text: 'Показ для аудиторії, яка вже шукає товари або послуги.',
    icon: Newspaper,
  },
  {
    value: 'sidebar',
    title: 'Бокові банери',
    text: 'Постійна присутність на внутрішніх сторінках сайту.',
    icon: MonitorSmartphone,
  },
  {
    value: 'footer',
    title: 'Нижній блок сайту',
    text: 'Додатковий охоплюючий формат для довгих сесій перегляду.',
    icon: Layers3,
  },
  {
    value: 'mobile_sticky',
    title: 'Мобільний sticky-блок',
    text: 'Добре помітний формат для користувачів зі смартфонів.',
    icon: MonitorSmartphone,
  },
]

const geoScopeOptions: Array<{
  value: GeoScopeValue
  title: string
  text: string
}> = [
  {
    value: 'city',
    title: 'Лише місто',
    text: 'Реклама привʼязується до одного конкретного міста.',
  },
  {
    value: 'region',
    title: 'Область / регіон',
    text: 'Показ у межах конкретної області або регіону.',
  },
  {
    value: 'country',
    title: 'Одна країна',
    text: 'Реклама буде показуватись лише в обраній країні.',
  },
  {
    value: 'global',
    title: 'Весь світ',
    text: 'Глобальне охоплення без обмеження по географії.',
  },
]

export function Advertising() {
  const { user } = useApp()

  // Основні поля форми створення рекламної кампанії.
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [placement, setPlacement] = useState<PlacementValue>('sidebar')
  const [geoScope, setGeoScope] = useState<GeoScopeValue>('country')
  const [countryName, setCountryName] = useState('')
  const [regionName, setRegionName] = useState('')
  const [cityName, setCityName] = useState('')
  const [startsAt, setStartsAt] = useState('')
  const [endsAt, setEndsAt] = useState('')

  // Сюди завантажуємо кампанії поточного рекламодавця.
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([])

  // Стани завантаження і повідомлень для зручного UX.
  const [loadingCampaigns, setLoadingCampaigns] = useState(false)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<FeedbackState | null>(null)

  useEffect(() => {
    // Якщо користувач увійшов, одразу показуємо йому його рекламу.
    if (user) {
      void loadOwnCampaigns()
    }
  }, [user])

  const loadOwnCampaigns = async () => {
    if (!user) {
      return
    }

    setLoadingCampaigns(true)

    try {
      // Витягуємо тільки рекламні кампанії поточного користувача.
      const { data, error } = await supabase
        .from('ad_campaigns')
        .select('*')
        .eq('advertiser_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setCampaigns((data as AdCampaign[] | null) || [])
    } catch (error) {
      console.error('Помилка завантаження рекламних кампаній:', error)
    } finally {
      setLoadingCampaigns(false)
    }
  }

  const resetForm = () => {
    // Після успішного створення очищаємо форму,
    // щоб рекламодавець міг одразу додати наступну кампанію.
    setTitle('')
    setDescription('')
    setImageUrl('')
    setLinkUrl('')
    setPlacement('sidebar')
    setGeoScope('country')
    setCountryName('')
    setRegionName('')
    setCityName('')
    setStartsAt('')
    setEndsAt('')
  }

  const validateGeoScope = () => {
    // Тут перевіряємо, чи користувач заповнив обовʼязкові гео-поля
    // відповідно до вибраного рівня показу реклами.
    if (geoScope === 'country' && !countryName.trim()) {
      return 'Для реклами по країні потрібно вказати країну.'
    }

    if (geoScope === 'region' && (!countryName.trim() || !regionName.trim())) {
      return 'Для реклами по області потрібно вказати країну та область.'
    }

    if (geoScope === 'city' && (!countryName.trim() || !cityName.trim())) {
      return 'Для реклами по місту потрібно вказати країну та місто.'
    }

    return ''
  }

  const handleCreateCampaign = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!user) {
      setFeedback({
        type: 'error',
        text: 'Щоб додати рекламу, спочатку увійдіть у свій акаунт.',
      })
      return
    }

    const geoError = validateGeoScope()

    if (geoError) {
      setFeedback({
        type: 'error',
        text: geoError,
      })
      return
    }

    if (startsAt && endsAt && new Date(endsAt) < new Date(startsAt)) {
      setFeedback({
        type: 'error',
        text: 'Дата завершення не може бути раніше за дату старту.',
      })
      return
    }

    setSaving(true)
    setFeedback(null)

    try {
      // Створюємо кампанію у статусі pending_review,
      // щоб ти як власник сайту міг її перевірити перед публікацією.
      const { error } = await supabase.from('ad_campaigns').insert({
        advertiser_id: user.id,
        title: title.trim(),
        description: description.trim() || null,
        image_url: imageUrl.trim(),
        link_url: linkUrl.trim(),
        placement,
        geo_scope: geoScope,
        country_name: countryName.trim() || null,
        region_name: regionName.trim() || null,
        city_name: cityName.trim() || null,
        country_code: null,
        starts_at: startsAt ? new Date(startsAt).toISOString() : null,
        ends_at: endsAt ? new Date(endsAt).toISOString() : null,
        status: 'pending_review',
      })

      if (error) {
        throw error
      }

      setFeedback({
        type: 'success',
        text: 'Рекламну кампанію створено. Вона чекає на модерацію.',
      })

      resetForm()
      await loadOwnCampaigns()
    } catch (error) {
      console.error('Помилка створення рекламної кампанії:', error)
      setFeedback({
        type: 'error',
        text: 'Не вдалося створити рекламну кампанію. Перевірте поля та спробуйте ще раз.',
      })
    } finally {
      setSaving(false)
    }
  }

  const placementPreview = useMemo(() => {
    return placementOptions.find((item) => item.value === placement)
  }, [placement])

  return (
    <div className="page-bg min-h-screen px-4 py-8 md:px-6 xl:px-8 2xl:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Верхній інформаційний блок сторінки реклами */}
        <section className="glass-panel p-6 md:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/42 bg-[rgba(248,250,252,0.70)] px-4 py-2 text-sm font-semibold text-[#64748b]">
            <Megaphone className="h-4 w-4" />
            <span>Самостійне розміщення реклами</span>
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl font-extrabold tracking-tight text-[#2f2a24] md:text-5xl">
            Додайте рекламу самостійно та виберіть точний географічний показ
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-[#6f665d] md:text-lg">
            Рекламодавець може сам створити кампанію, вибрати місце показу і
            визначити охоплення: місто, область, країна або весь світ.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {!user ? (
              <button
                onClick={() => navigateTo('/login')}
                type="button"
                className="btn-primary rounded-full"
              >
                <LogIn className="h-4 w-4" />
                Увійти для додавання реклами
              </button>
            ) : (
              <button
                onClick={() => {
                  const formElement = document.getElementById('advertising-form')
                  formElement?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                type="button"
                className="btn-primary rounded-full"
              >
                Створити рекламну кампанію
              </button>
            )}

            <button
              onClick={() => navigateTo('/')}
              type="button"
              className="btn-secondary rounded-full"
            >
              Повернутися на головну
            </button>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            {/* Блок з доступними місцями показу реклами */}
            <div className="glass-card p-6">
              <h2 className="text-2xl font-extrabold text-[#2f2a24]">
                Де може показуватися реклама
              </h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {placementOptions.map((item) => (
                  <div
                    key={item.value}
                    className={`rounded-[24px] border p-5 transition ${
                      placement === item.value
                        ? 'border-[rgba(148,163,184,0.28)] bg-[rgba(255,255,255,0.46)]'
                        : 'border-white/38 bg-[rgba(255,255,255,0.28)]'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-[rgba(148,163,184,0.14)] text-[#64748b]">
                        <item.icon className="h-6 w-6" />
                      </div>

                      <div>
                        <h3 className="text-lg font-extrabold text-[#2f2a24]">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-[#6f665d]">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Основна форма самостійного створення рекламної кампанії */}
            <div id="advertising-form" className="glass-card p-6">
              <h2 className="text-2xl font-extrabold text-[#2f2a24]">
                Нова рекламна кампанія
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#6f665d]">
                Після створення реклама потрапляє на модерацію і не публікується автоматично.
              </p>

              {!user ? (
                <div className="mt-5 rounded-[24px] border border-[rgba(148,163,184,0.18)] bg-[rgba(255,255,255,0.30)] p-5">
                  <p className="text-sm leading-6 text-[#6f665d]">
                    Щоб додати рекламу самостійно, потрібно увійти в акаунт рекламодавця.
                  </p>

                  <button
                    onClick={() => navigateTo('/login')}
                    type="button"
                    className="btn-primary mt-5 rounded-full"
                  >
                    Увійти в акаунт
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCreateCampaign} className="mt-5 space-y-5">
                  {feedback && (
                    <div
                      className={`rounded-[20px] px-4 py-3 text-sm ${
                        feedback.type === 'error'
                          ? 'border border-[rgba(221,138,120,0.35)] bg-[rgba(255,237,232,0.92)] text-[#a44a3a]'
                          : 'border border-[rgba(120,181,140,0.35)] bg-[rgba(236,250,240,0.92)] text-[#3d7a52]'
                      }`}
                    >
                      {feedback.text}
                    </div>
                  )}

                  {/* Поля основної інформації про рекламну кампанію */}
                  <div className="grid gap-5">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#5f5a54]">
                        Назва кампанії
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        className="input-glass"
                        placeholder="Наприклад: Реклама сервісу ремонту у Варшаві"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#5f5a54]">
                        Короткий опис
                      </label>
                      <textarea
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        rows={4}
                        className="input-glass min-h-[130px] resize-y"
                        placeholder="Коротко опишіть, що саме просуває реклама."
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#5f5a54]">
                          <ImagePlus className="h-4 w-4" />
                          <span>URL зображення банера</span>
                        </label>
                        <input
                          type="url"
                          required
                          value={imageUrl}
                          onChange={(event) => setImageUrl(event.target.value)}
                          className="input-glass"
                          placeholder="https://example.com/banner.jpg"
                        />
                      </div>

                      <div>
                        <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#5f5a54]">
                          <Link2 className="h-4 w-4" />
                          <span>Посилання при кліку</span>
                        </label>
                        <input
                          type="url"
                          required
                          value={linkUrl}
                          onChange={(event) => setLinkUrl(event.target.value)}
                          className="input-glass"
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Блок вибору місця показу реклами */}
                  <div className="border-t border-[rgba(148,163,184,0.18)] pt-5">
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#5f5a54]">
                      <Layers3 className="h-4 w-4" />
                      <span>Місце показу реклами</span>
                    </label>

                    <select
                      value={placement}
                      onChange={(event) => setPlacement(event.target.value as PlacementValue)}
                      className="select-glass bg-white/80"
                    >
                      {placementOptions.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.title}
                        </option>
                      ))}
                    </select>

                    {placementPreview && (
                      <p className="mt-2 text-sm text-[#6f665d]">
                        {placementPreview.text}
                      </p>
                    )}
                  </div>

                  {/* Блок вибору географії показу реклами */}
                  <div className="border-t border-[rgba(148,163,184,0.18)] pt-5">
                    <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#5f5a54]">
                      <Globe2 className="h-4 w-4" />
                      <span>Діапазон показу реклами</span>
                    </label>

                    <div className="grid gap-3 md:grid-cols-2">
                      {geoScopeOptions.map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => setGeoScope(item.value)}
                          className={`rounded-[22px] border p-4 text-left transition ${
                            geoScope === item.value
                              ? 'border-[rgba(148,163,184,0.28)] bg-[rgba(255,255,255,0.46)]'
                              : 'border-white/38 bg-[rgba(255,255,255,0.28)]'
                          }`}
                        >
                          <div className="font-bold text-[#2f2a24]">{item.title}</div>
                          <div className="mt-2 text-sm leading-6 text-[#6f665d]">
                            {item.text}
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      {/* Країна потрібна для country, region і city режимів */}
                      {geoScope !== 'global' && (
                        <div>
                          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#5f5a54]">
                            <Building2 className="h-4 w-4" />
                            <span>Країна</span>
                          </label>
                          <input
                            type="text"
                            value={countryName}
                            onChange={(event) => setCountryName(event.target.value)}
                            className="input-glass"
                            placeholder="Наприклад: Poland"
                          />
                        </div>
                      )}

                      {/* Область показуємо лише якщо вибрано регіональний режим */}
                      {geoScope === 'region' && (
                        <div>
                          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#5f5a54]">
                            <MapPin className="h-4 w-4" />
                            <span>Область / регіон</span>
                          </label>
                          <input
                            type="text"
                            value={regionName}
                            onChange={(event) => setRegionName(event.target.value)}
                            className="input-glass"
                            placeholder="Наприклад: Mazowieckie"
                          />
                        </div>
                      )}

                      {/* Місто показуємо лише якщо вибрано міський режим */}
                      {geoScope === 'city' && (
                        <div>
                          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#5f5a54]">
                            <MapPin className="h-4 w-4" />
                            <span>Місто</span>
                          </label>
                          <input
                            type="text"
                            value={cityName}
                            onChange={(event) => setCityName(event.target.value)}
                            className="input-glass"
                            placeholder="Наприклад: Warsaw"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Дати кампанії залишаємо простими, без оплати і тарифів на цьому етапі */}
                  <div className="border-t border-[rgba(148,163,184,0.18)] pt-5">
                    <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#5f5a54]">
                      <CalendarRange className="h-4 w-4" />
                      <span>Період кампанії</span>
                    </label>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#6f665d]">
                          Дата старту
                        </label>
                        <input
                          type="datetime-local"
                          value={startsAt}
                          onChange={(event) => setStartsAt(event.target.value)}
                          className="input-glass"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#6f665d]">
                          Дата завершення
                        </label>
                        <input
                          type="datetime-local"
                          value={endsAt}
                          onChange={(event) => setEndsAt(event.target.value)}
                          className="input-glass"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="btn-primary rounded-full disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving ? 'Створюємо...' : 'Створити рекламну кампанію'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Правий інфо-блок пояснює, як працює модерація реклами */}
            <div className="glass-card p-6">
              <h2 className="text-2xl font-extrabold text-[#2f2a24]">
                Як це працює зараз
              </h2>

              <div className="mt-5 space-y-3 text-sm text-[#6f665d]">
                <InfoRow text="Рекламодавець сам створює кампанію у своєму акаунті." />
                <InfoRow text="Кампанія одразу зберігається в базі даних." />
                <InfoRow text="Публікація поки що не автоматична — спочатку модерація." />
                <InfoRow text="Оплату і тарифи можна підключити наступним етапом." />
              </div>
            </div>

            {/* Блок зі списком власних рекламних кампаній рекламодавця */}
            <div className="glass-card p-6">
              <h2 className="text-2xl font-extrabold text-[#2f2a24]">
                Мої рекламні кампанії
              </h2>

              {!user ? (
                <p className="mt-4 text-sm leading-6 text-[#6f665d]">
                  Увійдіть у свій акаунт, щоб бачити власні рекламні кампанії.
                </p>
              ) : loadingCampaigns ? (
                <p className="mt-4 text-sm leading-6 text-[#6f665d]">
                  Завантажуємо кампанії...
                </p>
              ) : campaigns.length > 0 ? (
                <div className="mt-5 space-y-3">
                  {campaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="rounded-[22px] border border-[rgba(148,163,184,0.16)] bg-[rgba(255,255,255,0.30)] p-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <h3 className="truncate text-base font-bold text-[#2f2a24]">
                            {campaign.title}
                          </h3>
                          <p className="mt-1 text-sm text-[#6f665d]">
                            {getPlacementLabel(campaign.placement)}
                          </p>
                        </div>

                        <StatusBadge status={campaign.status} />
                      </div>

                      <div className="mt-3 space-y-2 text-sm text-[#6f665d]">
                        <p>
                          Географія: {getGeoTargetLabel(campaign)}
                        </p>
                        <p>
                          Створено: {campaign.created_at ? new Date(campaign.created_at).toLocaleString() : '—'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm leading-6 text-[#6f665d]">
                  Ви ще не створили жодної рекламної кампанії.
                </p>
              )}
            </div>

            {/* Нагадування про наступний етап розвитку рекламного кабінету */}
            <div className="glass-card p-6">
              <h2 className="text-2xl font-extrabold text-[#2f2a24]">
                Що додамо далі
              </h2>

              <div className="mt-5 space-y-3 text-sm text-[#6f665d]">
                <InfoRow text="Розрахунок ціни за місто, область, країну або глобальний показ." />
                <InfoRow text="Вибір тривалості реклами: тиждень, місяць, квартал, рік." />
                <InfoRow text="Оплату і автоматичний запуск після підтвердження." />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function InfoRow({ text }: { text: string }) {
  return (
    // Універсальний рядок для коротких пояснень і переваг.
    <div className="flex items-start gap-3">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#64748b]" />
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
    // Компактний бейдж статусу рекламної кампанії.
    <span className={`inline-flex self-start rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}

function getPlacementLabel(placement: PlacementValue) {
  const labels: Record<PlacementValue, string> = {
    home: 'Головна сторінка',
    listings: 'Сторінка оголошень',
    sidebar: 'Боковий банер',
    footer: 'Нижній блок',
    mobile_sticky: 'Мобільний sticky-блок',
  }

  return labels[placement]
}

function getGeoTargetLabel(campaign: AdCampaign) {
  // Формуємо людський підпис географії для списку кампаній.
  if (campaign.geo_scope === 'global') {
    return 'Весь світ'
  }

  if (campaign.geo_scope === 'country') {
    return campaign.country_name || 'Країна не вказана'
  }

  if (campaign.geo_scope === 'region') {
    return `${campaign.region_name || 'Регіон'} / ${campaign.country_name || 'Країна'}`
  }

  return `${campaign.city_name || 'Місто'} / ${campaign.country_name || 'Країна'}`
}
