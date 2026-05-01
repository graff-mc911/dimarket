import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useApp } from '../contexts/AppContext'
import { navigateTo } from '../lib/navigation'

export function Register() {
  const { t } = useApp()

  // Стани для полів форми реєстрації
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')

  // Стан завантаження під час відправки форми
  const [loading, setLoading] = useState(false)

  // Стан для тексту помилки, якщо реєстрація не пройшла
  const [error, setError] = useState('')

  // Стан успіху, щоб показати повідомлення після успішної реєстрації
  const [success, setSuccess] = useState(false)

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    // Забороняємо стандартне перезавантаження сторінки при submit
    event.preventDefault()

    // Перед новою спробою очищаємо стару помилку
    setError('')

    // Вмикаємо стан завантаження, щоб заблокувати кнопку і показати процес
    setLoading(true)

    try {
      // Створюємо користувача в Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      // Якщо Supabase повернув помилку реєстрації — кидаємо її в catch
      if (authError) {
        throw authError
      }

      // Якщо користувач успішно створений — додаємо його профіль у таблицю profiles
      if (authData.user) {
        const { error: profileError } = await supabase.from('profiles').insert({
          id: authData.user.id,
          full_name: fullName,
          phone,
          location,
          is_professional: true,
        })

        // Якщо профіль не створився — також кидаємо помилку
        if (profileError) {
          throw profileError
        }

        // Показуємо повідомлення про успіх
        setSuccess(true)

        // Даємо користувачу побачити success-повідомлення і переводимо в кабінет
        setTimeout(() => {
          navigateTo('/dashboard')
        }, 1200)
      }
    } catch (registrationError) {
      // Якщо помилка має текст — показуємо його, інакше показуємо загальну помилку
      setError(
        registrationError instanceof Error
          ? registrationError.message
          : t('common.error')
      )
    } finally {
      // У будь-якому випадку завершуємо стан завантаження
      setLoading(false)
    }
  }

  return (
    // Загальний контейнер сторінки з фоновим оформленням і відступами
    <div className="page-bg min-h-screen px-4 py-10 md:px-6 xl:px-8 2xl:px-10">
      {/* Центруємо блок реєстрації по ширині сторінки */}
      <div className="mx-auto flex max-w-md items-center justify-center">
        {/* Основна колонка сторінки: форма + інформаційний блок */}
        <div className="w-full space-y-6">
          {/* Верхня скляна картка з іконкою, заголовком і формою */}
          <div className="glass-panel p-6 text-center md:p-8">
            {/* Іконка сторінки реєстрації */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[linear-gradient(135deg,rgba(201,109,44,0.92),rgba(154,85,37,0.92))] text-white shadow-[0_18px_35px_rgba(15,23,42,0.18)]">
              <UserPlus className="h-8 w-8" />
            </div>

            {/* Заголовок і підзаголовок сторінки */}
            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-[#2f2a24]">
              {t('register.title')}
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#6f665d] md:text-base">
              {t('register.subtitle')}
            </p>

            {/* Блок помилки показується тільки якщо є текст помилки */}
            {error && (
              <div className="mt-6 rounded-[20px] border border-[rgba(221,138,120,0.35)] bg-[rgba(255,237,232,0.92)] px-4 py-3 text-left text-sm text-[#a44a3a]">
                {error}
              </div>
            )}

            {/* Блок успішної реєстрації показується після успішного створення акаунта */}
            {success && (
              <div className="mt-6 rounded-[20px] border border-[rgba(120,181,140,0.35)] bg-[rgba(236,250,240,0.92)] px-4 py-3 text-left text-sm text-[#3d7a52]">
                {t('register.success')}
              </div>
            )}

            {/* Основна форма реєстрації */}
            <form onSubmit={handleRegister} className="mt-6 space-y-5 text-left">
              {/* Поле повного імені */}
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-semibold text-[#5f5a54]"
                >
                  {t('register.fullName')}
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="input-glass"
                  placeholder={t('register.fullNamePlaceholder')}
                />
              </div>

              {/* Поле email для входу та авторизації */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#5f5a54]"
                >
                  {t('login.email')}
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="input-glass"
                  placeholder={t('login.emailPlaceholder')}
                />
              </div>

              {/* Поле пароля з мінімальним обмеженням довжини */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-[#5f5a54]"
                >
                  {t('login.password')}
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="input-glass"
                  placeholder={t('login.passwordPlaceholder')}
                />
                <p className="mt-2 text-xs text-[#7a7168]">
                  {t('register.passwordMin')}
                </p>
              </div>

              {/* Додаткове поле телефону для профілю майстра */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-[#5f5a54]"
                >
                  {t('createAd.phone')}
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="input-glass"
                  placeholder={t('register.phonePlaceholder')}
                />
              </div>

              {/* Додаткове поле локації для профілю */}
              <div>
                <label
                  htmlFor="location"
                  className="mb-2 block text-sm font-semibold text-[#5f5a54]"
                >
                  {t('createAd.locationLabel')}
                </label>
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  className="input-glass"
                  placeholder={t('register.locationPlaceholder')}
                />
              </div>

              {/* Кнопка відправки форми.
                  Блокується під час завантаження або після успішної реєстрації */}
              <button
                type="submit"
                disabled={loading || success}
                className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? t('register.creating') : t('register.createAccount')}
              </button>
            </form>

            {/* Нижній рядок для переходу на сторінку входу */}
            <div className="mt-6 text-center">
              <p className="text-sm text-[#6f665d]">
                {t('register.alreadyHave')}{' '}
                <button
                  onClick={() => navigateTo('/login')}
                  type="button"
                  className="font-semibold text-[#2f2a24] transition hover:text-[#9a5525]"
                >
                  {t('footer.signIn')}
                </button>
              </p>
            </div>
          </div>

          {/* Додаткова картка, яка пояснює що буде після реєстрації */}
          <div className="glass-card p-5">
            <p className="text-sm font-semibold text-[#2f2a24]">
              {t('register.afterRegistration')}
            </p>

            <div className="mt-4 space-y-3 text-sm text-[#6f665d]">
              <BenefitRow text={t('register.choosePlan')} />
              <BenefitRow text={t('register.completeProfile')} />
              <BenefitRow text={t('register.receiveRequests')} />
              <BenefitRow text={t('register.buildReputation')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function BenefitRow({ text }: { text: string }) {
  return (
    // Один рядок переваги/наступного кроку з декоративною крапкою
    <div className="flex items-start gap-3">
      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[rgba(242,171,116,0.72)]" />
      <span>{text}</span>
    </div>
  )
}
