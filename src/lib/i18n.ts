import { enTranslations, type TranslationKey } from './translations/en'
import { ukTranslations } from './translations/uk'

const ukTranslationSet = {
  ...enTranslations,
  ...ukTranslations,
}

export const translations = {
  en: enTranslations,
  uk: ukTranslationSet,

  // Тимчасово інші мови падають в English,
  // доки ми не створимо для них окремі словники.
  kk: enTranslations,
  pl: enTranslations,
  es: enTranslations,
  de: enTranslations,
  fr: enTranslations,
  it: enTranslations,
  pt: enTranslations,
  ro: enTranslations,
  cs: enTranslations,
  sk: enTranslations,
  hu: enTranslations,
  bg: enTranslations,
  sr: enTranslations,
  hr: enTranslations,
  sl: enTranslations,
  lt: enTranslations,
  lv: enTranslations,
  et: enTranslations,
  tr: enTranslations,
  ar: enTranslations,
  zh: enTranslations,
  ja: enTranslations,
} as const

export type LanguageCode = keyof typeof translations

export function getTranslation(languageCode: LanguageCode, key: TranslationKey): string {
  const allTranslations = translations as Record<string, Record<string, string>>
  const langTranslations = allTranslations[languageCode] || allTranslations.en

  return langTranslations[key] || allTranslations.en[key] || key
}
