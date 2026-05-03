import { useState } from 'react'
import { LogIn } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { supabase } from '../lib/supabase'
import { navigateTo } from '../lib/navigation'

export function Login() {
  const { t } = useApp()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (loginError) {
        throw loginError
      }

      navigateTo('/dashboard')
    } catch (loginFailure) {
      setError(
        loginFailure instanceof Error ? loginFailure.message : t('common.error')
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
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[linear-gradient(135deg,rgba(47,42,36,0.92),rgba(25,23,20,0.92))] text-white shadow-[0_18px_35px_rgba(15,23,42,0.18)]">
              <LogIn className="h-8 w-8" />
            </div>

            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-[#2f2a24]">
              {t('login.title')}
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#6f665d] md:text-base">
              {t('login.subtitle')}
            </p>

            {error && (
              <div className="mt-6 rounded-[20px] border border-[rgba(221,138,120,0.35)] bg-[rgba(255,237,232,0.92)] px-4 py-3 text-left text-sm text-[#a44a3a]">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="mt-6 space-y-5 text-left">
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
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="input-glass"
                  placeholder={t('login.passwordPlaceholder')}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-secondary w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? t('login.signingIn') : t('login.signIn')}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-[#6f665d]">
                {t('login.noAccount')}{' '}
                <button
                  onClick={() => navigateTo('/register')}
                  type="button"
                  className="font-semibold text-[#2f2a24] transition hover:text-[#9a5525]"
                >
                  {t('login.registerLink')}
                </button>
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-[#7a7168]">
              {t('login.lookingToPost')}{' '}
              <button
                onClick={() => navigateTo('/create-ad')}
                type="button"
                className="font-semibold text-[#c96d2c] transition hover:text-[#9a5525]"
              >
                {t('login.noRegistrationRequired')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
