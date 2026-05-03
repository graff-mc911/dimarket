import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Імпортуємо ваші налаштовані ресурси та функції безпосередньо з папки locales
import { translations, getTranslation } from './locales';
import type { TranslationKey, LanguageCode } from './locales';

// Експортуємо їх, щоб інші файли могли звертатися до i18n.ts як до єдиного джерела
export { translations, getTranslation };
export type { TranslationKey, LanguageCode };

// Перетворюємо об'єкт translations у формат для i18next
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
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;