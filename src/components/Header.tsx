import { useState } from 'react'
import { Menu, X, Globe, User, LogOut } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { CURRENCIES, LANGUAGES } from '../lib/types'

export function Header() {
  const { user, profile, currency, language, setCurrency, setLanguage, signOut, t } = useApp()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currencyOpen, setCurrencyOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 w-full">
      <div className="w-full px-4 md:px-6 xl:px-8 2xl:px-10">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-lg">
                <div className="text-white font-bold text-xl">DI</div>
              </div>
              <span className="text-2xl font-bold text-gray-900">DImarket</span>
            </a>
          </div>

          <nav className="hidden md:flex items-center space-x-4">
            <a href="/listings" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition">
              {t('header.browse')}
            </a>

            <a href="/professionals" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition">
              {t('header.findProfessionals')}
            </a>

            <div className="relative">
              <button
                onClick={() => setLanguageOpen(!languageOpen)}
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

            <div className="relative">
              <button
                onClick={() => setCurrencyOpen(!currencyOpen)}
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
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition">
                  <User className="w-5 h-5" />
                  <span className="font-semibold">{profile.full_name || t('header.account')}</span>
                </button>

                <div className="hidden group-hover:block absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-100">
                  <a href="/settings" className="block w-[calc(100%-1rem)] px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition rounded-lg mx-2">
                    {t('header.myProfile')}
                  </a>

                  {profile.is_professional && (
                    <>
                      <a href="/dashboard" className="block w-[calc(100%-1rem)] px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition rounded-lg mx-2">
                        {t('header.dashboard')}
                      </a>

                      <a href="/dashboard" className="block w-[calc(100%-1rem)] px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition rounded-lg mx-2">
                        {t('header.myListings')}
                      </a>
                    </>
                  )}

                  <div className="border-t border-gray-200 my-2"></div>

                  <button
                    onClick={signOut}
                    className="flex items-center space-x-2 w-[calc(100%-1rem)] px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition rounded-lg mx-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('header.signOut')}</span>
                  </button>
                </div>
              </div>
            ) : (
              <a
                href="/login"
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition"
              >
                {t('header.professionalLogin')}
              </a>
            )}

            <a
              href="/create-ad"
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              {t('header.createAd')}
            </a>
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <a href="/listings" className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition">
              {t('header.browse')}
            </a>

            <a href="/professionals" className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition">
              {t('header.findProfessionals')}
            </a>
          </div>
        </div>
      )}
    </header>
  )
}