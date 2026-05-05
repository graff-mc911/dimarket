/**
 * Сторінка обраного.
 * Функція ще не зберігає реальні оголошення, тому чесно показуємо стан "скоро".
 */
import { Heart, Search } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { navigateTo } from '../lib/navigation'

export function Favorites() {
  const { t } = useApp()

  return (
    <div className="page-bg min-h-screen px-4 py-10 md:px-6">
      <div className="mx-auto max-w-3xl">
        <section className="glass-panel p-6 text-center md:p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-[rgba(242,171,116,0.18)] text-[var(--accent-700)]">
            <Heart className="h-8 w-8" />
          </div>

          <div className="mt-5 inline-flex rounded-full bg-[rgba(148,163,184,0.12)] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#64748b]">
            Скоро
          </div>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-[var(--ink-800)]">
            {t('header.favorites')}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--ink-600)] md:text-base">
            Тут будуть зберігатися оголошення, до яких ви хочете повернутися пізніше.
            Поки функція обраного готується, користуйтеся пошуком і фільтрами у каталозі.
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigateTo('/listings')}
              className="btn-primary rounded-full"
            >
              <Search className="h-4 w-4" />
              Перейти до каталогу
            </button>

            <button
              type="button"
              onClick={() => navigateTo('/create-ad')}
              className="btn-secondary rounded-full"
            >
              {t('header.createAd')}
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}