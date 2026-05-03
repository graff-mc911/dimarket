import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Імпортуємо ваші налаштовані ресурси та функції з locales
import { translations } from './locales';

// Експортуємо те, що ви просили, для використання в інших частинах додатку
export { translations, getTranslation } from './locales';
export type { TranslationKey, LanguageCode } from './locales';

// Формуємо об'єкт ресурсів для i18next на основі вашого об'єкта translations
const resources = Object.keys(translations).reduce((acc, lang) => {
  acc[lang] = {
    translation: translations[lang as keyof typeof translations]
  };
  return acc;
}, {} as any);

i18n
  // Визначаємо мову користувача автоматично
  .use(LanguageDetector)
  // Передаємо i18n в react-i18next
  .use(initReactI18next)
  .init({
    resources,
    // Мова за замовчуванням (fallback)
    fallbackLng: 'uk',
    
    // Налаштування детекції мови
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false, // React захищає від XSS автоматично
    },

    // Встановлюємо значення за замовчуванням для чистих перекладів
    returnEmptyString: false,
  });

export default i18n;