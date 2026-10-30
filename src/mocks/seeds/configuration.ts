import type { ConfigurationEntry } from "@/api";

const BASE_TIME = Date.UTC(2026, 9, 28, 9, 0, 0);
const HOUR = 3_600_000;

interface SeedInput {
  value?: string;
  type?: string;
  referenceName?: string;
  description?: string;
  confidential?: boolean;
  userConfig?: boolean;
  createdBy?: string;
  modifiedBy?: string;
  ageHours?: number;
}

const SYSTEM_MODULES = [
  "Material",
  "Resource",
  "Lot",
  "Facility",
  "Product",
  "Flow",
  "Step",
  "DataCollection",
  "Maintenance",
  "Quality",
  "Security",
  "Integration",
  "Dispatch",
  "Messaging",
  "Reports",
  "Scheduler",
  "Shipping",
  "Labeling",
  "Inventory",
  "Tracking",
  "Calendar",
  "Notification",
  "Audit",
  "Cache",
  "Localization",
];

const MODULE_SETTINGS: [string, string, string][] = [
  ["TimeOut", "Int32", "60000"],
  ["Enabled", "Boolean", "true"],
  ["MaxItems", "Int32", "500"],
  ["RetryCount", "Int16", "3"],
  ["BatchSize", "Int32", "100"],
  ["Mode", "String", "Default"],
  ["AllowOverride", "Boolean", "false"],
  ["Threshold", "Decimal", "0.75"],
  ["LogLevel", "String", "Information"],
  ["Interval", "Int32", "1000"],
];

const GUI_PAGES = [
  "Common",
  "Dashboard",
  "Navigation",
  "Grid",
  "Wizard",
  "Reports",
  "Search",
  "Notifications",
  "Themes",
  "Shortcuts",
  "Editors",
  "Charts",
];

const GUI_SETTINGS: [string, string, string][] = [
  ["PageSize", "Int16", "25"],
  ["AutoRefresh", "Boolean", "false"],
  ["RefreshInterval", "Int32", "30"],
  ["DefaultView", "String", "Details"],
  ["ShowHelp", "Boolean", "true"],
  ["MaxOpenTabs", "Int16", "10"],
  ["DateFormat", "String", "MM/dd/yyyy"],
  ["ConfirmOnClose", "Boolean", "true"],
];

const RULE_ENGINES = ["Material", "Resource", "Facility", "Product", "Flow", "Step", "Lot", "Area"];
const RULE_NAMES = [
  "RuleEvaluation",
  "PreCondition",
  "PostCondition",
  "Validation",
  "Defaults",
  "Notification",
  "Audit",
  "Scheduling",
  "Tracking",
  "Cleanup",
];

function makeEntry(path: string, input: SeedInput, index: number): ConfigurationEntry {
  const ageHours = input.ageHours ?? 24 + index * 7;
  return {
    path,
    value: input.value ?? "",
    type: input.type ?? "",
    referenceName: input.referenceName ?? "",
    description: input.description ?? "",
    confidential: input.confidential ?? false,
    userConfig: input.userConfig ?? false,
    createdBy: input.createdBy ?? "System",
    modifiedBy: input.modifiedBy ?? "System",
    createdOn: BASE_TIME - ageHours * HOUR - 30 * 24 * HOUR,
    modifiedOn: BASE_TIME - ageHours * HOUR,
  };
}

export function buildConfigurationSeeds(): ConfigurationEntry[] {
  const entries: ConfigurationEntry[] = [];
  const seen = new Set<string>();
  const add = (path: string, input: SeedInput = {}) => {
    if (seen.has(path)) return;
    seen.add(path);
    entries.push(makeEntry(path, input, entries.length));
  };

  const system = "/Cmf/System/Configuration/";

  add("/Cmf/", { description: "Cmf root", ageHours: 9000 });
  add("/Cmf/Custom/", { userConfig: true, description: "Custom entries", ageHours: 8000 });
  add("/Cmf/Custom/MasterDataLoadDate/", {
    type: "DateTime",
    value: "3/15/2018 2:33:00 PM",
    userConfig: true,
    ageHours: 2,
  });
  add(`${system}SecurityLevel/ObjectLevel/`, { type: "Boolean", value: "true", ageHours: 1 });
  add(`${system}SecurityLevel/FunctionalityLevel/`, {
    type: "Boolean",
    value: "true",
    ageHours: 1,
  });

  const credentials = `${system}LDAP/Credentials/dc02.cmf.criticalmanufacturing.com/`;
  add(`${credentials}UserPassword/`, {
    type: "String",
    value: "s3cret",
    confidential: true,
    description: "Service account password",
    ageHours: 5,
  });
  add(`${credentials}DisableCertificateValidation/`, { type: "Boolean", ageHours: 6 });
  add(`${credentials}Domain/`, { type: "String", value: "cmf", ageHours: 6 });
  add(`${credentials}UserName/`, { type: "String", value: "CMF\\producttest", ageHours: 6 });
  add(`${credentials}Port/`, { type: "Int32", ageHours: 6 });
  add(`${credentials}UseSSL/`, { type: "Boolean", value: "false", ageHours: 6 });
  add(credentials, { type: "String", description: "LDAP credential set", ageHours: 7 });

  for (const name of [
    "ContainerUndockInterlockingTimeOut",
    "ContainerDockInterlockingTimeOut",
    "MaterialTrackOutInterlockingTimeOut",
    "MaterialTrackInInterlockingTimeOut",
  ]) {
    add(`${system}Resource/${name}/`, { type: "Int32", value: "60000", ageHours: 10 });
  }
  add("/Cmf/Guis/Configuration/Common/Security/AutoLockTimeout/", {
    type: "Int16",
    value: "300",
    description: "The auto lock timeout, in seconds - use zero to never lock",
    ageHours: 12,
  });
  add(`${system}DeeRules/Material/RuleEvaluation/`, { type: "String", ageHours: 14 });

  SYSTEM_MODULES.forEach((module, moduleIndex) => {
    MODULE_SETTINGS.forEach(([name, type, value], settingIndex) => {
      add(`${system}${module}/${name}/`, {
        type,
        value: settingIndex % 3 === 0 ? "" : value,
        userConfig: moduleIndex % 5 === 0,
      });
    });
  });

  GUI_PAGES.forEach((page, pageIndex) => {
    GUI_SETTINGS.forEach(([name, type, value], settingIndex) => {
      add(`/Cmf/Guis/Configuration/${page}/${name}/`, {
        type,
        value: settingIndex % 4 === 0 ? "" : value,
        userConfig: pageIndex % 4 === 0,
      });
    });
  });

  RULE_ENGINES.forEach((engine) => {
    RULE_NAMES.forEach((rule) => {
      add(`${system}DeeRules/${engine}/${rule}/`, { type: "String" });
    });
  });

  for (const entry of [...entries]) {
    let ancestor = parentOfPath(entry.path);
    while (ancestor !== null && ancestor !== "/") {
      add(ancestor, { description: "Configuration node" });
      ancestor = parentOfPath(ancestor);
    }
  }

  return entries;
}

function parentOfPath(path: string): string | null {
  if (path === "/") return null;
  const trimmed = path.endsWith("/") ? path.slice(0, -1) : path;
  return `${trimmed.slice(0, trimmed.lastIndexOf("/"))}/`;
}
