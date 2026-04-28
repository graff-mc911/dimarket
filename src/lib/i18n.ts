import { enTranslations } from './translations/en'
import type { TranslationKey } from './translations/en'
import { ukTranslations } from './translations/uk'
import { kkTranslations } from './translations/kk'
import { plTranslations } from './translations/pl'
import { esTranslations } from './translations/es'
import { deTranslations } from './translations/de'
import { frTranslations } from './translations/fr'
import { itTranslations } from './translations/it'
import { ptTranslations } from './translations/pt'
import { roTranslations } from './translations/ro'
import { csTranslations } from './translations/cs'
import { skTranslations } from './translations/sk'
import { huTranslations } from './translations/hu'
import { bgTranslations } from './translations/bg'
import { srTranslations } from './translations/sr'
import { hrTranslations } from './translations/hr'
import { slTranslations } from './translations/sl'
import { ltTranslations } from './translations/lt'
import { lvTranslations } from './translations/lv'
import { etTranslations } from './translations/et'
import { trTranslations } from './translations/tr'
import { arTranslations } from './translations/ar'
import { zhTranslations } from './translations/zh'
import { jaTranslations } from './translations/ja'

const withEnglishFallback = (
  localeTranslations: Partial<Record<TranslationKey, string>>,
): Record<TranslationKey, string> => ({
  ...enTranslations,
  ...localeTranslations,
})

export const translations = {
  en: enTranslations,
  uk: withEnglishFallback(ukTranslations),
  kk: withEnglishFallback(kkTranslations),
  pl: withEnglishFallback(plTranslations),
  es: withEnglishFallback(esTranslations),
  de: withEnglishFallback(deTranslations),
  fr: withEnglishFallback(frTranslations),
  it: withEnglishFallback(itTranslations),
  pt: withEnglishFallback(ptTranslations),
  ro: withEnglishFallback(roTranslations),
  cs: withEnglishFallback(csTranslations),
  sk: withEnglishFallback(skTranslations),
  hu: withEnglishFallback(huTranslations),
  bg: withEnglishFallback(bgTranslations),
  sr: withEnglishFallback(srTranslations),
  hr: withEnglishFallback(hrTranslations),
  sl: withEnglishFallback(slTranslations),
  lt: withEnglishFallback(ltTranslations),
  lv: withEnglishFallback(lvTranslations),
  et: withEnglishFallback(etTranslations),
  tr: withEnglishFallback(trTranslations),
  ar: withEnglishFallback(arTranslations),
  zh: withEnglishFallback(zhTranslations),
  ja: withEnglishFallback(jaTranslations),
} as const

export type { TranslationKey }
export type LanguageCode = keyof typeof translations

export function getTranslation(
  languageCode: LanguageCode,
  key: TranslationKey,
): string {
  return translations[languageCode]?.[key] ?? enTranslations[key] ?? key
}
