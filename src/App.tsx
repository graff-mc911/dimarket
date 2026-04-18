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

function App() {
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

  const hideHeaderFooter = ['/login', '/register'].includes(path)

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {!hideHeaderFooter && <Header />}
        <main className="flex-1">
          {getPage()}
        </main>
        {!hideHeaderFooter && <Footer />}
      </div>
    </AppProvider>
  )
}

export default App
