import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Імпортуємо з поточної папки (./locales/index.ts)
import { translations } from './locales';

// Експортуємо типи та функції далі для всього застосунку
export { translations, getTranslation } from './locales';
export type { TranslationKey, LanguageCode } from './locales';

const resources = Object.keys(translations).reduce((acc, lang) => {
  acc[lang] = {
    translation: translations[lang as keyof typeof translations]
  };
  return acc;
}, {} as any);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'uk',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;