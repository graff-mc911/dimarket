import { useApp } from '../contexts/AppContext'
import { navigateTo } from '../lib/navigation'
import { FooterStats } from './FooterStats'
import { Logo } from './Logo'

export function Footer() {
  const { t } = useApp()
  const currentYear = new Date().getFullYear()

  // Посилання блоку платформи.
  const platformLinks = [
    { label: t('header.jobRequests'), path: '/listings' },
    { label: t('header.findProfessionals'), path: '/professionals' },
    { label: t('header.postJob'), path: '/create-ad' },
    { label: t('header.favorites'), path: '/favorites' },
  ]

  // Посилання блоку акаунта.
  const accountLinks = [
    { label: t('header.messages'), path: '/messages' },
    { label: t('footer.signIn'), path: '/login' },
    { label: t('footer.register'), path: '/register' },
    { label: t('header.dashboard'), path: '/dashboard' },
    { label: t('header.myProfile'), path: '/settings' },
  ]

  // Окремий блок службових посилань.
  // Саме тут додаємо перехід на форму зворотного зв'язку.
  const supportLinks = [
    { label: 'Зворотний звʼязок', path: '/contact' },
    { label: 'Реклама на сайті', path: '/advertise' },
  ]

  return (
    <footer className="mt-auto w-full px-4 pb-24 md:px-6 md:pb-6 xl:px-8 2xl:px-10">
      {/* Футер переводимо в холодніший скляний стиль,
          щоб він не давав рожевого фону на десктопі. */}
      <div className="mx-auto max-w-7xl rounded-[32px] border border-white/45 bg-[rgba(244,246,248,0.68)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl md:p-8">
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-[1.25fr_0.8fr_0.8fr_0.9fr_1fr]">
          {/* Брендовий блок з коротким описом */}
          <div>
            <button
              onClick={() => navigateTo('/')}
              type="button"
              className="rounded-full"
            >
              <Logo size="lg" />
            </button>

            <p className="mt-4 max-w-md text-sm leading-7 text-[#6f665d]">
              {t('footer.brandText')}
            </p>

            <p className="mt-4 max-w-md text-sm font-semibold leading-7 text-[#64748b]">
              {t('footer.monetization')}
            </p>
          </div>

          <FooterLinkGroup
            title={t('footer.platformTitleSimple')}
            links={platformLinks}
          />

          <FooterLinkGroup
            title={t('footer.accountTitleSimple')}
            links={accountLinks}
          />

          <FooterLinkGroup
            title="Підтримка"
            links={supportLinks}
          />

          {/* Блок реклами у футері */}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#8793a1]">
              {t('footer.adsTitle')}
            </h3>
            <p className="mt-4 text-sm leading-7 text-[#6f665d]">
              {t('footer.adsText')}
            </p>

            <div className="mt-5 flex flex-col gap-3">
              <button
                onClick={() => navigateTo('/advertise')}
                type="button"
                className="btn-secondary rounded-full"
              >
                {t('footer.adsButton')}
              </button>

              <button
                onClick={() => navigateTo('/contact')}
                type="button"
                className="btn-outline rounded-full"
              >
                Написати нам
              </button>
            </div>
          </div>
        </div>

        {/* Статистика платформи рендериться окремим компонентом */}
        <FooterStats />

        {/* Нижній рядок з копірайтом */}
        <div className="mt-8 flex flex-col gap-2 border-t border-[rgba(148,163,184,0.18)] pt-5 text-sm text-[#7a7168] md:flex-row md:items-center md:justify-between">
          <span>{`© ${currentYear} Dimarket. ${t('footer.allRightsReserved')}`}</span>
          <span>{t('footer.legalRight')}</span>
        </div>
      </div>
    </footer>
  )
}

function FooterLinkGroup({
  title,
  links,
}: {
  title: string
  links: Array<{ label: string; path: string }>
}) {
  return (
    <div>
      {/* Заголовок колонки навігації */}
      <h3 className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#8793a1]">
        {title}
      </h3>

      <div className="mt-4 flex flex-col gap-3">
        {links.map((link) => (
          <button
            key={link.path}
            onClick={() => navigateTo(link.path)}
            type="button"
            className="text-left text-sm font-medium text-[#5f5a54] transition hover:text-[#2f2a24]"
          >
            {link.label}
          </button>
        ))}
      </div>
    </div>
  )
}
