/**
 * Сторінка повідомлень.
 * Чат ще не запущений, тому сторінка чесно пояснює доступний спосіб контакту.
 */
import { MessageSquare, PhoneCall } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { navigateTo } from '../lib/navigation'

export function Messages() {
  const { t } = useApp()

  return (
    <div className="page-bg min-h-screen px-4 py-10 md:px-6">
      <div className="mx-auto max-w-3xl">
        <section className="glass-panel p-6 text-center md:p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[rgba(242,171,116,0.18)] text-[var(--accent-700)]">
            <MessageSquare className="h-8 w-8" />
          </div>

          <p className="mx-auto mt-5 inline-flex rounded-full border border-[rgba(233,202,177,0.7)] bg-[rgba(255,247,239,0.88)] px-4 py-2 text-sm font-semibold text-[#a26233]">
            Скоро буде доступно
          </p>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-[#2f2a24]">
            {t('header.messages')}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#6f665d] md:text-base">
            Внутрішній чат ще готується. Поки він не запущений, використовуйте
            телефон або email, які автор залишив у конкретному оголошенні.
          </p>

          <div className="mt-6 rounded-[24px] border border-white/70 bg-white/45 p-5 text-left">
            <div className="flex items-start gap-3">
              <PhoneCall className="mt-1 h-5 w-5 shrink-0 text-[var(--accent-700)]" />
              <div>
                <h2 className="font-bold text-[#2f2a24]">Як звʼязатися зараз</h2>
                <p className="mt-2 text-sm leading-6 text-[#6f665d]">
                  Відкрийте оголошення з каталогу та перейдіть до блоку контактів.
                  Там будуть доступні телефон або email автора, якщо він їх вказав.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('/listings')}
            className="btn-primary mt-6 rounded-full"
          >
            {t('listings.title')}
          </button>
        </section>
      </div>
    </div>
  )
}