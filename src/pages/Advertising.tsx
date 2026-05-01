import {
  ArrowRight,
  Megaphone,
  MonitorSmartphone,
  Newspaper,
  PanelsTopLeft,
} from 'lucide-react'
import { navigateTo } from '../lib/navigation'
import { useApp } from '../contexts/AppContext'

export function Advertising() {
  const { t } = useApp()

  const placements = [
    {
      title: t('advertising.placements.homeTitle'),
      text: t('advertising.placements.homeText'),
      icon: PanelsTopLeft,
    },
    {
      title: t('advertising.placements.listingsTitle'),
      text: t('advertising.placements.listingsText'),
      icon: Newspaper,
    },
    {
      title: t('advertising.placements.sidebarTitle'),
      text: t('advertising.placements.sidebarText'),
      icon: MonitorSmartphone,
    },
  ]

  return (
    <div className="page-bg min-h-screen px-4 py-8 md:px-6 xl:px-8 2xl:px-10">
      <div className="mx-auto max-w-6xl">
        <section className="glass-panel p-6 md:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(233,202,177,0.7)] bg-[rgba(255,247,239,0.88)] px-4 py-2 text-sm font-semibold text-[#a26233]">
            <Megaphone className="h-4 w-4" />
            <span>{t('advertising.eyebrow')}</span>
          </div>

          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold tracking-tight text-[#2f2a24] md:text-5xl">
            {t('advertising.title')}
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-[#6f665d] md:text-lg">
            {t('advertising.description')}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => navigateTo('/listings')}
              type="button"
              className="btn-primary rounded-full"
            >
              {t('advertising.primaryButton')}
            </button>

            <button
              onClick={() => navigateTo('/')}
              type="button"
              className="btn-secondary rounded-full"
            >
              {t('advertising.secondaryButton')}
            </button>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="glass-card p-6">
            <h2 className="text-2xl font-extrabold text-[#2f2a24]">
              {t('advertising.placementsTitle')}
            </h2>

            <div className="mt-5 grid gap-4">
              {placements.map((placement) => (
                <div
                  key={placement.title}
                  className="rounded-[24px] border border-white/70 bg-white/55 p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-[rgba(242,171,116,0.18)] text-[#9a5525]">
                      <placement.icon className="h-6 w-6" />
                    </div>

                    <div>
                      <h3 className="text-lg font-extrabold text-[#2f2a24]">
                        {placement.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[#6f665d]">
                        {placement.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-2xl font-extrabold text-[#2f2a24]">
                {t('advertising.audienceTitle')}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#6f665d]">
                {t('advertising.audienceText')}
              </p>
            </div>

            <div className="glass-card p-6">
              <h2 className="text-2xl font-extrabold text-[#2f2a24]">
                {t('advertising.principleTitle')}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#6f665d]">
                {t('advertising.principleText')}
              </p>

              <button
                onClick={() => navigateTo('/listings')}
                type="button"
                className="btn-ghost mt-5 rounded-full px-0"
              >
                <span>{t('advertising.primaryButton')}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
