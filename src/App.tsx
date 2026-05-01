import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  ClipboardList,
  MessageSquare,
  UserRound,
  type LucideIcon,
} from 'lucide-react'
import { AppProvider, useApp } from './contexts/AppContext'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Home } from './pages/Home'
import { Professionals } from './pages/Professionals'
import { Listings } from './pages/Listings'
import { CreateAd } from './pages/CreateAd'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { Settings } from './pages/Settings'
import { Favorites } from './pages/Favorites'
import { Advertising } from './pages/Advertising'
import { navigateTo } from './lib/navigation'

function AppContent() {
  const { t } = useApp()

  const [currentUrl, setCurrentUrl] = useState(
    `${window.location.pathname}${window.location.search}`
  )

  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentUrl(`${window.location.pathname}${window.location.search}`)
    }

    window.addEventListener('popstate', handleRouteChange)

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [])

  const path = useMemo(() => {
    return currentUrl.split('?')[0] || '/'
  }, [currentUrl])

  const page = useMemo(() => {
    if (path === '/') {
      return <Home />
    }

    if (path === '/professionals') {
      return <Professionals />
    }

    if (path.startsWith('/professional/')) {
      return (
        <RoutePlaceholder
          icon={UserRound}
          eyebrow={t('route.professionalProfileEyebrow')}
          title={t('route.professionalProfileTitle')}
          description={t('route.professionalProfileDescription')}
          primaryLabel={t('header.findProfessionals')}
          primaryPath="/professionals"
          secondaryLabel={t('header.createAd')}
          secondaryPath="/create-ad"
        />
      )
    }

    if (path === '/listings') {
      return <Listings />
    }

    if (path.startsWith('/listing/')) {
      return (
        <RoutePlaceholder
          icon={ClipboardList}
          eyebrow={t('route.jobRequestEyebrow')}
          title={t('route.jobRequestTitle')}
          description={t('route.jobRequestDescription')}
          primaryLabel={t('home.viewAllListings')}
          primaryPath="/listings"
          secondaryLabel={t('header.createAd')}
          secondaryPath="/create-ad"
        />
      )
    }

    if (path === '/create-ad') {
      return <CreateAd />
    }

    if (path === '/favorites') {
      return <Favorites />
    }

    if (path === '/messages') {
      return (
        <RoutePlaceholder
          icon={MessageSquare}
          eyebrow={t('route.messagesEyebrow')}
          title={t('route.messagesTitle')}
          description={t('route.messagesDescription')}
          primaryLabel={t('header.dashboard')}
          primaryPath="/dashboard"
          secondaryLabel={t('header.findProfessionals')}
          secondaryPath="/professionals"
        />
      )
    }

    if (path === '/login') {
      return <Login />
    }

    if (path === '/register') {
      return <Register />
    }

    if (path === '/dashboard') {
      return <Dashboard />
    }

    if (path === '/settings') {
      return <Settings />
    }

    if (path === '/advertise') {
      return <Advertising />
    }

    return (
      <RoutePlaceholder
        icon={AlertCircle}
        eyebrow={t('route.notFoundEyebrow')}
        title={t('route.notFoundTitle')}
        description={t('route.notFoundDescription')}
        primaryLabel={t('home.search')}
        primaryPath="/"
        secondaryLabel={t('home.viewAllListings')}
        secondaryPath="/listings"
      />
    )
  }, [path, t])

  return (
    <div className="min-h-screen bg-[#e3e6ea] flex flex-col w-full">

      <Header key={`header-${currentUrl}`} />

      <main className="flex-1 w-full">
        {page}
      </main>

      <Footer />
    </div>
  )
}

interface RoutePlaceholderProps {
  icon: LucideIcon
  eyebrow: string
  title: string
  description: string
  primaryLabel: string
  primaryPath: string
  secondaryLabel?: string
  secondaryPath?: string
}

function RoutePlaceholder({
  icon: Icon,
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryPath,
  secondaryLabel,
  secondaryPath,
}: RoutePlaceholderProps) {
  return (
    <div className="page-bg min-h-[calc(100vh-12rem)] px-4 py-10 md:px-6 xl:px-8 2xl:px-10">
      <div className="mx-auto flex max-w-3xl items-center justify-center">
        <section className="glass-panel w-full p-6 text-center md:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[rgba(245,166,109,0.18)] text-[#c96d2c] shadow-soft">
            <Icon className="h-8 w-8" />
          </div>

          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.22em] text-[#b17a58]">
            {eyebrow}
          </p>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#2f2a24] md:text-4xl">
            {title}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#6f665d] md:text-lg">
            {description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => navigateTo(primaryPath)}
              type="button"
              className="btn-primary"
            >
              {primaryLabel}
            </button>

            {secondaryLabel && secondaryPath && (
              <button
                onClick={() => navigateTo(secondaryPath)}
                type="button"
                className="btn-secondary"
              >
                {secondaryLabel}
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App
