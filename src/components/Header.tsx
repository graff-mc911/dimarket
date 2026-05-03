import { useEffect, useRef, useState } from 'react'
import {
  ChevronDown,
  ClipboardList,
  Globe,
  Hammer,
  Heart,
  LogOut,
  Menu,
  MessageSquare,
  PlusCircle,
  Search,
  User,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { CURRENCIES, LANGUAGES } from '../lib/types'
import { navigateTo } from '../lib/navigation'
import { Logo } from './Logo'

interface NavItem {
  label: string
  path: string
  icon: LucideIcon
}

const OWNER_EMAIL = 'ivan.sovbanL@gmail.com'

function isOwnerEmail(email: string | null | undefined) {
  return (email || '').trim().toLowerCase() === OWNER_EMAIL.trim().toLowerCase()
}

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

  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currencyOpen, setCurrencyOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)

  const languageRef = useRef<HTMLDivElement | null>(null)
  const currencyRef = useRef<HTMLDivElement | null>(null)
  const accountRef = useRef<HTMLDivElement | null>(null)

  const currentPath = window.location.pathname
  const isSiteOwner = profile?.is_site_owner === true || isOwnerEmail(user?.email)
  const accountLabel = profile?.full_name || t('header.account')

  const navItems: NavItem[] = [
    { label: t('header.findProfessionals'), path: '/professionals', icon: Hammer },
    { label: t('header.favorites'), path: '/favorites', icon: Heart },
    { label: t('header.messages'), path: '/messages', icon: MessageSquare },
  ]

  const closeAllMenus = () => {
    setLanguageOpen(false)
    setCurrencyOpen(false)
    setAccountOpen(false)
    setMobileMenuOpen(false)
  }

  const closeDropdowns = () => {
    setLanguageOpen(false)
    setCurrencyOpen(false)
    setAccountOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      if (languageRef.current && !languageRef.current.contains(target)) {
        setLanguageOpen(false)
      }

      if (currencyRef.current && !currencyRef.current.contains(target)) {
        setCurrencyOpen(false)
      }

      if (accountRef.current && !accountRef.current.contains(target)) {
        setAccountOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeAllMenus()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow

    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [mobileMenuOpen])

  const goTo = (path: string) => {
    closeAllMenus()
    navigateTo(path)
  }

  const handleSignOut = async () => {
    await signOut()
    goTo('/')
  }

  const isActiveRoute = (path: string) => {
    if (path === '/') {
      return currentPath === '/'
    }

    return currentPath === path || currentPath.startsWith(`${path}/`)
  }

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const query = searchQuery.trim()

    closeAllMenus()

    if (!query) {
      navigateTo('/listings')
      return
    }

    navigateTo(`/listings?search=${encodeURIComponent(query)}`)
  }

  const hoverGlowClass =
    'transition-all duration-300 hover:text-[var(--accent-700)] hover:[text-shadow:0_0_14px_rgba(196,122,61,0.18)]'

  const navTextClass = (active: boolean) =>
    [
      'relative inline-flex items-center gap-2 pb-2 text-sm font-semibold transition-all duration-300',
      active
        ? 'text-[var(--accent-700)] [text-shadow:0_0_14px_rgba(196,122,61,0.18)]'
        : `text-[var(--ink-700)] ${hoverGlowClass}`,
    ].join(' ')

  const textButtonClass = (active = false) =>
    [
      'inline-flex items-center gap-2 rounded-full border-0 bg-transparent px-2 py-2 text-sm font-semibold shadow-none outline-none',
      active
        ? 'text-[var(--accent-700)] [text-shadow:0_0_14px_rgba(196,122,61,0.18)]'
        : `text-[var(--ink-700)] ${hoverGlowClass}`,
    ].join(' ')

  const createButtonClass =
    'inline-flex items-center gap-2 rounded-full border-0 bg-transparent px-2 py-2 text-sm font-semibold text-[var(--ink-800)] shadow-none outline-none transition-all duration-300 hover:text-[var(--accent-700)] hover:[text-shadow:0_0_16px_rgba(196,122,61,0.22)]'

  const mobileIconButtonClass =
    'flex h-10 w-10 items-center justify-center rounded-full border-0 bg-transparent text-[var(--ink-700)] shadow-none outline-none transition-all duration-300 hover:text-[var(--accent-700)] hover:[text-shadow:0_0_16px_rgba(196,122,61,0.22)] sm:h-11 sm:w-11'

  const dropdownPanelClass =
    'absolute right-0 top-full mt-3 w-64 rounded-[24px] border border-[var(--glass-border)] bg-[rgba(255,252,248,0.94)] p-2.5 shadow-[0_22px_50px_rgba(67,44,26,0.10)] backdrop-blur-xl'

  const dropdownItemClass =
    'block w-full rounded-[18px] px-4 py-3 text-left text-sm font-semibold text-[var(--ink-700)] transition-all duration-300 hover:text-[var(--accent-700)] hover:[text-shadow:0_0_12px_rgba(196,122,61,0.16)]'

  const mobilePanelClass =
    'max-h-[calc(100vh-8rem)] overflow-y-auto rounded-[26px] border border-[var(--glass-border)] bg-[rgba(255,252,248,0.92)] p-3 shadow-[0_18px_42px_rgba(67,44,26,0.08)] backdrop-blur-xl'

  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-3 md:px-5 md:pt-5">
      <div className="w-full rounded-[30px] border border-[var(--glass-border)] bg-[rgba(255,252,248,0.78)] shadow-[0_16px_36px_rgba(67,44,26,0.06)] backdrop-blur-xl">
        <div className="px-4 py-4 md:px-6">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <button
              onClick={() => goTo('/')}
              type="button"
              className="min-w-0 flex-1 text-left"
            >
              {/* На вузьких екранах беремо менший логотип,
                  щоб шапка лишалась повітряною. */}
              <Logo size="sm" className="sm:hidden" />
              <Logo size="md" className="hidden sm:block" />
            </button>

            <form
              onSubmit={handleSearchSubmit}
              className="hidden min-w-0 flex-1 items-center xl:flex xl:max-w-[620px]"
            >
              <div className="relative w-full">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[var(--ink-500)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={t('home.search')}
                  className="input-glass h-12 rounded-full pl-11 pr-4"
                />
              </div>
            </form>

            <div className="hidden items-center gap-2 xl:flex">
              <div ref={languageRef} className="relative">
                <button
                  onClick={() => {
                    setLanguageOpen((open) => !open)
                    setCurrencyOpen(false)
                    setAccountOpen(false)
                  }}
                  type="button"
                  className={textButtonClass(languageOpen)}
                >
                  <Globe className="h-4 w-4" />
                  <span>{language.code.toUpperCase()}</span>
                  <ChevronDown className="h-4 w-4 text-current" />
                </button>

                {languageOpen && (
                  <div className={dropdownPanelClass}>
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang)
                          setLanguageOpen(false)
                        }}
                        type="button"
                        className={
                          language.code === lang.code
                            ? `${dropdownItemClass} text-[var(--accent-700)] [text-shadow:0_0_12px_rgba(196,122,61,0.16)]`
                            : dropdownItemClass
                        }
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
                    setCurrencyOpen((open) => !open)
                    setLanguageOpen(false)
                    setAccountOpen(false)
                  }}
                  type="button"
                  className={textButtonClass(currencyOpen)}
                >
                  <span className="text-base">{currency.symbol}</span>
                  <span>{currency.code}</span>
                  <ChevronDown className="h-4 w-4 text-current" />
                </button>

                {currencyOpen && (
                  <div className={dropdownPanelClass}>
                    {CURRENCIES.map((curr) => (
                      <button
                        key={curr.code}
                        onClick={() => {
                          setCurrency(curr)
                          setCurrencyOpen(false)
                        }}
                        type="button"
                        className={
                          currency.code === curr.code
                            ? `${dropdownItemClass} text-[var(--accent-700)] [text-shadow:0_0_12px_rgba(196,122,61,0.16)]`
                            : dropdownItemClass
                        }
                      >
                        <span className="font-bold">{curr.symbol}</span>{' '}
                        {curr.code} - {curr.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {user && profile ? (
                <div ref={accountRef} className="relative">
                  <button
                    onClick={() => {
                      setAccountOpen((open) => !open)
                      setLanguageOpen(false)
                      setCurrencyOpen(false)
                    }}
                    type="button"
                    className={`${textButtonClass(accountOpen)} max-w-[240px]`}
                  >
                    <User className="h-4 w-4 shrink-0" />
                    <span className="truncate">{accountLabel}</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-current" />
                  </button>

                  {accountOpen && (
                    <div className={dropdownPanelClass}>
                      <button
                        onClick={() => goTo('/settings')}
                        type="button"
                        className={dropdownItemClass}
                      >
                        {t('header.myProfile')}
                      </button>

                      {isSiteOwner && (
                        <button
                          onClick={() => goTo('/dashboard')}
                          type="button"
                          className={dropdownItemClass}
                        >
                          {t('header.dashboard')}
                        </button>
                      )}

                      <div className="my-2 border-t border-[var(--glass-border)]" />

                      <button
                        onClick={handleSignOut}
                        type="button"
                        className="flex w-full items-center gap-2 rounded-[18px] px-4 py-3 text-left text-sm font-semibold text-[#a04b39] transition-all duration-300 hover:text-[#c2614a] hover:[text-shadow:0_0_12px_rgba(194,97,74,0.16)]"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>{t('header.signOut')}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => goTo('/login')}
                  type="button"
                  className={textButtonClass()}
                >
                  {t('header.professionalLogin')}
                </button>
              )}

              <button
                onClick={() => goTo('/create-ad')}
                type="button"
                className={createButtonClass}
              >
                <PlusCircle className="h-4 w-4" />
                {t('header.createAd')}
              </button>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 xl:hidden">
              <button
                onClick={() => goTo('/create-ad')}
                type="button"
                aria-label={t('header.createAd')}
                className="inline-flex items-center gap-1 rounded-full border-0 bg-transparent px-2 py-2 text-xs font-semibold text-[var(--ink-800)] shadow-none outline-none transition-all duration-300 hover:text-[var(--accent-700)] hover:[text-shadow:0_0_16px_rgba(196,122,61,0.22)] sm:gap-2 sm:px-3 sm:text-sm"
              >
                <PlusCircle className="h-5 w-5" />
                <span className="hidden min-[430px]:inline">{t('header.createAd')}</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen((open) => !open)
                  closeDropdowns()
                }}
                type="button"
                aria-expanded={mobileMenuOpen}
                className={`${mobileIconButtonClass} ${
                  mobileMenuOpen
                    ? 'text-[var(--accent-700)] [text-shadow:0_0_16px_rgba(196,122,61,0.22)]'
                    : ''
                }`}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="mt-4 hidden items-end justify-between gap-6 border-t border-[var(--glass-border)] pt-4 xl:flex">
            <nav className="flex items-center gap-7">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => goTo(item.path)}
                  type="button"
                  className={navTextClass(isActiveRoute(item.path))}
                >
                  <span>{item.label}</span>
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] rounded-full bg-[var(--accent-700)] transition-all duration-300 ${
                      isActiveRoute(item.path) ? 'w-full opacity-100' : 'w-0 opacity-0'
                    }`}
                  />
                </button>
              ))}
            </nav>

            <button
              onClick={() => goTo('/listings')}
              type="button"
              className={textButtonClass(isActiveRoute('/listings'))}
            >
              {t('listings.title')}
            </button>
          </div>

          <form onSubmit={handleSearchSubmit} className="mt-4 xl:hidden">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[var(--ink-500)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t('home.search')}
                className="input-glass h-12 rounded-full pl-11 pr-4"
              />
            </div>
          </form>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-[var(--glass-border)] px-3 pb-4 pt-3 xl:hidden">
            <div className={mobilePanelClass}>
              <div className="grid gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => goTo(item.path)}
                    type="button"
                    className="flex w-full items-center gap-3 rounded-[20px] px-4 py-3 text-left text-base font-semibold text-[var(--ink-700)] transition-all duration-300 hover:text-[var(--accent-700)] hover:[text-shadow:0_0_12px_rgba(196,122,61,0.16)]"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                ))}

                <button
                  onClick={() => goTo('/listings')}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-[20px] px-4 py-3 text-left text-base font-semibold text-[var(--ink-700)] transition-all duration-300 hover:text-[var(--accent-700)] hover:[text-shadow:0_0_12px_rgba(196,122,61,0.16)]"
                >
                  <Search className="h-5 w-5" />
                  <span>{t('listings.title')}</span>
                </button>
              </div>

              <div className="my-3 border-t border-[var(--glass-border)]" />

              <div className="grid gap-3 rounded-[24px] bg-[rgba(255,249,243,0.74)] p-3">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--ink-700)]">
                    <Globe className="h-4 w-4" />
                    <span>{t('header.language')}</span>
                  </label>
                  <select
                    value={language.code}
                    onChange={(event) => {
                      const lang = LANGUAGES.find((item) => item.code === event.target.value)
                      if (lang) {
                        setLanguage(lang)
                      }
                    }}
                    className="select-glass"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--ink-700)]">
                    <span className="text-base">{currency.symbol}</span>
                    <span>{t('header.currency')}</span>
                  </label>
                  <select
                    value={currency.code}
                    onChange={(event) => {
                      const curr = CURRENCIES.find((item) => item.code === event.target.value)
                      if (curr) {
                        setCurrency(curr)
                      }
                    }}
                    className="select-glass"
                  >
                    {CURRENCIES.map((curr) => (
                      <option key={curr.code} value={curr.code}>
                        {curr.symbol} {curr.code} - {curr.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-3 grid gap-2">
                {user && profile ? (
                  <>
                    <button
                      onClick={() => goTo('/settings')}
                      type="button"
                      className="flex w-full items-center gap-3 rounded-[20px] px-4 py-3 text-left text-base font-semibold text-[var(--ink-700)] transition-all duration-300 hover:text-[var(--accent-700)] hover:[text-shadow:0_0_12px_rgba(196,122,61,0.16)]"
                    >
                      <User className="h-5 w-5" />
                      <span>{t('header.myProfile')}</span>
                    </button>

                    {isSiteOwner && (
                      <button
                        onClick={() => goTo('/dashboard')}
                        type="button"
                        className="flex w-full items-center gap-3 rounded-[20px] px-4 py-3 text-left text-base font-semibold text-[var(--ink-700)] transition-all duration-300 hover:text-[var(--accent-700)] hover:[text-shadow:0_0_12px_rgba(196,122,61,0.16)]"
                      >
                        <ClipboardList className="h-5 w-5" />
                        <span>{t('header.dashboard')}</span>
                      </button>
                    )}

                    <button
                      onClick={handleSignOut}
                      type="button"
                      className="flex w-full items-center gap-3 rounded-[20px] px-4 py-3 text-left text-base font-semibold text-[#a04b39] transition-all duration-300 hover:text-[#c2614a] hover:[text-shadow:0_0_12px_rgba(194,97,74,0.16)]"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>{t('header.signOut')}</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => goTo('/login')}
                    type="button"
                    className="flex w-full items-center gap-3 rounded-[20px] px-4 py-3 text-left text-base font-semibold text-[var(--ink-700)] transition-all duration-300 hover:text-[var(--accent-700)] hover:[text-shadow:0_0_12px_rgba(196,122,61,0.16)]"
                  >
                    <User className="h-5 w-5" />
                    <span>{t('header.professionalLogin')}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
