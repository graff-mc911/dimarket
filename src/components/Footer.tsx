import { navigateTo } from '../lib/navigation'
import { FooterStats } from './FooterStats'

export function Footer() {
  return (
    <footer className="bg-gray-950 text-white mt-auto w-full">
      <div className="w-full px-4 md:px-6 xl:px-8 2xl:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <button
              onClick={() => navigateTo('/')}
              type="button"
              className="flex items-center space-x-2 mb-4"
            >
              <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-lg">
                <div className="text-white font-bold text-xl">DI</div>
              </div>

              <span className="text-2xl font-bold">Dimarket</span>
            </button>

            <p className="text-gray-400 leading-relaxed">
              Dimarket — платформа для пошуку майстрів, послуг, матеріалів та оголошень у сфері ремонту, будівництва і побутових робіт.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Платформа</h3>

            <ul className="space-y-2 text-gray-400">
              <li>
                <button onClick={() => navigateTo('/listings')} type="button" className="hover:text-white transition">
                  Огляд оголошень
                </button>
              </li>

              <li>
                <button onClick={() => navigateTo('/professionals')} type="button" className="hover:text-white transition">
                  Знайти майстрів
                </button>
              </li>

              <li>
                <button onClick={() => navigateTo('/create-ad')} type="button" className="hover:text-white transition">
                  Створити оголошення
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Акаунт</h3>

            <ul className="space-y-2 text-gray-400">
              <li>
                <button onClick={() => navigateTo('/login')} type="button" className="hover:text-white transition">
                  Увійти
                </button>
              </li>

              <li>
                <button onClick={() => navigateTo('/register')} type="button" className="hover:text-white transition">
                  Зареєструватися
                </button>
              </li>

              <li>
                <button onClick={() => navigateTo('/settings')} type="button" className="hover:text-white transition">
                  Мій профіль
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Інформація</h3>

            <ul className="space-y-2 text-gray-400">
              <li>Усі права захищені</li>
              <li>Жива статистика платформи</li>
              <li>Dimarket © {new Date().getFullYear()}</li>
            </ul>
          </div>
        </div>

        <FooterStats />

        <div className="border-t border-gray-800 mt-8 pt-6 text-sm text-gray-400 flex flex-col md:flex-row md:justify-between gap-2">
          <span>© {new Date().getFullYear()} Dimarket. Усі права захищені.</span>
          <span>Платформа для майстрів, клієнтів і оголошень</span>
        </div>
      </div>
    </footer>
  )
}