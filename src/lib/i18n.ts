import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Імпортуємо вже готові об'єкти та типи з вашої папки locales
import { translations } from './locales';

// Експортуємо все необхідне, щоб інші файли (наприклад, Listings.tsx) бачили типи
export { translations, getTranslation } from './locales';
export type { TranslationKey, LanguageCode } from './locales';

// Створюємо ресурси для i18next, використовуючи ваші ключі мов
const resources = Object.keys(translations).reduce((acc, lang) => {
  acc[lang] = {
    // Важливо: передаємо об'єкт перекладів для конкретної мови
    translation: translations[lang as keyof typeof translations]
  };
  return acc;
}, {} as any);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    // Використовуємо українську як резервну
    fallbackLng: 'uk',
    
    // Мова за замовчуванням при ініціалізації
    lng: localStorage.getItem('i18nextLng') || 'uk',

    interpolation: {
      escapeValue: false, // Не потрібно для React
    },

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    
    // Це виправляє проблему, якщо ключі завантажуються асинхронно
    react: {
      useSuspense: false 
    }
  });

export default i18n;