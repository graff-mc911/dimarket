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
import { Favorites } from './pages/Favorites'

function AppContent() {
  // Зберігаємо поточну адресу сторінки в стані.
  // Це потрібно, бо ми використовуємо власну просту навігацію без react-router.
  const [currentUrl, setCurrentUrl] = useState(
    `${window.location.pathname}${window.location.search}`
  )

  useEffect(() => {
    // Оновлюємо стан, коли користувач переходить між сторінками
    // або натискає кнопки браузера "назад / вперед".
    const handleRouteChange = () => {
      setCurrentUrl(`${window.location.pathname}${window.location.search}`)
    }

    window.addEventListener('popstate', handleRouteChange)

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [])

  // Беремо pathname саме з currentUrl, а не напряму з window.location.
  // Так React стабільно перемальовує сторінку після navigateTo().
  const path = useMemo(() => {
    return currentUrl.split('?')[0] || '/'
  }, [currentUrl])

  const page = useMemo(() => {
    // Головна сторінка
    if (path === '/') {
      return <Home />
    }

    // Сторінка пошуку майстрів
    if (path === '/professionals') {
      return <Professionals />
    }

    // Тимчасова підтримка майбутньої сторінки окремого майстра.
    // Зараз окремої сторінки ще немає, тому показуємо список майстрів,
    // щоб користувач не потрапляв на пусту або неправильну сторінку.
    if (path.startsWith('/professional/')) {
      return <Professionals />
    }

    // Список заявок / оголошень
    if (path === '/listings') {
      return <Listings />
    }

    // Тимчасова підтримка майбутньої сторінки окремого оголошення.
    if (path.startsWith('/listing/')) {
      return <Listings />
    }

    // Створення заявки
    if (path === '/create-ad') {
      return <CreateAd />
    }

    // Обране
    if (path === '/favorites') {
      return <Favorites />
    }

    // Вхід
    if (path === '/login') {
      return <Login />
    }

    // Реєстрація
    if (path === '/register') {
      return <Register />
    }

    // Кабінет користувача
    if (path === '/dashboard') {
      return <Dashboard />
    }

    // Налаштування / профіль
    if (path === '/settings') {
      return <Settings />
    }

    // Якщо маршрут невідомий — показуємо головну.
    // Пізніше можна зробити окрему сторінку 404.
    return <Home />
  }, [path])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      {/* key потрібен, щоб Header оновлював активні стани після переходів */}
      <Header key={`header-${currentUrl}`} />

      <main className="flex-1 w-full">
        {page}
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