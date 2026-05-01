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

  // Стани мобільного меню та випадаючих списків.
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currencyOpen, setCurrencyOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)

  // Рефи потрібні, щоб закривати меню при кліку поза ним.
  const languageRef = useRef<HTMLDivElement | null>(null)
  const currencyRef = useRef<HTMLDivElement | null>(null)
  const accountRef = useRef<HTMLDivElement | null>(null)

  const currentPath = window.location.pathname

  // Основні пункти навігації шапки.
  const navItems: NavItem[] = [
    { label: t('header.jobRequests'), path: '/listings', icon: ClipboardList },
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
    // Закриваємо dropdown, якщо користувач клікнув поза його областю.
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

    // Даємо можливість закрити меню клавішею Escape.
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
    // Коли мобільне меню відкрите, блокуємо прокрутку body,
    // щоб фон не рухався під меню.
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

  // Підсвічуємо активний пункт меню, якщо маршрут співпадає.
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
        ? 'bg-[rgba(148,163,184,0.18)] text-[#475569] shadow-[inset_0_0_0_1px_rgba(148,163,184,0.24)]'
        : 'text-[#5f5a54] hover:bg-white/55 hover:text-[#2f2a24]',
    ].join(' ')

  // Базовий стиль для кнопок керування праворуч у шапці.
  const controlButtonClass =
    'inline-flex items-center gap-2 rounded-full border border-white/40 bg-[rgba(255,255,255,0.34)] px-3 py-2 text-sm font-semibold text-[#4e4943] shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition hover:bg-[rgba(255,255,255,0.52)] hover:text-[#2f2a24]'

  // Випадаюче меню робимо холоднішим і прозорішим.
  const dropdownPanelClass =
    'absolute right-0 top-full mt-2 w-64 rounded-[24px] border border-white/45 bg-[rgba(244,246,248,0.78)] p-2 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl'

  // Панель мобільного меню теж переводимо в сіріший glass-стиль.
  const mobilePanelClass =
    'max-h-[calc(100vh-7.5rem)] overflow-y-auto rounded-[26px] border border-white/45 bg-[rgba(244,246,248,0.70)] p-3 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur-xl'

  const accountLabel = profile?.full_name || t('header.account')

  return (
    <header className="sticky top-0 z-50 w-full px-2 pt-2 md:px-4 md:pt-4">
      {/* Основний контейнер шапки.
          Саме тут прибрано теплий рожево-бежевий фон для десктопа. */}
      <div className="mx-auto max-w-7xl rounded-[30px] border border-white/45 bg-[rgba(244,246,248,0.68)] shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-2 px-3 py-3 md:gap-3 md:px-5">
          {/* Логотип і назва бренду */}
          <button
            onClick={() => goTo('/')}
            type="button"
            className="flex min-w-0 items-center gap-3 text-left"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] border border-white/45 bg-[linear-gradient(135deg,rgba(248,250,252,0.90),rgba(226,232,240,0.72))] text-[#64748b] shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
              <Hammer className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <div className="truncate text-lg font-extrabold leading-none text-[#2f2a24] sm:text-xl md:text-2xl">
                Dimarket
              </div>
              <div className="mt-1 hidden truncate text-[11px] font-medium uppercase tracking-[0.18em] text-[#8793a1] sm:block">
                {t('header.brandTagline')}
              </div>
            </div>
          </button>

          {/* Десктопна навігація */}
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

          {/* Правий блок керування на десктопі */}
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
                <ChevronDown className="h-4 w-4 text-[#94a3b8]" />
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
                          ? 'bg-[rgba(148,163,184,0.16)] text-[#475569]'
                          : 'text-[#5f5a54] hover:bg-white/55'
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
                <ChevronDown className="h-4 w-4 text-[#94a3b8]" />
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
                          ? 'bg-[rgba(148,163,184,0.16)] text-[#475569]'
                          : 'text-[#5f5a54] hover:bg-white/55'
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
                  <ChevronDown className="h-4 w-4 shrink-0 text-[#94a3b8]" />
                </button>

                {accountOpen && (
                  <div className={dropdownPanelClass}>
                    <button
                      onClick={() => goTo('/settings')}
                      type="button"
                      className="block w-full rounded-[18px] px-4 py-3 text-left text-sm font-semibold text-[#5f5a54] transition hover:bg-white/55"
                    >
                      {t('header.myProfile')}
                    </button>

                    <button
                      onClick={() => goTo('/dashboard')}
                      type="button"
                      className="block w-full rounded-[18px] px-4 py-3 text-left text-sm font-semibold text-[#5f5a54] transition hover:bg-white/55"
                    >
                      {t('header.dashboard')}
                    </button>

                    <div className="my-2 border-t border-[rgba(148,163,184,0.20)]" />

                    <button
                      onClick={handleSignOut}
                      type="button"
                      className="flex w-full items-center gap-2 rounded-[18px] px-4 py-3 text-left text-sm font-semibold text-[#b14e37] transition hover:bg-[rgba(255,238,232,0.72)]"
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

          {/* Мобільний правий блок */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => goTo('/create-ad')}
              type="button"
              aria-label={t('header.postJob')}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/45 bg-[rgba(148,163,184,0.16)] px-3 text-[#475569] shadow-[0_8px_24px_rgba(15,23,42,0.05)]"
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
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/45 bg-[rgba(255,255,255,0.34)] text-[#4e4943] shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Розкривне мобільне меню */}
        {mobileMenuOpen && (
          <div className="border-t border-white/45 px-3 pb-4 pt-3 lg:hidden">
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

              <div className="my-3 border-t border-[rgba(148,163,184,0.20)]" />

              <div className="grid gap-3 rounded-[24px] bg-[rgba(255,255,255,0.28)] p-3">
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
                    className="select-glass bg-white/50"
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
                    className="select-glass bg-white/50"
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

                    <button
                      onClick={() => goTo('/dashboard')}
                      type="button"
                      className={`${navButtonClass(isActiveRoute('/dashboard'))} w-full justify-start px-4 py-3 text-base`}
                    >
                      <ClipboardList className="h-5 w-5" />
                      <span>{t('header.dashboard')}</span>
                    </button>

                    <button
                      onClick={handleSignOut}
                      type="button"
                      className="flex w-full items-center gap-2 rounded-full px-4 py-3 text-left text-base font-semibold text-[#b14e37] transition hover:bg-[rgba(255,238,232,0.72)]"
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
