export interface ConfigurationRow {
  setting: string;
  value: string;
  scope: string;
  modified: string;
}

export const CONFIGURATION_ROWS: ConfigurationRow[] = [
  { setting: "Default language", value: "English", scope: "Global", modified: "12/10/2026" },
  { setting: "Time zone", value: "UTC+07:00", scope: "Global", modified: "12/10/2026" },
  { setting: "Session timeout", value: "30 min", scope: "Security", modified: "03/09/2026" },
  { setting: "Audit logging", value: "Enabled", scope: "Security", modified: "03/09/2026" },
];
