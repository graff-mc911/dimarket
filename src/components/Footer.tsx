import { navigateTo } from '../lib/navigation'
import { FooterStats } from './FooterStats'
import { Logo } from './Logo'

export function Footer() {
  const currentYear = new Date().getFullYear()

  // Тимчасові тексти нового footer-блоку.
  // Після стабілізації контенту винесемо їх у словник перекладів.
  const copy = {
    brandText:
      'Dimarket is a free global platform for construction services where clients post work and professionals respond directly.',
    monetization:
      'No fees for users. No subscriptions. Platform revenue comes only from advertising.',
    platformTitle: 'Platform',
    platformLinks: [
      { label: 'Job requests', path: '/listings' },
      { label: 'Professionals', path: '/professionals' },
      { label: 'Post job', path: '/create-ad' },
      { label: 'Favorites', path: '/favorites' },
    ],
    accountTitle: 'Account',
    accountLinks: [
      { label: 'Messages', path: '/messages' },
      { label: 'Login', path: '/login' },
      { label: 'Register', path: '/register' },
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Settings', path: '/settings' },
    ],
    adsTitle: 'Advertising',
    adsText:
      'Construction brands, materials, tools, logistics, and local services can reach active demand across listings and professional pages.',
    adsButton: 'Advertising page',
    legalLeft: `© ${currentYear} Dimarket. All rights reserved.`,
    legalRight: 'Free construction-services platform with advertising-only monetization.',
  }

  return (
    <footer className="mt-auto w-full px-4 pb-6 md:px-6 xl:px-8 2xl:px-10">
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
              {copy.brandText}
            </p>

            <p className="mt-4 max-w-md text-sm font-semibold leading-7 text-[#9a5525]">
              {copy.monetization}
            </p>
          </div>

          <FooterLinkGroup
            title={copy.platformTitle}
            links={copy.platformLinks}
          />

          <FooterLinkGroup
            title={copy.accountTitle}
            links={copy.accountLinks}
          />

          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#9d8b7a]">
              {copy.adsTitle}
            </h3>
            <p className="mt-4 text-sm leading-7 text-[#6f665d]">
              {copy.adsText}
            </p>

            <button
              onClick={() => navigateTo('/advertise')}
              type="button"
              className="btn-secondary mt-5 rounded-full"
            >
              {copy.adsButton}
            </button>
          </div>
        </div>

        <FooterStats />

        <div className="mt-8 flex flex-col gap-2 border-t border-[rgba(190,168,150,0.28)] pt-5 text-sm text-[#7a7168] md:flex-row md:items-center md:justify-between">
          <span>{copy.legalLeft}</span>
          <span>{copy.legalRight}</span>
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
