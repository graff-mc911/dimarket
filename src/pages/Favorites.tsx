/**
 * Сторінка обраного. Поки що заглушка з поясненням — далі можна підключити збережені оголошення (localStorage / акаунт).
 */
import { Heart } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { navigateTo } from '../lib/navigation'

export function Favorites() {
  const { t } = useApp()

  return (
    <div className="w-full px-4 py-10 md:px-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Heart className="w-8 h-8 text-[var(--accent-700)]" />
        <h1 className="text-2xl font-bold text-[var(--ink-800)]">
          {t('header.favorites')}
        </h1>
      </div>

      <p className="text-[var(--ink-600)] mb-6">
        Тут з’являтимуться оголошення, які ви додали в обране. Зараз розділ у розробці — перегляньте каталог.
      </p>

      <button
        type="button"
        onClick={() => navigateTo('/listings')}
        className="rounded-full bg-[var(--accent-700)] px-5 py-2.5 text-sm font-semibold text-white"
      >
        {t('listings.title')}
      </button>
    </div>
  )
}