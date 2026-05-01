import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useApp } from '../contexts/AppContext'
import { navigateTo } from '../lib/navigation'

export function Register() {
  const { t } = useApp()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) {
        throw authError
      }

      if (authData.user) {
        const { error: profileError } = await supabase.from('profiles').insert({
          id: authData.user.id,
          full_name: fullName,
          phone,
          location,
          is_professional: true,
        })

        if (profileError) {
          throw profileError
        }

        setSuccess(true)

        setTimeout(() => {
          navigateTo('/dashboard')
        }, 1200)
      }
    } catch (registrationError) {
      setError(
        registrationError instanceof Error
          ? registrationError.message
          : t('common.error')
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-bg min-h-screen px-4 py-10 md:px-6 xl:px-8 2xl:px-10">
      <div className="mx-auto flex max-w-md items-center justify-center">
        <div className="w-full space-y-6">
          <div className="glass-panel p-6 text-center md:p-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[linear-gradient(135deg,rgba(201,109,44,0.92),rgba(154,85,37,0.92))] text-white shadow-[0_18px_35px_rgba(15,23,42,0.18)]">
              <UserPlus className="h-8 w-8" />
            </div>

            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-[#2f2a24]">
              {t('register.title')}
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#6f665d] md:text-base">
              {t('register.subtitle')}
            </p>

            {error && (
              <div className="mt-6 rounded-[20px] border border-[rgba(221,138,120,0.35)] bg-[rgba(255,237,232,0.92)] px-4 py-3 text-left text-sm text-[#a44a3a]">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-6 rounded-[20px] border border-[rgba(120,181,140,0.35)] bg-[rgba(236,250,240,0.92)] px-4 py-3 text-left text-sm text-[#3d7a52]">
                {t('register.success')}
              </div>
            )}

            <form onSubmit={handleRegister} className="mt-6 space-y-5 text-left">
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

              <button
                type="submit"
                disabled={loading || success}
                className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? t('register.creating') : t('register.createAccount')}
              </button>
            </form>

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
    <div className="flex items-start gap-3">
      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[rgba(242,171,116,0.72)]" />
      <span>{text}</span>
    </div>
  )
}
