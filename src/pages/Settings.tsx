import { useEffect, useState } from 'react'
import {
  Bell,
  Briefcase,
  DollarSign,
  Globe,
  Image,
  Lock,
  MapPin,
  Phone,
  Save,
  Trash2,
  User,
} from 'lucide-react'
import { AdBanner } from '../components/AdBanner'
import { useApp } from '../contexts/AppContext'
import { navigateTo } from '../lib/navigation'
import { supabase } from '../lib/supabase'
import { CURRENCIES, LANGUAGES } from '../lib/types'

type FeedbackState = {
  type: 'success' | 'error'
  text: string
}

export function Settings() {
  const { user, language, currency, setLanguage, setCurrency, t } = useApp()

  // Окремо зберігаємо id активного користувача,
  // щоб сторінка працювала стабільно навіть якщо контекст ще не встиг оновитися.
  const [currentUserId, setCurrentUserId] = useState<string | null>(user?.id ?? null)

  // Загальні стани сторінки: початкове завантаження, збереження профілю і зміна пароля.
  const [loading, setLoading] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  // Єдиний стан для повідомлень про успіх або помилку.
  const [feedback, setFeedback] = useState<FeedbackState | null>(null)

  // Основні поля профілю майстра.
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [website, setWebsite] = useState('')
  const [profilePhoto, setProfilePhoto] = useState('')
  const [portfolioImages, setPortfolioImages] = useState<string[]>([])

  // Налаштування користувацьких уподобань.
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [preferredLanguage, setPreferredLanguage] = useState(language.code)
  const [preferredCurrency, setPreferredCurrency] = useState(currency.code)

  // Поля для блоку зміни пароля.
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    // При відкритті сторінки перевіряємо користувача та завантажуємо його профіль.
    void bootstrapSettings()
  }, [user])

  const bootstrapSettings = async () => {
    setLoading(true)

    try {
      // Якщо користувач уже є в контексті — беремо його,
      // інакше додатково перевіряємо сесію напряму через Supabase.
      const activeUser =
        user ?? (await supabase.auth.getUser()).data.user ?? null

      // Якщо авторизації немає — переводимо на сторінку входу.
      if (!activeUser) {
        navigateTo('/login')
        return
      }

      setCurrentUserId(activeUser.id)
      await loadProfile(activeUser.id)
    } finally {
      setLoading(false)
    }
  }

  const loadProfile = async (userId: string) => {
    try {
      // Завантажуємо один профіль поточного користувача.
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        throw error
      }

      if (!data) {
        return
      }

      // Наповнюємо форму даними з бази.
      setFullName(data.full_name || '')
      setBio(data.bio || '')
      setPhone(data.phone || '')
      setLocation(data.location || '')
      setWebsite(data.website || '')
      setProfilePhoto(data.profile_photo || '')
      setPortfolioImages(Array.isArray(data.portfolio_images) ? data.portfolio_images : [])
      setNotificationsEnabled(data.notifications_enabled !== false)

      // Якщо в профілі вже є збережені мова і валюта — підставляємо їх у форму.
      setPreferredLanguage(data.preferred_language || language.code)
      setPreferredCurrency(data.preferred_currency || currency.code)
    } catch (error) {
      console.error('Помилка завантаження профілю:', error)
      setFeedback({
        type: 'error',
        text: 'Unable to load profile settings.',
      })
    }
  }

  const handleSaveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // Без id користувача немає куди зберігати дані.
    if (!currentUserId) {
      setFeedback({
        type: 'error',
        text: 'User session is not available.',
      })
      return
    }

    setSavingProfile(true)
    setFeedback(null)

    try {
      // Оновлюємо основні дані профілю та персональні налаштування.
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          bio,
          phone,
          location,
          website,
          profile_photo: profilePhoto,
          portfolio_images: portfolioImages,
          notifications_enabled: notificationsEnabled,
          preferred_language: preferredLanguage,
          preferred_currency: preferredCurrency,
        })
        .eq('id', currentUserId)

      if (error) {
        throw error
      }

      // Після збереження одразу синхронізуємо мову і валюту з глобальним контекстом,
      // щоб хедер та інші блоки оновилися без перезавантаження.
      const selectedLanguage = LANGUAGES.find(
        (item) => item.code === preferredLanguage
      )
      const selectedCurrency = CURRENCIES.find(
        (item) => item.code === preferredCurrency
      )

      if (selectedLanguage) {
        setLanguage(selectedLanguage)
      }

      if (selectedCurrency) {
        setCurrency(selectedCurrency)
      }

      setFeedback({
        type: 'success',
        text: 'Profile updated successfully!',
      })
    } catch (error) {
      console.error('Помилка оновлення профілю:', error)
      setFeedback({
        type: 'error',
        text: 'Error updating profile.',
      })
    } finally {
      setSavingProfile(false)
    }
  }

  const handleChangePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFeedback(null)

    // Не даємо відправити форму, якщо паролі не збігаються.
    if (newPassword !== confirmPassword) {
      setFeedback({
        type: 'error',
        text: 'Passwords do not match.',
      })
      return
    }

    setSavingPassword(true)

    try {
      // Оновлюємо пароль авторизованого користувача.
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        throw error
      }

      setFeedback({
        type: 'success',
        text: 'Password changed successfully!',
      })

      // Очищаємо поля після успішної зміни.
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      console.error('Помилка зміни пароля:', error)
      setFeedback({
        type: 'error',
        text: 'Error changing password.',
      })
    } finally {
      setSavingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    // Додаткове підтвердження перед небезпечною дією.
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    )

    if (!confirmed || !currentUserId) {
      return
    }

    setFeedback(null)

    try {
      // Цей виклик потребує відповідних прав на бекенді.
      // Якщо серверна частина не дозволяє admin-операцію з клієнта, буде помилка.
      const { error } = await supabase.auth.admin.deleteUser(currentUserId)

      if (error) {
        throw error
      }

      navigateTo('/')
    } catch (error) {
      console.error('Помилка видалення акаунта:', error)
      setFeedback({
        type: 'error',
        text: 'Error deleting account.',
      })
    }
  }

  const addPortfolioImage = () => {
    // Додаємо новий порожній рядок для ще одного URL зображення.
    setPortfolioImages((current) => [...current, ''])
  }

  const updatePortfolioImage = (index: number, value: string) => {
    // Оновлюємо лише один конкретний елемент масиву за індексом.
    setPortfolioImages((current) => {
      const next = [...current]
      next[index] = value
      return next
    })
  }

  const removePortfolioImage = (index: number) => {
    // Видаляємо одне зображення з портфоліо за його позицією.
    setPortfolioImages((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }

  if (loading) {
    return (
      // Окремий стан завантаження, поки сторінка ще тягне профіль із бази.
      <div className="page-bg min-h-screen py-10">
        <div className="mx-auto max-w-4xl px-4 md:px-6 xl:px-8 2xl:px-10">
          <div className="glass-panel p-10 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[rgba(201,109,44,0.18)] border-t-[#c96d2c]" />
            <p className="mt-4 text-sm text-[#6f665d]">{t('common.loading')}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    // Загальна сторінка налаштувань з мобільними відступами і фірмовим фоном.
    <div className="page-bg min-h-screen py-8">
      <div className="w-full px-4 md:px-6 xl:px-8 2xl:px-10">
        <div className="flex gap-6">
          {/* Ліва реклама показується лише на великих екранах */}
          <aside className="hidden xl:block w-[220px] 2xl:w-[260px] flex-shrink-0">
            <AdBanner position="left" sticky={true} />
          </aside>

          {/* Основна колонка сторінки */}
          <main className="min-w-0 flex-1">
            <section className="glass-panel p-5 md:p-6 xl:p-8">
              {/* Шапка сторінки з коротким описом */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(233,202,177,0.7)] bg-[rgba(255,247,239,0.88)] px-4 py-2 text-sm font-semibold text-[#a26233]">
                  <User className="h-4 w-4" />
                  <span>{t('header.myProfile')}</span>
                </div>

                <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#2f2a24] md:text-4xl">
                  {t('header.myProfile')}
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-[#6f665d] md:text-base">
                  Manage your public profile, account preferences, and security settings.
                </p>
              </div>

              {/* Єдиний блок повідомлень для успішних дій або помилок */}
              {feedback && (
                <div
                  className={`mb-6 rounded-[22px] px-4 py-3 text-sm ${
                    feedback.type === 'error'
                      ? 'border border-[rgba(221,138,120,0.35)] bg-[rgba(255,237,232,0.92)] text-[#a44a3a]'
                      : 'border border-[rgba(120,181,140,0.35)] bg-[rgba(236,250,240,0.92)] text-[#3d7a52]'
                  }`}
                >
                  {feedback.text}
                </div>
              )}

              <div className="space-y-6">
                {/* Основна форма редагування профілю */}
                <form onSubmit={handleSaveProfile} className="glass-card p-5 md:p-6">
                  <div className="flex items-center gap-3">
                    <User className="h-6 w-6 text-[#c96d2c]" />
                    <h2 className="text-xl font-extrabold text-[#2f2a24]">
                      Profile Information
                    </h2>
                  </div>

                  <div className="mt-6 space-y-5">
                    {/* Ім'я користувача */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#5f5a54]">
                        {t('register.fullName')} *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        className="input-glass"
                        placeholder={t('register.fullNamePlaceholder')}
                      />
                    </div>

                    {/* Короткий опис майстра або компанії */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#5f5a54]">
                        Bio / Description
                      </label>
                      <textarea
                        value={bio}
                        onChange={(event) => setBio(event.target.value)}
                        rows={5}
                        maxLength={500}
                        className="input-glass min-h-[150px] resize-y"
                        placeholder="Tell clients about your experience and services..."
                      />
                      <p className="mt-2 text-xs text-[#7a7168]">
                        {bio.length}/500 characters
                      </p>
                    </div>

                    {/* Телефон і місто ставимо в одну сітку на більших екранах */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#5f5a54]">
                          <Phone className="mr-1 inline h-4 w-4" />
                          {t('createAd.phone')}
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(event) => setPhone(event.target.value)}
                          className="input-glass"
                          placeholder={t('register.phonePlaceholder')}
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#5f5a54]">
                          <MapPin className="mr-1 inline h-4 w-4" />
                          {t('createAd.locationLabel')}
                        </label>
                        <input
                          type="text"
                          value={location}
                          onChange={(event) => setLocation(event.target.value)}
                          className="input-glass"
                          placeholder={t('register.locationPlaceholder')}
                        />
                      </div>
                    </div>

                    {/* Поле сайту або зовнішньої сторінки */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#5f5a54]">
                        <Briefcase className="mr-1 inline h-4 w-4" />
                        Website
                      </label>
                      <input
                        type="url"
                        value={website}
                        onChange={(event) => setWebsite(event.target.value)}
                        className="input-glass"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>

                    {/* Фото профілю через URL і попередній перегляд */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#5f5a54]">
                        Profile Photo URL
                      </label>
                      <input
                        type="url"
                        value={profilePhoto}
                        onChange={(event) => setProfilePhoto(event.target.value)}
                        className="input-glass"
                        placeholder="https://example.com/photo.jpg"
                      />

                      {profilePhoto && (
                        <div className="mt-3">
                          <img
                            src={profilePhoto}
                            alt="Profile preview"
                            className="h-24 w-24 rounded-full object-cover ring-4 ring-white/70"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Блок портфоліо робіт */}
                  <div className="mt-8 border-t border-[rgba(190,168,150,0.28)] pt-6">
                    <div className="flex items-center gap-3">
                      <Image className="h-6 w-6 text-[#c96d2c]" />
                      <h3 className="text-lg font-extrabold text-[#2f2a24]">
                        Portfolio Images
                      </h3>
                    </div>

                    <div className="mt-4 space-y-3">
                      {portfolioImages.map((url, index) => (
                        <div key={index} className="flex flex-col gap-2 sm:flex-row">
                          <input
                            type="url"
                            value={url}
                            onChange={(event) =>
                              updatePortfolioImage(index, event.target.value)
                            }
                            className="input-glass flex-1"
                            placeholder="https://example.com/work-image.jpg"
                          />

                          <button
                            type="button"
                            onClick={() => removePortfolioImage(index)}
                            className="flex h-12 w-full items-center justify-center rounded-[18px] border border-[rgba(221,138,120,0.35)] bg-[rgba(255,237,232,0.92)] text-[#a44a3a] transition hover:bg-[rgba(255,230,223,0.96)] sm:w-12"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addPortfolioImage}
                        className="btn-ghost justify-start rounded-full px-0"
                      >
                        + Add Portfolio Image
                      </button>
                    </div>
                  </div>

                  {/* Блок персональних налаштувань мови й валюти */}
                  <div className="mt-8 border-t border-[rgba(190,168,150,0.28)] pt-6">
                    <div className="flex items-center gap-3">
                      <Globe className="h-6 w-6 text-[#c96d2c]" />
                      <h3 className="text-lg font-extrabold text-[#2f2a24]">
                        Language & Currency
                      </h3>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#5f5a54]">
                          {t('header.language')}
                        </label>
                        <select
                          value={preferredLanguage}
                          onChange={(event) => setPreferredLanguage(event.target.value)}
                          className="select-glass bg-white/80"
                        >
                          {LANGUAGES.map((item) => (
                            <option key={item.code} value={item.code}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#5f5a54]">
                          <DollarSign className="mr-1 inline h-4 w-4" />
                          {t('header.currency')}
                        </label>
                        <select
                          value={preferredCurrency}
                          onChange={(event) => setPreferredCurrency(event.target.value)}
                          className="select-glass bg-white/80"
                        >
                          {CURRENCIES.map((item) => (
                            <option key={item.code} value={item.code}>
                              {item.symbol} {item.code} - {item.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Перемикач сповіщень */}
                  <div className="mt-8 border-t border-[rgba(190,168,150,0.28)] pt-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Bell className="h-5 w-5 text-[#6f665d]" />
                          <span className="font-semibold text-[#2f2a24]">
                            Enable Notifications
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-[#6f665d]">
                          Receive updates about messages and leads.
                        </p>
                      </div>

                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          checked={notificationsEnabled}
                          onChange={(event) =>
                            setNotificationsEnabled(event.target.checked)
                          }
                          className="peer sr-only"
                        />
                        <div className="h-6 w-11 rounded-full bg-gray-200 transition peer-checked:bg-[#c96d2c] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[rgba(201,109,44,0.18)] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white" />
                      </label>
                    </div>
                  </div>

                  {/* Кнопка збереження профілю */}
                  <div className="mt-8 flex justify-end">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="btn-primary w-full justify-center rounded-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Save className="h-4 w-4" />
                      {savingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>

                {/* Окрема форма для зміни пароля */}
                <form onSubmit={handleChangePassword} className="glass-card p-5 md:p-6">
                  <div className="flex items-center gap-3">
                    <Lock className="h-6 w-6 text-[#c96d2c]" />
                    <h2 className="text-xl font-extrabold text-[#2f2a24]">
                      Change Password
                    </h2>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#5f5a54]">
                        New Password
                      </label>
                      <input
                        type="password"
                        minLength={6}
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        className="input-glass"
                        placeholder="••••••••"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#5f5a54]">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        minLength={6}
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        className="input-glass"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      disabled={!newPassword || !confirmPassword || savingPassword}
                      className="btn-secondary w-full justify-center rounded-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {savingPassword ? 'Saving...' : 'Change Password'}
                    </button>
                  </div>
                </form>

                {/* Небезпечна зона для незворотних дій */}
                <section className="glass-card border border-[rgba(221,138,120,0.28)] p-5 md:p-6">
                  <div className="flex items-center gap-3">
                    <Trash2 className="h-6 w-6 text-[#b14e37]" />
                    <h2 className="text-xl font-extrabold text-[#2f2a24]">
                      Danger Zone
                    </h2>
                  </div>

                  <p className="mt-4 max-w-2xl text-sm leading-6 text-[#6f665d]">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>

                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(185,63,63,0.95),rgba(153,27,27,0.95))] px-6 py-3 font-semibold text-white shadow-[0_18px_35px_rgba(153,27,27,0.22)] transition hover:scale-[1.01] active:scale-[0.99] sm:w-auto"
                  >
                    Delete Account
                  </button>
                </section>
              </div>
            </section>
          </main>

          {/* Права реклама також лише для широких екранів */}
          <aside className="hidden xl:block w-[220px] 2xl:w-[260px] flex-shrink-0">
            <AdBanner position="right" sticky={true} />
          </aside>
        </div>
      </div>
    </div>
  )
}
