import { useApp } from '../contexts/AppContext'
import { navigateTo } from '../lib/navigation'
import { FooterStats } from './FooterStats'

export function Footer() {
  const { t } = useApp()

  return (
    <footer className="bg-gray-900 text-white mt-auto w-full">
      {/* 
        Повноширинний контейнер футера.
        Саме тут ми робимо футер не вузьким, а широким по всій сторінці.
      */}
      <div className="w-full px-4 md:px-6 xl:px-8 2xl:px-10 py-12">
        {/* 
          Верхня частина футера:
          - бренд
          - навігація
          - посилання для клієнтів
          - посилання для майстрів
        */}
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
              <span className="text-2xl font-bold">DImarket</span>
            </button>

            <p className="text-gray-400 mb-4">
              {t('footer.description')}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('footer.platform')}</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button onClick={() => navigateTo('/listings')} type="button" className="hover:text-white transition">
                  {t('header.browse')}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/professionals')} type="button" className="hover:text-white transition">
                  {t('header.findProfessionals')}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/create-ad')} type="button" className="hover:text-white transition">
                  {t('header.createAd')}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('footer.account')}</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button onClick={() => navigateTo('/login')} type="button" className="hover:text-white transition">
                  {t('login.title')}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/register')} type="button" className="hover:text-white transition">
                  {t('register.title')}
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('/settings')} type="button" className="hover:text-white transition">
                  {t('header.myProfile')}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('footer.legal')}</h3>
            <ul className="space-y-2 text-gray-400">
              <li>{t('footer.rights')}</li>
              <li>Статистика платформи</li>
            </ul>
          </div>
        </div>

        {/* 
          Ось тут підключається новий блок статистики.
          Саме він показує:
          - відвідування
          - створені оголошення
          - спрацювали оголошення
          - майстрів
          - рейтинг по країнах
        */}
        <FooterStats />

        {/* Нижній рядок футера */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-sm text-gray-400 flex flex-col md:flex-row md:justify-between gap-2">
          <span>{t('footer.rights')}</span>
          <span>Реальна статистика DImarket</span>
        </div>
      </div>
    </footer>
  )
}