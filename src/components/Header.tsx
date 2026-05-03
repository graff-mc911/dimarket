/**
 * Шапка сайту: навігація, мова/валюта, мобільне меню.
 * Логотип беремо з окремого компонента Logo (ваш оригінальний файл).
 */
import { useEffect, useRef, useState } from 'react'
import { Menu, X, Globe, User, LogOut } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { CURRENCIES, LANGUAGES } from '../lib/types'
import { navigateTo } from '../lib/navigation'
import { Logo } from './Logo'

export function Header() {
  const {
    user,
    profile,
    currency,
    language,
    setCurrency,
    setLanguage,
    signOut,
    t,
  } = useApp()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currencyOpen, setCurrencyOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)

  const languageRef = useRef<HTMLDivElement | null>(null)
  const currencyRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      if (languageRef.current && !languageRef.current.contains(target)) {
        setLanguageOpen(false)
      }

      if (currencyRef.current && !currencyRef.current.contains(target)) {
        setCurrencyOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLanguageOpen(false)
        setCurrencyOpen(false)
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const goToHome = () => {
    setMobileMenuOpen(false)
    navigateTo('/')
  }

  const goToListings = () => {
    setMobileMenuOpen(false)
    navigateTo('/listings')
  }

  const goToProfessionals = () => {
    setMobileMenuOpen(false)
    navigateTo('/professionals')
  }

  const goToLogin = () => {
    setMobileMenuOpen(false)
    navigateTo('/login')
  }

  const goToCreateAd = () => {
    setMobileMenuOpen(false)
    navigateTo('/create-ad')
  }

  const goToDashboard = () => {
    setMobileMenuOpen(false)
    navigateTo('/dashboard')
  }

  const goToSettings = () => {
    setMobileMenuOpen(false)
    navigateTo('/settings')
  }

  const handleSignOut = async () => {
    await signOut()
    setMobileMenuOpen(false)
    navigateTo('/')
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 w-full">
      <div className="w-full px-4 md:px-6 xl:px-8 2xl:px-10">
        <div className="flex justify-between items-center h-20">
          {/* Логотип */}
          <div className="flex items-center min-w-0">
            <button
              onClick={goToHome}
              className="flex items-center min-w-0"
              type="button"
              aria-label="DImarket — на головну"
            >
              <Logo size="md" className="max-w-[180px] sm:max-w-[220px]" />
            </button>
          </div>

          {/* Десктопне меню */}
          <nav className="hidden md:flex items-center space-x-4">
            <button
              onClick={goToListings}
              type="button"
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition"
            >
              {t('header.browse')}
            </button>

            <button
              onClick={goToProfessionals}
              type="button"
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition"
            >
              {t('header.findProfessionals')}
            </button>

            <div ref={languageRef} className="relative">
              <button
                onClick={() => {
                  setLanguageOpen(!languageOpen)
                  setCurrencyOpen(false)
                }}
                type="button"
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium transition hover:bg-gray-50"
              >
                <Globe className="w-5 h-5" />
                <span className="font-semibold">{language.code.toUpperCase()}</span>
              </button>

              {languageOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 max-h-96 overflow-auto z-50 border border-gray-100">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang)
                        setLanguageOpen(false)
                      }}
                      type="button"
                      className={`block w-[calc(100%-1rem)] text-left px-4 py-3 text-sm font-medium transition rounded-lg mx-2 ${
                        language.code === lang.code
                          ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div ref={currencyRef} className="relative">
              <button
                onClick={() => {
                  setCurrencyOpen(!currencyOpen)
                  setLanguageOpen(false)
                }}
                type="button"
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium transition hover:bg-gray-50"
              >
                <span className="text-lg font-bold">{currency.symbol}</span>
                <span className="font-semibold">{currency.code}</span>
              </button>

              {currencyOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-100">
                  {CURRENCIES.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setCurrency(curr)
                        setCurrencyOpen(false)
                      }}
                      type="button"
                      className={`block w-[calc(100%-1rem)] text-left px-4 py-3 text-sm font-medium transition rounded-lg mx-2 ${
                        currency.code === curr.code
                          ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <span className="font-bold">{curr.symbol}</span> {curr.code} - {curr.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user && profile ? (
              <div className="relative group">
                <button
                  type="button"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition"
                >
                  <User className="w-5 h-5" />
                  <span className="font-semibold">{profile.full_name || t('header.account')}</span>
                </button>

                <div className="hidden group-hover:block absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-100">
                  <button
                    onClick={goToSettings}
                    type="button"
                    className="block w-[calc(100%-1rem)] text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition rounded-lg mx-2"
                  >
                    {t('header.myProfile')}
                  </button>

                  {profile.is_professional && (
                    <>
                      <button
                        onClick={goToDashboard}
                        type="button"
                        className="block w-[calc(100%-1rem)] text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition rounded-lg mx-2"
                      >
                        {t('header.dashboard')}
                      </button>

                      <button
                        onClick={goToDashboard}
                        type="button"
                        className="block w-[calc(100%-1rem)] text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition rounded-lg mx-2"
                      >
                        {t('header.myListings')}
                      </button>
                    </>
                  )}

                  <div className="border-t border-gray-200 my-2"></div>

                  <button
                    onClick={handleSignOut}
                    type="button"
                    className="flex items-center space-x-2 w-[calc(100%-1rem)] px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition rounded-lg mx-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('header.signOut')}</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={goToLogin}
                type="button"
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition"
              >
                {t('header.professionalLogin')}
              </button>
            )}

            <button
              onClick={goToCreateAd}
              type="button"
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              {t('header.createAd')}
            </button>
          </nav>

          {/* Кнопка мобільного меню */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="md:hidden text-gray-700 p-2 -mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-gray-50"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-primary-menu"
            aria-label={mobileMenuOpen ? 'Закрити меню' : 'Відкрити меню'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          id="mobile-primary-menu"
          className="md:hidden bg-white border-t shadow-lg"
          role="navigation"
          aria-label="Мобільна навігація"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 max-h-[calc(100vh-5rem)] overflow-y-auto overscroll-contain">
            <button
              onClick={goToListings}
              type="button"
              className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition"
            >
              {t('header.browse')}
            </button>

            <button
              onClick={goToProfessionals}
              type="button"
              className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition"
            >
              {t('header.findProfessionals')}
            </button>

            <div className="border-t border-gray-200 my-3"></div>

            <div className="px-3 py-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Globe className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-semibold text-gray-700">{t('header.language')}</span>
              </div>

              <select
                value={language.code}
                onChange={(e) => {
                  const lang = LANGUAGES.find((item) => item.code === e.target.value)
                  if (lang) setLanguage(lang)
                }}
                className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="px-3 py-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-lg">{currency.symbol}</span>
                <span className="text-sm font-semibold text-gray-700">{t('header.currency')}</span>
              </div>

              <select
                value={currency.code}
                onChange={(e) => {
                  const curr = CURRENCIES.find((item) => item.code === e.target.value)
                  if (curr) setCurrency(curr)
                }}
                className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition"
              >
                {CURRENCIES.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.symbol} {curr.code} - {curr.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="border-t border-gray-200 my-3"></div>

            {user && profile ? (
              <>
                <button
                  onClick={goToSettings}
                  type="button"
                  className="flex items-center space-x-2 w-full text-left px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition"
                >
                  <User className="w-5 h-5" />
                  <span>{t('header.myProfile')}</span>
                </button>

                {profile.is_professional && (
                  <>
                    <button
                      onClick={goToDashboard}
                      type="button"
                      className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition"
                    >
                      {t('header.dashboard')}
                    </button>

                    <button
                      onClick={goToDashboard}
                      type="button"
                      className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition"
                    >
                      {t('header.myListings')}
                    </button>
                  </>
                )}

                <button
                  onClick={handleSignOut}
                  type="button"
                  className="flex items-center space-x-2 w-full text-left px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="w-5 h-5" />
                  <span>{t('header.signOut')}</span>
                </button>
              </>
            ) : (
              <button
                onClick={goToLogin}
                type="button"
                className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition"
              >
                {t('header.professionalLogin')}
              </button>
            )}

            <button
              onClick={goToCreateAd}
              type="button"
              className="block w-[calc(100%-1.5rem)] mx-3 my-2 px-4 py-3 rounded-lg text-base font-semibold bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg transition-all duration-300 text-center"
            >
              {t('header.createAd')}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}