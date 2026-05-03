/**
 * Кореневий компонент: макет (шапка + контент + підвал) і простий роутинг за URL.
 *
 * Роутинг побудований на `pathname` + слухач `popstate`, бо проєкт використовує
 * власну функцію navigateTo() замість react-router. Шлях беремо зі стану `currentUrl`,
 * щоб гарантовано перемальовуватися після кожного navigateTo().
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

/** Нормалізуємо шлях: без зайвого слеша в кінці (крім кореня `/`) */
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
      // key: при зміні query (?search=) перечитуємо фільтр з URL (навіть без повного remount маршруту)
      return <Listings key={currentUrl} />
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

    // Динамічні маршрути: картки майстрів та оголошень
    const listingMatch = path.match(/^\/listing\/([^/]+)$/)
    if (listingMatch) {
      return <ListingDetail listingId={listingMatch[1]} />
    }

    const professionalMatch = path.match(/^\/professional\/([^/]+)$/)
    if (professionalMatch) {
      return <ProfessionalDetail profileId={professionalMatch[1]} />
    }

    // Невідомий шлях — повертаємо на головну (м’яко, без втрати шапки/підвалу)
    return <Home />
  }, [path, currentUrl])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      {/* key змушує шапку коректно підхоплювати зміну маршруту, якщо з’являться локальні стани */}
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