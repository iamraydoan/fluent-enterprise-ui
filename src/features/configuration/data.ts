import type { TranslationKey } from "@/i18n";

export interface ConfigurationRow {
  settingKey: TranslationKey;
  valueKey: TranslationKey | null;
  valueText: string | null;
  valueCount: number | null;
  scopeKey: TranslationKey;
  modified: string;
}

export const CONFIGURATION_ROWS: ConfigurationRow[] = [
  {
    settingKey: "configuration.settings.defaultLanguage",
    valueKey: "configuration.values.english",
    valueText: null,
    valueCount: null,
    scopeKey: "configuration.scopes.global",
    modified: "12/10/2026",
  },
  {
    settingKey: "configuration.settings.timeZone",
    valueKey: null,
    valueText: "UTC+07:00",
    valueCount: null,
    scopeKey: "configuration.scopes.global",
    modified: "12/10/2026",
  },
  {
    settingKey: "configuration.settings.sessionTimeout",
    valueKey: "configuration.values.minutes",
    valueText: null,
    valueCount: 30,
    scopeKey: "configuration.scopes.security",
    modified: "03/09/2026",
  },
  {
    settingKey: "configuration.settings.auditLogging",
    valueKey: "configuration.values.enabled",
    valueText: null,
    valueCount: null,
    scopeKey: "configuration.scopes.security",
    modified: "03/09/2026",
  },
];
