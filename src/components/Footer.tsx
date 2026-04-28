import { navigateTo } from '../lib/navigation'
import { useApp } from '../contexts/AppContext'
import { FooterStats } from './FooterStats'
import { Logo } from './Logo'

export function Footer() {
  const { t } = useApp()

  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto w-full bg-gray-950 text-white">
      <div className="w-full px-4 py-12 md:px-6 xl:px-8 2xl:px-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <button
              onClick={() => navigateTo('/')}
              type="button"
              className="mb-4"
            >
              <Logo size="lg" className="[&>span]:text-white" />
            </button>

            <p className="max-w-md leading-relaxed text-gray-400">
              {t('footer.brandText')}
            </p>

            <p className="mt-4 font-semibold text-orange-400">
              {t('footer.monetization')}
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">
              {t('footer.platformTitleSimple')}
            </h3>

            <ul className="space-y-2 text-gray-400">
              <li>
                <button
                  onClick={() => navigateTo('/listings')}
                  type="button"
                  className="transition hover:text-white"
                >
                  {t('header.jobRequests')}
                </button>
              </li>

              <li>
                <button
                  onClick={() => navigateTo('/professionals')}
                  type="button"
                  className="transition hover:text-white"
                >
                  {t('header.findProfessionals')}
                </button>
              </li>

              <li>
                <button
                  onClick={() => navigateTo('/create-ad')}
                  type="button"
                  className="transition hover:text-white"
                >
                  {t('header.postJob')}
                </button>
              </li>

              <li>
                <button
                  onClick={() => navigateTo('/favorites')}
                  type="button"
                  className="transition hover:text-white"
                >
                  {t('header.favorites')}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">
              {t('footer.accountTitleSimple')}
            </h3>

            <ul className="space-y-2 text-gray-400">
              <li>
                <button
                  onClick={() => navigateTo('/login')}
                  type="button"
                  className="transition hover:text-white"
                >
                  {t('footer.signIn')}
                </button>
              </li>

              <li>
                <button
                  onClick={() => navigateTo('/register')}
                  type="button"
                  className="transition hover:text-white"
                >
                  {t('footer.register')}
                </button>
              </li>

              <li>
                <button
                  onClick={() => navigateTo('/settings')}
                  type="button"
                  className="transition hover:text-white"
                >
                  {t('header.myProfile')}
                </button>
              </li>

              <li>
                <button
                  onClick={() => navigateTo('/dashboard')}
                  type="button"
                  className="transition hover:text-white"
                >
                  {t('header.dashboard')}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">
              {t('footer.adsTitle')}
            </h3>

            <p className="leading-relaxed text-gray-400">
              {t('footer.adsText')}
            </p>

            <button
              onClick={() => navigateTo('/advertise')}
              type="button"
              className="mt-4 text-sm font-semibold text-orange-400 transition hover:text-orange-300"
            >
              {t('footer.adsButton')}
            </button>
          </div>
        </div>

        <FooterStats />

        <div className="mt-8 flex flex-col gap-2 border-t border-gray-800 pt-6 text-sm text-gray-400 md:flex-row md:justify-between">
          <span>
            © {currentYear} Dimarket. {t('footer.allRightsReserved')}
          </span>

          <span>{t('footer.legalRight')}</span>
        </div>
      </div>
    </footer>
  )
}
