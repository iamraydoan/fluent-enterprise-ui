import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";

export const LANGUAGE_STORAGE_KEY = "fluent-enterprise-ui:language";

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "vi", label: "Tiếng Việt" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

type KeyPaths<T, Prefix extends string = ""> = {
  [K in keyof T]: T[K] extends Record<string, unknown>
    ? KeyPaths<T[K], `${Prefix}${K & string}.`>
    : `${Prefix}${K & string}`;
}[keyof T];

export type TranslationKey = KeyPaths<typeof en>;

type LocaleModule = { default: Record<string, unknown> };

const localeLoaders: Record<Exclude<LanguageCode, "en">, () => Promise<LocaleModule>> = {
  ja: () => import("./locales/ja.json"),
  ko: () => import("./locales/ko.json"),
  vi: () => import("./locales/vi.json"),
};

const loadedLocales = new Set<LanguageCode>(["en"]);

export function ensureLocaleLoaded(code: LanguageCode): Promise<void> {
  if (code === "en" || loadedLocales.has(code)) return Promise.resolve();
  return localeLoaders[code]().then((module) => {
    i18n.addResourceBundle(code, "translation", module.default, true, true);
    loadedLocales.add(code);
  });
}

function isLanguageCode(value: string | null): value is LanguageCode {
  return SUPPORTED_LANGUAGES.some((language) => language.code === value);
}

function storedLanguage(): LanguageCode {
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return isLanguageCode(stored) ? stored : "en";
}

export { storedLanguage };

let initPromise: Promise<void> | null = null;

function doInitI18n(): Promise<void> {
  const lng = storedLanguage();
  return i18n
    .use(initReactI18next)
    .init({
      resources: { en: { translation: en } },
      lng: "en",
      fallbackLng: "en",
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    })
    .then(() => {
      if (lng === "en") return;
      return ensureLocaleLoaded(lng).then(() => i18n.changeLanguage(lng));
    })
    .then(() => undefined);
}

export function initI18n(): Promise<void> {
  if (!initPromise) initPromise = doInitI18n();
  return initPromise;
}

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: { translation: typeof en };
  }
}
