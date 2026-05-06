/**
 * Кореневий компонент: шапка, контент, підвал і простий роутинг за URL + navigateTo().
 */
import { useEffect, useMemo, useState } from 'react'
import { AppProvider } from './contexts/AppContext'
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
import { ListingDetail } from './pages/ListingDetail'
import { ProfessionalDetail } from './pages/ProfessionalDetail'
import { Favorites } from './pages/Favorites'
import { Messages } from './pages/Messages'
import { Contact } from './pages/Contact'
import { Advertising } from './pages/Advertising'

function normalizePathname(raw: string): string {
  if (raw === '/' || raw.length <= 1) {
    return raw || '/'
  }

  return raw.endsWith('/') ? raw.slice(0, -1) : raw
}

function AppContent() {
  const [currentUrl, setCurrentUrl] = useState(
    () => `${window.location.pathname}${window.location.search}`
  )

  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentUrl(`${window.location.pathname}${window.location.search}`)
    }

    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [])

  const path = useMemo(() => {
    const pathnameOnly = currentUrl.split('?')[0] || '/'
    return normalizePathname(pathnameOnly)
  }, [currentUrl])

  const page = useMemo(() => {
    if (path === '/') {
      return <Home />
    }

    if (path === '/professionals') {
      return <Professionals />
    }

    if (path === '/listings') {
      return <Listings key={currentUrl} />
    }

    if (path === '/favorites') {
      return <Favorites />
    }

    if (path === '/messages') {
      return <Messages />
    }

    if (path === '/create-ad') {
      return <CreateAd />
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

    if (path === '/contact') {
      return <Contact />
    }

    if (path === '/advertise') {
      return <Advertising />
    }

    const listingMatch = path.match(/^\/listing\/([^/]+)$/)
    if (listingMatch) {
      return <ListingDetail listingId={listingMatch[1]} />
    }

    const professionalMatch = path.match(/^\/professional\/([^/]+)$/)
    if (professionalMatch) {
      return <ProfessionalDetail profileId={professionalMatch[1]} />
    }

    return <Home />
  }, [path, currentUrl])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      <Header key={`header-${currentUrl}`} />

      <main className="flex-1 w-full max-w-[100vw] overflow-x-hidden">{page}</main>

      <Footer />
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