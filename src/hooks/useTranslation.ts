import { useAppSelector } from './redux'
import { translations, type TranslationKey } from '../i18n/translations'

export function useTranslation() {
  const lang = useAppSelector(s => s.ui.language)

  function t(key: TranslationKey): string {
    return translations[key][lang]
  }

  return { t, lang, isRtl: lang === 'ar' }
}
