import type { ConfigurationRecord } from "@/api";

const CONFIGURATION_SEED_ROWS: ConfigurationRecord[] = [
  {
    setting: "Default language",
    value: "English",
    scope: "Global",
    modified: "12/10/2026",
  },
  {
    setting: "Time zone",
    value: "UTC+07:00",
    scope: "Global",
    modified: "12/10/2026",
  },
  {
    setting: "Session timeout",
    value: "30 min",
    scope: "Security",
    modified: "03/09/2026",
  },
  {
    setting: "Audit logging",
    value: "Enabled",
    scope: "Security",
    modified: "03/09/2026",
  },
];

export function buildConfigurationSeeds(): ConfigurationRecord[] {
  return CONFIGURATION_SEED_ROWS.map((row) => ({ ...row }));
}
