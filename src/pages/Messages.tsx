/**
 * Сторінка повідомлень. Заглушка до підключення чату Supabase.
 */
import { MessageSquare } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { navigateTo } from '../lib/navigation'

export function Messages() {
  const { t } = useApp()

  return (
    <div className="w-full px-4 py-10 md:px-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <MessageSquare className="w-8 h-8 text-[var(--accent-700)]" />
        <h1 className="text-2xl font-bold text-[var(--ink-800)]">
          {t('header.messages')}
        </h1>
      </div>

      <p className="text-[var(--ink-600)] mb-6">
        Внутрішні повідомлення ще підключаються. Поки що зв’яжіться з автором оголошення через контакти на картці.
      </p>

      <button
        type="button"
        onClick={() => navigateTo('/listings')}
        className="rounded-full border border-[var(--glass-border)] bg-[rgba(255,252,248,0.9)] px-5 py-2.5 text-sm font-semibold text-[var(--ink-800)]"
      >
        {t('listings.title')}
      </button>
    </div>
  )
}