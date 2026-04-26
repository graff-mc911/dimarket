import { useEffect, useRef, useState } from 'react'
import { Menu, X, Globe, User, LogOut, Hammer, PlusCircle } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { CURRENCIES, LANGUAGES } from '../lib/types'
import { navigateTo } from '../lib/navigation'

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
    // Закриваємо випадаючі меню, якщо користувач клікнув поза ними
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      if (languageRef.current && !languageRef.current.contains(target)) {
        setLanguageOpen(false)
      }

      if (currencyRef.current && !currencyRef.current.contains(target)) {
        setCurrencyOpen(false)
      }
    }

    // Закриваємо всі меню клавішею Escape
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

  // Єдина функція переходу по сайту
  const goTo = (path: string) => {
    setMobileMenuOpen(false)
    setLanguageOpen(false)
    setCurrencyOpen(false)
    navigateTo(path)
  }

  const handleSignOut = async () => {
    await signOut()
    goTo('/')
  }

  return (
    <header className="bg-white/95 backdrop-blur border-b border-gray-200 sticky top-0 z-50 w-full">
      <div className="w-full px-4 md:px-6 xl:px-8 2xl:px-10">
        <div className="flex justify-between items-center h-16">
          {/* Логотип Dimarket */}
          <button
            onClick={() => goTo('/')}
            type="button"
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-sm">
              <Hammer className="w-5 h-5 text-white" />
            </div>

            <div className="text-left">
              <div className="text-2xl font-extrabold text-gray-900 leading-none">
                Dimarket
              </div>
              <div className="text-[11px] text-gray-500 leading-none mt-1">
                Construction services
              </div>
            </div>
          </button>

          {/* Десктопне меню */}
          <nav className="hidden md:flex items-center gap-2">
            <button
              onClick={() => goTo('/listings')}
              type="button"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:text-gray-950 hover:bg-gray-100 transition"
            >
              Заявки
            </button>

            <button
              onClick={() => goTo('/professionals')}
              type="button"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:text-gray-950 hover:bg-gray-100 transition"
            >
              {t('header.findProfessionals')}
            </button>

            <button
              onClick={() => goTo('/favorites')}
              type="button"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:text-gray-950 hover:bg-gray-100 transition"
            >
              Обране
            </button>

            {/* Вибір мови */}
            <div ref={languageRef} className="relative">
              <button
                onClick={() => {
                  setLanguageOpen(!languageOpen)
                  setCurrencyOpen(false)
                }}
                type="button"
                className="flex items-center gap-2 text-gray-700 hover:text-gray-950 px-3 py-2 rounded-xl text-sm font-semibold transition hover:bg-gray-100"
              >
                <Globe className="w-5 h-5" />
                <span>{language.code.toUpperCase()}</span>
              </button>

              {languageOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl py-2 max-h-96 overflow-auto z-50 border border-gray-100">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang)
                        setLanguageOpen(false)
                      }}
                      type="button"
                      className={`block w-[calc(100%-1rem)] text-left px-4 py-3 text-sm font-semibold rounded-xl mx-2 transition ${
                        language.code === lang.code
                          ? 'bg-gradient-to-r from-primary to-secondary text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Вибір валюти */}
            <div ref={currencyRef} className="relative">
              <button
                onClick={() => {
                  setCurrencyOpen(!currencyOpen)
                  setLanguageOpen(false)
                }}
                type="button"
                className="flex items-center gap-2 text-gray-700 hover:text-gray-950 px-3 py-2 rounded-xl text-sm font-semibold transition hover:bg-gray-100"
              >
                <span className="text-lg">{currency.symbol}</span>
                <span>{currency.code}</span>
              </button>

              {currencyOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl py-2 max-h-96 overflow-auto z-50 border border-gray-100">
                  {CURRENCIES.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setCurrency(curr)
                        setCurrencyOpen(false)
                      }}
                      type="button"
                      className={`block w-[calc(100%-1rem)] text-left px-4 py-3 text-sm font-semibold rounded-xl mx-2 transition ${
                        currency.code === curr.code
                          ? 'bg-gradient-to-r from-primary to-secondary text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="font-bold">{curr.symbol}</span>{' '}
                      {curr.code} — {curr.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Кабінет користувача */}
            {user && profile ? (
              <div className="relative group">
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:text-gray-950 hover:bg-gray-100 transition"
                >
                  <User className="w-5 h-5" />
                  <span>{profile.full_name || t('header.account')}</span>
                </button>

                <div className="hidden group-hover:block absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl py-2 z-50 border border-gray-100">
                  <button
                    onClick={() => goTo('/settings')}
                    type="button"
                    className="block w-[calc(100%-1rem)] text-left px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl mx-2 transition"
                  >
                    {t('header.myProfile')}
                  </button>

                  <button
                    onClick={() => goTo('/dashboard')}
                    type="button"
                    className="block w-[calc(100%-1rem)] text-left px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl mx-2 transition"
                  >
                    {t('header.dashboard')}
                  </button>

                  <div className="border-t border-gray-200 my-2" />

                  <button
                    onClick={handleSignOut}
                    type="button"
                    className="flex items-center gap-2 w-[calc(100%-1rem)] px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl mx-2 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('header.signOut')}</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => goTo('/login')}
                type="button"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:text-gray-950 hover:bg-gray-100 transition"
              >
                {t('header.professionalLogin')}
              </button>
            )}

            {/* Головна кнопка дії */}
            <button
              onClick={() => goTo('/create-ad')}
              type="button"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg transition"
            >
              <PlusCircle className="w-4 h-4" />
              Створити заявку
            </button>
          </nav>

          {/* Кнопка мобільного меню */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="md:hidden text-gray-700 p-2 rounded-xl hover:bg-gray-100"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Мобільне меню */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-3 pt-3 pb-4 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <button
              onClick={() => goTo('/listings')}
              type="button"
              className="block w-full text-left px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:bg-gray-100 transition"
            >
              Заявки
            </button>

            <button
              onClick={() => goTo('/professionals')}
              type="button"
              className="block w-full text-left px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:bg-gray-100 transition"
            >
              {t('header.findProfessionals')}
            </button>

            <button
              onClick={() => goTo('/favorites')}
              type="button"
              className="block w-full text-left px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:bg-gray-100 transition"
            >
              Обране
            </button>

            <div className="border-t border-gray-200 my-3" />

            {/* Мова на мобільному */}
            <div className="px-3 py-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-bold text-gray-700">
                  {t('header.language')}
                </span>
              </div>

              <select
                value={language.code}
                onChange={(e) => {
                  const lang = LANGUAGES.find((item) => item.code === e.target.value)
                  if (lang) setLanguage(lang)
                }}
                className="w-full px-3 py-3 text-base border border-gray-300 rounded-xl bg-white"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Валюта на мобільному */}
            <div className="px-3 py-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{currency.symbol}</span>
                <span className="text-sm font-bold text-gray-700">
                  {t('header.currency')}
                </span>
              </div>

              <select
                value={currency.code}
                onChange={(e) => {
                  const curr = CURRENCIES.find((item) => item.code === e.target.value)
                  if (curr) setCurrency(curr)
                }}
                className="w-full px-3 py-3 text-base border border-gray-300 rounded-xl bg-white"
              >
                {CURRENCIES.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.symbol} {curr.code} — {curr.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="border-t border-gray-200 my-3" />

            {user && profile ? (
              <>
                <button
                  onClick={() => goTo('/settings')}
                  type="button"
                  className="flex items-center gap-2 w-full text-left px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:bg-gray-100 transition"
                >
                  <User className="w-5 h-5" />
                  <span>{t('header.myProfile')}</span>
                </button>

                <button
                  onClick={() => goTo('/dashboard')}
                  type="button"
                  className="block w-full text-left px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:bg-gray-100 transition"
                >
                  {t('header.dashboard')}
                </button>

                <button
                  onClick={handleSignOut}
                  type="button"
                  className="flex items-center gap-2 w-full text-left px-4 py-3 rounded-xl text-base font-semibold text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="w-5 h-5" />
                  <span>{t('header.signOut')}</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => goTo('/login')}
                type="button"
                className="block w-full text-left px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:bg-gray-100 transition"
              >
                {t('header.professionalLogin')}
              </button>
            )}

            <button
              onClick={() => goTo('/create-ad')}
              type="button"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-base font-bold bg-gradient-to-r from-primary to-secondary text-white shadow-md"
            >
              <PlusCircle className="w-5 h-5" />
              Створити заявку
            </button>
          </div>
        </div>
      )}
    </header>
  )
}