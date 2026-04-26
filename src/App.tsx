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
import { Favorites } from './pages/Favorites'

function AppContent() {
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

      case '/favorites':
        return <Favorites />

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
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      <Header key={`header-${currentUrl}`} />

      <main className="flex-1 w-full">
        {getPage()}
      </main>

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