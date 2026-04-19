// Проста внутрішня навігація без повного перезавантаження сторінки
export function navigateTo(path: string) {
  const currentPath = `${window.location.pathname}${window.location.search}`

  // Якщо користувач уже на цій сторінці — нічого не робимо
  if (currentPath === path) return

  // Міняємо адресу без reload
  window.history.pushState({}, '', path)

  // Повідомляємо додаток, що маршрут змінився
  window.dispatchEvent(new PopStateEvent('popstate'))

  // Після переходу прокручуємо сторінку догори
  window.scrollTo({ top: 0, behavior: 'smooth' })
}