import { navigateTo } from '../lib/navigation'
import { useApp } from '../contexts/AppContext'
import { FooterStats } from './FooterStats'
import { Logo } from './Logo'

export function Footer() {
  const { t } = useApp()

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-950 text-white mt-auto w-full">
      <div className="w-full px-4 md:px-6 xl:px-8 2xl:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Блок бренду Dimarket */}
          <div>
            <button
              onClick={() => navigateTo('/')}
              type="button"
              className="mb-4"
            >
              <Logo size="lg" className="[&>span]:text-white" />
            </button>

            <p className="text-gray-400 leading-relaxed max-w-md">
              Dimarket — міжнародна безкоштовна платформа для будівельних послуг.
              Клієнт створює заявку, майстри відповідають, сторони домовляються напряму.
            </p>

            <p className="text-orange-400 font-semibold mt-4">
              Без комісій. Без підписок. Заробіток тільки з реклами.
            </p>
          </div>

          {/* Основні розділи платформи */}
          <div>
            <h3 className="font-semibold mb-4 text-white">
              Платформа
            </h3>

            <ul className="space-y-2 text-gray-400">
              <li>
                <button
                  onClick={() => navigateTo('/listings')}
                  type="button"
                  className="hover:text-white transition"
                >
                  Заявки на роботи
                </button>
              </li>

              <li>
                <button
                  onClick={() => navigateTo('/professionals')}
                  type="button"
                  className="hover:text-white transition"
                >
                  {t('header.findProfessionals')}
                </button>
              </li>

              <li>
                <button
                  onClick={() => navigateTo('/create-ad')}
                  type="button"
                  className="hover:text-white transition"
                >
                  Створити заявку
                </button>
              </li>

              <li>
                <button
                  onClick={() => navigateTo('/favorites')}
                  type="button"
                  className="hover:text-white transition"
                >
                  Обране
                </button>
              </li>
            </ul>
          </div>

          {/* Кабінет користувача */}
          <div>
            <h3 className="font-semibold mb-4 text-white">
              Акаунт
            </h3>

            <ul className="space-y-2 text-gray-400">
              <li>
                <button
                  onClick={() => navigateTo('/login')}
                  type="button"
                  className="hover:text-white transition"
                >
                  {t('footer.signIn')}
                </button>
              </li>

              <li>
                <button
                  onClick={() => navigateTo('/register')}
                  type="button"
                  className="hover:text-white transition"
                >
                  {t('footer.register')}
                </button>
              </li>

              <li>
                <button
                  onClick={() => navigateTo('/settings')}
                  type="button"
                  className="hover:text-white transition"
                >
                  {t('header.myProfile')}
                </button>
              </li>

              <li>
                <button
                  onClick={() => navigateTo('/dashboard')}
                  type="button"
                  className="hover:text-white transition"
                >
                  {t('header.dashboard')}
                </button>
              </li>
            </ul>
          </div>

          {/* Реклама як єдина монетизація */}
          <div>
            <h3 className="font-semibold mb-4 text-white">
              Реклама
            </h3>

            <ul className="space-y-2 text-gray-400">
              <li>Банери для будівельних компаній</li>
              <li>Реклама інструментів і матеріалів</li>
              <li>Локальна реклама по містах і країнах</li>
              <li>Dimarket © {currentYear}</li>
            </ul>
          </div>
        </div>

        {/* Жива статистика платформи */}
        <FooterStats />

        {/* Нижня лінія футера */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-sm text-gray-400 flex flex-col md:flex-row md:justify-between gap-2">
          <span>
            © {currentYear} Dimarket. {t('footer.allRightsReserved')}
          </span>

          <span>
            Global free construction services marketplace
          </span>
        </div>
      </div>
    </footer>
  )
}