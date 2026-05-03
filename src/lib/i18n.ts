import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Імпортуємо ваші переклади з локальної папки locales
import { translations } from './locales';

// Експортуємо типи та функції, щоб вони були доступні в Listings.tsx та інших файлах
export { translations, getTranslation } from './locales';
export type { TranslationKey, LanguageCode } from './locales';

// Формуємо об'єкт ресурсів для i18next
const resources = Object.keys(translations).reduce((acc, lang) => {
  acc[lang] = {
    translation: translations[lang as keyof typeof translations]
  };
  return acc;
}, {} as any);

i18n
  // Автоматичне визначення мови (через localStorage або браузер)
  .use(LanguageDetector)
  // Інтеграція з React
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'uk', // Мова за замовчуванням
    interpolation: {
      escapeValue: false, // React робить це автоматично
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

export default i18n;