import {
  ArrowRight,
  Megaphone,
  MonitorSmartphone,
  Newspaper,
  PanelsTopLeft,
} from 'lucide-react'
import { navigateTo } from '../lib/navigation'

export function Advertising() {
  // Тимчасові тексти сторінки advertising.
  // Після стабілізації контенту винесемо їх у систему перекладів.
  const copy = {
    eyebrow: 'Advertising',
    title: 'Advertising keeps Dimarket free for users',
    description:
      'Dimarket earns only from advertising. Brands can place relevant construction-focused campaigns while clients and professionals continue using the platform for free.',
    placementsTitle: 'Where ads can appear',
    placements: [
      {
        title: 'Home page',
        text: 'Warm promotional blocks next to search, featured categories, and fresh requests.',
        icon: PanelsTopLeft,
      },
      {
        title: 'Listings feed',
        text: 'Inline placements between job requests where professionals actively scan new work.',
        icon: Newspaper,
      },
      {
        title: 'Sidebar and footer',
        text: 'Persistent visibility for tools, materials, logistics, and local showrooms.',
        icon: MonitorSmartphone,
      },
    ],
    audienceTitle: 'Best fit for advertisers',
    audienceText:
      'Construction materials, equipment rental, logistics, building tools, home improvement stores, local contractor services, and renovation showrooms.',
    principleTitle: 'Platform principle',
    principleText:
      'Clients do not pay to post requests. Professionals do not pay to see contact opportunities. Advertising is the only monetization layer.',
    primaryButton: 'Browse job requests',
    secondaryButton: 'Back to home',
  }

  return (
    <div className="page-bg min-h-screen px-4 py-8 md:px-6 xl:px-8 2xl:px-10">
      <div className="mx-auto max-w-6xl">
        <section className="glass-panel p-6 md:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(233,202,177,0.7)] bg-[rgba(255,247,239,0.88)] px-4 py-2 text-sm font-semibold text-[#a26233]">
            <Megaphone className="h-4 w-4" />
            <span>{copy.eyebrow}</span>
          </div>

          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold tracking-tight text-[#2f2a24] md:text-5xl">
            {copy.title}
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-[#6f665d] md:text-lg">
            {copy.description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => navigateTo('/listings')}
              type="button"
              className="btn-primary rounded-full"
            >
              {copy.primaryButton}
            </button>

            <button
              onClick={() => navigateTo('/')}
              type="button"
              className="btn-secondary rounded-full"
            >
              {copy.secondaryButton}
            </button>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="glass-card p-6">
            <h2 className="text-2xl font-extrabold text-[#2f2a24]">
              {copy.placementsTitle}
            </h2>

            <div className="mt-5 grid gap-4">
              {copy.placements.map((placement) => (
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
                {copy.audienceTitle}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#6f665d]">
                {copy.audienceText}
              </p>
            </div>

            <div className="glass-card p-6">
              <h2 className="text-2xl font-extrabold text-[#2f2a24]">
                {copy.principleTitle}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#6f665d]">
                {copy.principleText}
              </p>

              <button
                onClick={() => navigateTo('/listings')}
                type="button"
                className="btn-ghost mt-5 rounded-full px-0"
              >
                <span>{copy.primaryButton}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
