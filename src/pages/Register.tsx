import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { UserPlus } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError

      if (authData.user) {
        const { error: profileError } = await supabase.from('profiles').insert({
          id: authData.user.id,
          full_name: fullName,
          phone,
          location,
          is_professional: true,
        })

        if (profileError) throw profileError

        setSuccess(true)
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 2000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-orange-600 to-orange-500 p-3 rounded-lg">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {t('register.title')}
          </h2>
          <p className="mt-2 text-gray-600">
            {t('register.subtitle')}
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-lg rounded-xl">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
              {t('register.success')}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                {t('register.fullName')} *
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder={t('register.fullNamePlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t('login.email')} *
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder={t('login.emailPlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {t('login.password')} *
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder={t('login.passwordPlaceholder')}
                minLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">{t('register.passwordMin')}</p>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                {t('createAd.phone')}
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder={t('register.phonePlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                {t('createAd.locationLabel')}
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder={t('register.locationPlaceholder')}
              />
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('register.creating') : t('register.createAccount')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t('register.alreadyHave')}{' '}
              <a href="/login" className="text-blue-900 font-semibold hover:text-blue-700">
                {t('footer.signIn')}
              </a>
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900 font-medium mb-2">
            {t('register.afterRegistration')}
          </p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• {t('register.choosePlan')}</li>
            <li>• {t('register.completeProfile')}</li>
            <li>• {t('register.receiveRequests')}</li>
            <li>• {t('register.buildReputation')}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
