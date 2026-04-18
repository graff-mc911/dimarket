import { en } from './en'
import { uk } from './uk'
import { kk } from './kk'
import { pl } from './pl'
import { es } from './es'
import { de } from './de'
import { fr } from './fr'
import { it } from './it'
import { pt } from './pt'
import { ro } from './ro'
import { cs } from './cs'
import { sk } from './sk'
import { hu } from './hu'
import { bg } from './bg'
import { sr } from './sr'
import { hr } from './hr'
import { sl } from './sl'
import { lt } from './lt'
import { lv } from './lv'
import { et } from './et'
import { tr } from './tr'
import { ar } from './ar'
import { zh } from './zh'
import { ja } from './ja'

export const translations = {
  en,
  uk,
  kk,
  pl,
  es,
  de,
  fr,
  it,
  pt,
  ro,
  cs,
  sk,
  hu,
  bg,
  sr,
  hr,
  sl,
  lt,
  lv,
  et,
  tr,
  ar,
  zh,
  ja,
} as const

export type TranslationKey = keyof typeof translations.en
export type LanguageCode = keyof typeof translations

export function getTranslation(languageCode: LanguageCode, key: TranslationKey): string {
  const langTranslations = translations[languageCode] as Record<string, string>
  return langTranslations?.[key] || translations.en[key] || key
}
