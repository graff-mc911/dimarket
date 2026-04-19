import { useEffect, useState } from 'react'
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

function AppContent() {
  // Зберігаємо поточний URL, щоб сторінка оновлювалась
  // без повного перезавантаження браузера
  const [currentUrl, setCurrentUrl] = useState(
    `${window.location.pathname}${window.location.search}`
  )

  useEffect(() => {
    // Відстежуємо зміну маршруту
    const handleRouteChange = () => {
      setCurrentUrl(`${window.location.pathname}${window.location.search}`)
    }

    window.addEventListener('popstate', handleRouteChange)

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [])

  // Беремо тільки шлях без query-параметрів
  const path = window.location.pathname

  const getPage = () => {
    switch (path) {
      case '/':
        return <Home />

      case '/professionals':
        return <Professionals />

      case '/listings':
        return <Listings />

      case '/create-ad':
        return <CreateAd />

      case '/login':
        return <Login />

      case '/register':
        return <Register />

      case '/dashboard':
        return <Dashboard />

      case '/settings':
        return <Settings />

      default:
        return <Home />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Панель навігації тепер показується на ВСІХ сторінках */}
      <Header key={`header-${currentUrl}`} />

      <main className="flex-1">
        {getPage()}
      </main>

      {/* Футер теж показується на всіх сторінках */}
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