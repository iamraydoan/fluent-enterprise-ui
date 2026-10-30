import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { LANGUAGE_STORAGE_KEY, SUPPORTED_LANGUAGES, initI18n, storedLanguage } from "./i18n";
import type { LanguageCode, TranslationKey } from "./i18n";

export { i18n, initI18n, storedLanguage, SUPPORTED_LANGUAGES };
export type { LanguageCode, TranslationKey };

export function useAppTranslation() {
  const { t: rawT, i18n: instance } = useTranslation();
  const t = (key: TranslationKey, options?: Record<string, unknown>) =>
    rawT(key, options);
  const setLanguage = (code: LanguageCode) => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
    void instance.changeLanguage(code);
  };
  const language: LanguageCode = SUPPORTED_LANGUAGES.some(
    (option) => option.code === instance.language,
  )
    ? (instance.language as LanguageCode)
    : "en";
  return { t, language, setLanguage };
}
