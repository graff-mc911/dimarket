// locales/index.ts

import { enTranslations } from "../Translations/en";
import { ukTranslations } from "../Translations/uk";

export const translations = {
  en: enTranslations,
  uk: ukTranslations,
} as const;

export type LanguageCode = keyof typeof translations;
export type TranslationKey = keyof typeof enTranslations;

export function getTranslation(lang: LanguageCode, key: TranslationKey) {
  return translations[lang]?.[key] || translations.en[key] || key;
}