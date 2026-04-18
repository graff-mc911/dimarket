import { useApp } from '../contexts/AppContext'

export function Footer() {
  const { t } = useApp()

  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-br from-orange-500 to-teal-500 p-2 rounded-lg">
                <div className="text-white font-bold text-xl">DI</div>
              </div>
              <span className="text-2xl font-bold">DImarket</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              {t('footer.tagline')}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.forClients')}</h3>
            <ul className="space-y-2">
              <li>
                <a href="/listings" className="text-gray-400 hover:text-white transition">
                  {t('footer.browseListings')}
                </a>
              </li>
              <li>
                <a href="/professionals" className="text-gray-400 hover:text-white transition">
                  {t('header.findProfessionals')}
                </a>
              </li>
              <li>
                <a href="/create-ad" className="text-gray-400 hover:text-white transition">
                  {t('footer.postRequest')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.forProfessionals')}</h3>
            <ul className="space-y-2">
              <li>
                <a href="/login" className="text-gray-400 hover:text-white transition">
                  {t('footer.signIn')}
                </a>
              </li>
              <li>
                <a href="/register" className="text-gray-400 hover:text-white transition">
                  {t('footer.register')}
                </a>
              </li>
              <li>
                <a href="/how-it-works" className="text-gray-400 hover:text-white transition">
                  {t('footer.howItWorks')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} DImarket. {t('footer.allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  )
}
