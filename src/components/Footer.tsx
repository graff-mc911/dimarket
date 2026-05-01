import { useApp } from '../contexts/AppContext'
import { navigateTo } from '../lib/navigation'
import { FooterStats } from './FooterStats'
import { Logo } from './Logo'

export function Footer() {
  const { t } = useApp()
  const currentYear = new Date().getFullYear()

  const platformLinks = [
    { label: t('header.jobRequests'), path: '/listings' },
    { label: t('header.findProfessionals'), path: '/professionals' },
    { label: t('header.postJob'), path: '/create-ad' },
    { label: t('header.favorites'), path: '/favorites' },
  ]

  const accountLinks = [
    { label: t('header.messages'), path: '/messages' },
    { label: t('footer.signIn'), path: '/login' },
    { label: t('footer.register'), path: '/register' },
    { label: t('header.dashboard'), path: '/dashboard' },
    { label: t('header.myProfile'), path: '/settings' },
  ]

  return (
    <footer className="mt-auto w-full px-4 pb-24 md:px-6 md:pb-6 xl:px-8 2xl:px-10">
      <div className="mx-auto max-w-7xl rounded-[32px] border border-white/70 bg-[rgba(252,246,240,0.82)] p-6 shadow-[0_18px_50px_rgba(89,63,48,0.08)] backdrop-blur-xl md:p-8">
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-[1.35fr_0.8fr_0.8fr_1fr]">
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

            <p className="mt-4 max-w-md text-sm font-semibold leading-7 text-[#9a5525]">
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

          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#9d8b7a]">
              {t('footer.adsTitle')}
            </h3>
            <p className="mt-4 text-sm leading-7 text-[#6f665d]">
              {t('footer.adsText')}
            </p>

            <button
              onClick={() => navigateTo('/advertise')}
              type="button"
              className="btn-secondary mt-5 rounded-full"
            >
              {t('footer.adsButton')}
            </button>
          </div>
        </div>

        <FooterStats />

        <div className="mt-8 flex flex-col gap-2 border-t border-[rgba(190,168,150,0.28)] pt-5 text-sm text-[#7a7168] md:flex-row md:items-center md:justify-between">
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
      <h3 className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#9d8b7a]">
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
