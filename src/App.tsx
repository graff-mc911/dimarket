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
  // Зберігаємо поточний шлях разом із query-параметрами,
  // щоб React перемальовував сторінку без повного reload
  const [currentUrl, setCurrentUrl] = useState(
    `${window.location.pathname}${window.location.search}`
  )

  useEffect(() => {
    // Оновлюємо адресу при внутрішній навігації
    const handleRouteChange = () => {
      setCurrentUrl(`${window.location.pathname}${window.location.search}`)
    }

    // Підтримка кнопок "назад" / "вперед"
    window.addEventListener('popstate', handleRouteChange)

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [])

  // Для вибору сторінки нам потрібен тільки pathname без query
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
        // Якщо шлях невідомий — повертаємо на головну
        return <Home />
    }
  }

  // На сторінках входу і реєстрації прибираємо шапку та футер,
  // щоб форма виглядала чисто і без зайвих блоків
  const hideHeaderFooter = path === '/login' || path === '/register'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!hideHeaderFooter && <Header key={`header-${currentUrl}`} />}

      <main className="flex-1">
        {getPage()}
      </main>

      {!hideHeaderFooter && <Footer />}
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