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
  User,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { CURRENCIES, LANGUAGES } from '../lib/types'
import { navigateTo } from '../lib/navigation'

interface NavItem {
  label: string
  path: string
  icon: LucideIcon
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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currencyOpen, setCurrencyOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)

  const languageRef = useRef<HTMLDivElement | null>(null)
  const currencyRef = useRef<HTMLDivElement | null>(null)
  const accountRef = useRef<HTMLDivElement | null>(null)

  const currentPath = window.location.pathname

  const navItems: NavItem[] = [
    { label: t('header.jobRequests'), path: '/listings', icon: ClipboardList },
    { label: t('header.findProfessionals'), path: '/professionals', icon: Hammer },
    { label: t('header.favorites'), path: '/favorites', icon: Heart },
    { label: t('header.messages'), path: '/messages', icon: MessageSquare },
  ]

  // Визначаємо, чи поточний користувач є власником сайту.
  const isSiteOwner = profile?.is_site_owner === true

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
    // Закриваємо випадні меню, якщо користувач клікнув поза ними.
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

    // Закриваємо всі меню клавішею Escape.
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
    // Коли відкрите мобільне меню, блокуємо прокрутку сторінки під ним.
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

  const navButtonClass = (active: boolean) =>
    [
      'inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200',
      active
        ? 'bg-[rgba(242,171,116,0.18)] text-[#9a5525] shadow-[inset_0_0_0_1px_rgba(212,138,82,0.24)]'
        : 'text-[#5f5a54] hover:bg-white/70 hover:text-[#2f2a24]',
    ].join(' ')

  const controlButtonClass =
    'inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/50 px-3 py-2 text-sm font-semibold text-[#4e4943] shadow-[0_8px_24px_rgba(95,76,59,0.06)] transition hover:bg-white/80 hover:text-[#2f2a24]'

  const dropdownPanelClass =
    'absolute right-0 top-full mt-2 w-64 rounded-[24px] border border-white/70 bg-[rgba(255,249,244,0.96)] p-2 shadow-[0_20px_50px_rgba(89,63,48,0.14)] backdrop-blur-xl'

  const mobilePanelClass =
    'max-h-[calc(100vh-7.5rem)] overflow-y-auto rounded-[26px] border border-white/70 bg-[rgba(255,250,246,0.76)] p-3 shadow-[0_18px_45px_rgba(89,63,48,0.08)] backdrop-blur-xl'

  const accountLabel = profile?.full_name || t('header.account')

  return (
    <header className="sticky top-0 z-50 w-full px-2 pt-2 md:px-4 md:pt-4">
      <div className="mx-auto max-w-7xl rounded-[30px] border border-white/70 bg-[rgba(252,246,240,0.82)] shadow-[0_18px_50px_rgba(89,63,48,0.08)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-2 px-3 py-3 md:gap-3 md:px-5">
          {/* Логотип і перехід на головну сторінку */}
          <button
            onClick={() => goTo('/')}
            type="button"
            className="flex min-w-0 items-center gap-3 text-left"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] border border-white/70 bg-[linear-gradient(135deg,rgba(255,243,231,0.95),rgba(247,201,156,0.72))] text-[#9c5c2b] shadow-[0_10px_24px_rgba(176,126,85,0.18)]">
              <Hammer className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <div className="truncate text-lg font-extrabold leading-none text-[#2f2a24] sm:text-xl md:text-2xl">
                Dimarket
              </div>
              <div className="mt-1 hidden truncate text-[11px] font-medium uppercase tracking-[0.18em] text-[#9d8b7a] sm:block">
                {t('header.brandTagline')}
              </div>
            </div>
          </button>

          {/* Десктопна навігація сайту */}
          <nav className="hidden items-center gap-1.5 lg:flex">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => goTo(item.path)}
                type="button"
                className={navButtonClass(isActiveRoute(item.path))}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Правий блок керування для десктопа */}
          <div className="hidden items-center gap-2 lg:flex">
            <div ref={languageRef} className="relative">
              <button
                onClick={() => {
                  setLanguageOpen((open) => !open)
                  setCurrencyOpen(false)
                  setAccountOpen(false)
                }}
                type="button"
                className={controlButtonClass}
              >
                <Globe className="h-4 w-4" />
                <span>{language.code.toUpperCase()}</span>
                <ChevronDown className="h-4 w-4 text-[#9d8b7a]" />
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
                      className={`block w-full rounded-[18px] px-4 py-3 text-left text-sm font-semibold transition ${
                        language.code === lang.code
                          ? 'bg-[rgba(242,171,116,0.16)] text-[#9a5525]'
                          : 'text-[#5f5a54] hover:bg-white/80'
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
                  setCurrencyOpen((open) => !open)
                  setLanguageOpen(false)
                  setAccountOpen(false)
                }}
                type="button"
                className={controlButtonClass}
              >
                <span className="text-base">{currency.symbol}</span>
                <span>{currency.code}</span>
                <ChevronDown className="h-4 w-4 text-[#9d8b7a]" />
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
                      className={`block w-full rounded-[18px] px-4 py-3 text-left text-sm font-semibold transition ${
                        currency.code === curr.code
                          ? 'bg-[rgba(242,171,116,0.16)] text-[#9a5525]'
                          : 'text-[#5f5a54] hover:bg-white/80'
                      }`}
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
                  className={`${controlButtonClass} max-w-[220px]`}
                >
                  <User className="h-4 w-4" />
                  <span className="truncate">{accountLabel}</span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-[#9d8b7a]" />
                </button>

                {accountOpen && (
                  <div className={dropdownPanelClass}>
                    <button
                      onClick={() => goTo('/settings')}
                      type="button"
                      className="block w-full rounded-[18px] px-4 py-3 text-left text-sm font-semibold text-[#5f5a54] transition hover:bg-white/80"
                    >
                      {t('header.myProfile')}
                    </button>

                    {/* Посилання на owner-кабінет показуємо тільки власнику сайту. */}
                    {isSiteOwner && (
                      <button
                        onClick={() => goTo('/dashboard')}
                        type="button"
                        className="block w-full rounded-[18px] px-4 py-3 text-left text-sm font-semibold text-[#5f5a54] transition hover:bg-white/80"
                      >
                        {t('header.dashboard')}
                      </button>
                    )}

                    <div className="my-2 border-t border-[rgba(190,168,150,0.35)]" />

                    <button
                      onClick={handleSignOut}
                      type="button"
                      className="flex w-full items-center gap-2 rounded-[18px] px-4 py-3 text-left text-sm font-semibold text-[#b14e37] transition hover:bg-[rgba(255,238,232,0.92)]"
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
                className={navButtonClass(isActiveRoute('/login'))}
              >
                {t('header.professionalLogin')}
              </button>
            )}

            <button
              onClick={() => goTo('/create-ad')}
              type="button"
              className="btn-primary rounded-full px-5 py-3"
            >
              <PlusCircle className="h-4 w-4" />
              {t('header.postJob')}
            </button>
          </div>

          {/* Кнопки мобільного керування */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => goTo('/create-ad')}
              type="button"
              aria-label={t('header.postJob')}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/70 bg-[rgba(242,171,116,0.18)] px-3 text-[#9a5525] shadow-[0_8px_24px_rgba(176,126,85,0.12)]"
            >
              <PlusCircle className="h-5 w-5" />
              <span className="hidden text-sm font-semibold min-[380px]:inline">
                {t('header.postJob')}
              </span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen((open) => !open)
                closeDropdowns()
              }}
              type="button"
              aria-expanded={mobileMenuOpen}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/55 text-[#4e4943] shadow-[0_8px_24px_rgba(95,76,59,0.06)]"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Випадаюча мобільна панель навігації */}
        {mobileMenuOpen && (
          <div className="border-t border-white/70 px-3 pb-4 pt-3 lg:hidden">
            <div className={mobilePanelClass}>
              <div className="grid gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => goTo(item.path)}
                    type="button"
                    className={`${navButtonClass(isActiveRoute(item.path))} w-full justify-start px-4 py-3 text-base`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="my-3 border-t border-[rgba(190,168,150,0.35)]" />

              <div className="grid gap-3 rounded-[24px] bg-white/45 p-3">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-bold text-[#5f5a54]">
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
                    className="select-glass bg-white/80"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-bold text-[#5f5a54]">
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
                    className="select-glass bg-white/80"
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
                      className={`${navButtonClass(isActiveRoute('/settings'))} w-full justify-start px-4 py-3 text-base`}
                    >
                      <User className="h-5 w-5" />
                      <span>{t('header.myProfile')}</span>
                    </button>

                    {/* У мобільному меню owner-кабінет теж показуємо тільки власнику сайту. */}
                    {isSiteOwner && (
                      <button
                        onClick={() => goTo('/dashboard')}
                        type="button"
                        className={`${navButtonClass(isActiveRoute('/dashboard'))} w-full justify-start px-4 py-3 text-base`}
                      >
                        <ClipboardList className="h-5 w-5" />
                        <span>{t('header.dashboard')}</span>
                      </button>
                    )}

                    <button
                      onClick={handleSignOut}
                      type="button"
                      className="flex w-full items-center gap-2 rounded-full px-4 py-3 text-left text-base font-semibold text-[#b14e37] transition hover:bg-[rgba(255,238,232,0.92)]"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>{t('header.signOut')}</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => goTo('/login')}
                    type="button"
                    className={`${navButtonClass(isActiveRoute('/login'))} w-full justify-start px-4 py-3 text-base`}
                  >
                    <User className="h-5 w-5" />
                    <span>{t('header.professionalLogin')}</span>
                  </button>
                )}

                <button
                  onClick={() => goTo('/create-ad')}
                  type="button"
                  className="btn-primary mt-1 w-full justify-center rounded-full py-3 text-base"
                >
                  <PlusCircle className="h-5 w-5" />
                  {t('header.postJob')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
