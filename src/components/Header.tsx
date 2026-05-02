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

const OWNER_EMAIL = 'ivan.sovban@gmail.com'

function isOwnerEmail(email: string | null | undefined) {
  // Тимчасово страхуємо owner-доступ по email,
  // якщо прапорець у базі ще не синхронізувався.
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

  // Окремо тримаємо запит пошуку,
  // щоб шапка працювала як нормальний глобальний пошук по сайту.
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

  // Прибираємо грубу кнопку "Запити на роботу" з шапки.
  // Залишаємо тільки найважливіші текстові переходи.
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
    // Закриваємо випадаючі меню, якщо користувач натиснув поза ними.
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

    // Закриваємо всі відкриті меню клавішею Escape.
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
    // На мобільному блокуємо прокрутку сторінки під відкритим меню.
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

    // Якщо запит пустий, просто відкриваємо сторінку оголошень.
    if (!query) {
      navigateTo('/listings')
      return
    }

    navigateTo(`/listings?search=${encodeURIComponent(query)}`)
  }

  const navTextClass = (active: boolean) =>
    [
      'relative inline-flex items-center gap-2 pb-2 text-sm font-semibold transition-all duration-300',
      active ? 'text-[#8d5636]' : 'text-[#5c4d41] hover:text-[#241b14]',
    ].join(' ')

  const controlButtonClass =
    'inline-flex items-center gap-2 rounded-full bg-[rgba(255,252,247,0.86)] px-3.5 py-2.5 text-sm font-semibold text-[#4b3c31] transition-all duration-300 hover:bg-white hover:text-[#241b14]'

  const dropdownPanelClass =
    'absolute right-0 top-full mt-3 w-64 rounded-[26px] border border-white/85 bg-[rgba(255,252,248,0.96)] p-2.5 shadow-[0_26px_60px_rgba(67,44,26,0.14)] backdrop-blur-xl'

  const mobilePanelClass =
    'max-h-[calc(100vh-8rem)] overflow-y-auto rounded-[28px] border border-white/85 bg-[rgba(255,252,248,0.92)] p-3 shadow-[0_22px_54px_rgba(67,44,26,0.12)] backdrop-blur-xl'

  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-3 md:px-5 md:pt-5">
      {/* Шапку робимо широкою, легкою і дворядною,
          щоб і навігація, і пошук жили акуратно без грубих кнопок. */}
      <div className="w-full rounded-[34px] border border-white/80 bg-[rgba(255,252,247,0.82)] shadow-[0_24px_60px_rgba(67,44,26,0.10)] backdrop-blur-xl">
        <div className="px-4 py-4 md:px-6">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => goTo('/')}
              type="button"
              className="min-w-0 text-left"
            >
              <Logo size="md" />
            </button>

            {/* На десктопі пошук ставимо прямо в шапку,
                щоб він замінив окрему грубу кнопку переходу до оголошень. */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden min-w-0 flex-1 items-center xl:flex xl:max-w-[620px]"
            >
              <div className="relative w-full">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#a08b79]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Пошук по сайту"
                  className="input-glass h-12 rounded-full pl-11 pr-4"
                />
              </div>
            </form>

            <div className="hidden items-center gap-1 xl:flex">
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
                            ? 'bg-[rgba(169,105,66,0.12)] text-[#8d5636]'
                            : 'text-[#5c4d41] hover:bg-[rgba(255,248,241,0.92)]'
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
                            ? 'bg-[rgba(169,105,66,0.12)] text-[#8d5636]'
                            : 'text-[#5c4d41] hover:bg-[rgba(255,248,241,0.92)]'
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
                    className={`${controlButtonClass} max-w-[240px]`}
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
                        className="block w-full rounded-[18px] px-4 py-3 text-left text-sm font-semibold text-[#5c4d41] transition hover:bg-[rgba(255,248,241,0.92)]"
                      >
                        {t('header.myProfile')}
                      </button>

                      {isSiteOwner && (
                        <button
                          onClick={() => goTo('/dashboard')}
                          type="button"
                          className="block w-full rounded-[18px] px-4 py-3 text-left text-sm font-semibold text-[#5c4d41] transition hover:bg-[rgba(255,248,241,0.92)]"
                        >
                          {t('header.dashboard')}
                        </button>
                      )}

                      <div className="my-2 border-t border-[rgba(142,115,88,0.14)]" />

                      <button
                        onClick={handleSignOut}
                        type="button"
                        className="flex w-full items-center gap-2 rounded-[18px] px-4 py-3 text-left text-sm font-semibold text-[#a04b39] transition hover:bg-[rgba(255,239,235,0.92)]"
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
                  className="text-sm font-semibold text-[#5c4d41] transition hover:text-[#241b14]"
                >
                  {t('header.professionalLogin')}
                </button>
              )}

              {/* Головну action-кнопку робимо м’якшою і чистішою по формі. */}
              <button
                onClick={() => goTo('/create-ad')}
                type="button"
                className="btn-primary px-5 py-3"
              >
                <PlusCircle className="h-4 w-4" />
                Додати оголошення
              </button>
            </div>

            <div className="flex items-center gap-2 xl:hidden">
              <button
                onClick={() => goTo('/create-ad')}
                type="button"
                aria-label="Додати оголошення"
                className="btn-primary h-11 px-3 sm:px-4"
              >
                <PlusCircle className="h-5 w-5" />
                <span className="hidden text-sm min-[390px]:inline">
                  Додати оголошення
                </span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen((open) => !open)
                  closeDropdowns()
                }}
                type="button"
                aria-expanded={mobileMenuOpen}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(255,252,247,0.86)] text-[#4b3c31] shadow-[0_12px_30px_rgba(67,44,26,0.06)]"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Другий рядок шапки — спокійна текстова навігація без обводок і коробок. */}
          <div className="mt-4 hidden items-end justify-between gap-6 border-t border-[rgba(142,115,88,0.10)] pt-4 xl:flex">
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
                    className={`absolute bottom-0 left-0 h-[2px] rounded-full bg-[#8d5636] transition-all duration-300 ${
                      isActiveRoute(item.path) ? 'w-full opacity-100' : 'w-0 opacity-0'
                    }`}
                  />
                </button>
              ))}
            </nav>

            <button
              onClick={() => goTo('/listings')}
              type="button"
              className="text-sm font-semibold text-[#8b7868] transition hover:text-[#241b14]"
            >
              Усі оголошення
            </button>
          </div>

          {/* На мобільному теж показуємо пошук окремим чистим рядком. */}
          <form onSubmit={handleSearchSubmit} className="mt-4 xl:hidden">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#a08b79]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Пошук по сайту"
                className="input-glass h-12 rounded-full pl-11 pr-4"
              />
            </div>
          </form>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-[rgba(142,115,88,0.10)] px-3 pb-4 pt-3 xl:hidden">
            <div className={mobilePanelClass}>
              <div className="grid gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => goTo(item.path)}
                    type="button"
                    className="flex w-full items-center gap-3 rounded-[20px] px-4 py-3 text-left text-base font-semibold text-[#4b3c31] transition hover:bg-[rgba(255,247,240,0.90)]"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                ))}

                <button
                  onClick={() => goTo('/listings')}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-[20px] px-4 py-3 text-left text-base font-semibold text-[#4b3c31] transition hover:bg-[rgba(255,247,240,0.90)]"
                >
                  <Search className="h-5 w-5" />
                  <span>Усі оголошення</span>
                </button>
              </div>

              <div className="my-3 border-t border-[rgba(142,115,88,0.12)]" />

              <div className="grid gap-3 rounded-[24px] bg-[rgba(255,249,243,0.88)] p-3">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-bold text-[#5c4d41]">
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
                  <label className="mb-2 flex items-center gap-2 text-sm font-bold text-[#5c4d41]">
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
                      className="flex w-full items-center gap-3 rounded-[20px] px-4 py-3 text-left text-base font-semibold text-[#4b3c31] transition hover:bg-[rgba(255,247,240,0.90)]"
                    >
                      <User className="h-5 w-5" />
                      <span>{t('header.myProfile')}</span>
                    </button>

                    {isSiteOwner && (
                      <button
                        onClick={() => goTo('/dashboard')}
                        type="button"
                        className="flex w-full items-center gap-3 rounded-[20px] px-4 py-3 text-left text-base font-semibold text-[#4b3c31] transition hover:bg-[rgba(255,247,240,0.90)]"
                      >
                        <ClipboardList className="h-5 w-5" />
                        <span>{t('header.dashboard')}</span>
                      </button>
                    )}

                    <button
                      onClick={handleSignOut}
                      type="button"
                      className="flex w-full items-center gap-3 rounded-[20px] px-4 py-3 text-left text-base font-semibold text-[#a04b39] transition hover:bg-[rgba(255,239,235,0.92)]"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>{t('header.signOut')}</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => goTo('/login')}
                    type="button"
                    className="flex w-full items-center gap-3 rounded-[20px] px-4 py-3 text-left text-base font-semibold text-[#4b3c31] transition hover:bg-[rgba(255,247,240,0.90)]"
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
