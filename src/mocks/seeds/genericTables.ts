import type { GenericTableColumnDef, GenericTableDetail, GenericTableRecord } from "@/api";
import { RecordState } from "@/api";

const SYSTEM_TABLES: Array<[string, string]> = [
  [
    "AQLAcceptanceQualityLimit",
    "Resolve AQL Limits based on Code, Inspection Severity and Acceptance Limit.",
  ],
  ["AQLSamplingCode", "Map lot size to an inspection code based on Inspection Level."],
  ["AttachmentType", "Attachment Type Generic Table."],
  ["CADFileInformation", "CAD File information."],
  ["CalendarDayType", "Definitions and colors for working days - both working and non-working."],
  ["CentroidSideInformation", "Centroid Side information."],
  ["ChangeSetUrgency", "Map urgency type with priority rank and default for Change Sets."],
  ["ChartRuleScope", "Map Chart Rules to the type of indicators shown in the rules."],
  ["ChecklistRuleScopeRelation", "Map allowed rules for checklist items based on checklist scope."],
  ["ChecklistScopeContext", "Map checklist scope based on a given context."],
  [
    "ContainerResourceRelation",
    "Possible Container-Resource relations between Containers and Resources.",
  ],
  ["ContainerTypeRelation", "Possible Container Type relations between Containers."],
  ["ContentType", "Supported document and multimedia content types."],
  ["ContextResolution", "Override the system standard context resolution tables."],
  ["ECADLayerInformation", "Retrieve layer information when processing ECAD files."],
  ["EntityTag", "Link between a unique alphanumeric tag and the associated entity."],
  ["ExtraPropertiesDetails", "Properties extra Details for the GUI."],
  ["FileImportColumnInformation", "Defines the possible columns."],
  ["FileImportInformation", "Describes the possible type of files to be imported."],
  ["FileImportPropertyInformation", "Defines the possible system property values."],
  ["GUIElementDefaultValue", "Default values for GUI elements/operations."],
  ["InspectionSeverity", "Inspection severity ranks (tightening or reducing)."],
  ["IntegrationHandler", "Defines the integration handlers."],
  ["LabelMaterialProperty", "Material Properties referenced as Label Specification Field."],
  ["LabelSpecification", "Properties of the different Label Specifications."],
  ["LabelSpecificationField", "Label Specification Fields mapped to Label Material properties."],
  ["LabelSymbologyIdentifier", "Prefixes identifying a barcode type for a Label Specification."],
  ["MaterialFormRelation", "Form relations between Materials and Sub-Materials."],
  ["MaterialTransferUrgency", "Urgency of the Material Transfer for Material Logistics."],
  ["MoistureSensitivityLevel", "Properties of the different Moisture Sensitivity Levels."],
  ["NotificationSeverity", "Presentation behavior for the different notification severities."],
  ["PrintingIntegrationAuthenticationMethod", "Printing Integration Authentication Methods."],
  ["ProductUnitConversionFactors", "Product Unit Conversion Factors."],
  ["QualificationProficiency", "Qualification Proficiency values and ranking."],
  ["ResourceJobTypeSubType", "Resource Job Types with Resource Job Subtypes."],
  ["ScopeClassifications", "Scope Classifications Generic Table."],
  ["ShiftLogbookEntrySeverity", "Shift Logbook Entry severity."],
  ["Timezone", "Default time zones per region (convert to UTC and vice-versa)."],
  ["TimezoneAdjustmentRule", "Timezone adjustment rules with daylight saving settings."],
  ["TimezoneCulture", "Culture properties (formats) associated with timezone."],
  ["TransferOrderPriority", "Transfer order priority details for Material Logistics."],
  ["TransferRequirementPriority", "Transfer requirement priority details."],
  ["UIPageLayouts", "Pre-defined layouts to be used in UI Pages."],
  ["UnitConversionFactors", "Standard and Universal unit conversion factors."],
];

export function buildGenericTableSeeds(): GenericTableRecord[] {
  const generic = SYSTEM_TABLES.map(([name, description], index) => ({
    name,
    description,
    isSystem: true,
    state: index % 9 === 8 ? RecordState.Terminated : RecordState.Active,
    kind: "generic" as const,
  }));
  const lookup: GenericTableRecord[] = [
    {
      name: "Country",
      description: "List of countries for address information.",
      isSystem: true,
      state: RecordState.Active,
      kind: "lookup",
    },
    {
      name: "Currency",
      description: "List of currencies.",
      isSystem: true,
      state: RecordState.Active,
      kind: "lookup",
    },
    {
      name: "Language",
      description: "List of languages.",
      isSystem: true,
      state: RecordState.Active,
      kind: "lookup",
    },
  ];
  const smart: GenericTableRecord[] = [
    {
      name: "ChangeSetApprovalContext",
      description: "Resolves the approval role/workflow for Change Sets by context.",
      isSystem: true,
      state: RecordState.Active,
      kind: "smart",
    },
    {
      name: "ResourceContext",
      description: "Resolves resources by context.",
      isSystem: true,
      state: RecordState.Active,
      kind: "smart",
    },
  ];
  return [...generic, ...lookup, ...smart];
}

const CALENDAR_DAY_TYPE_COLUMNS: GenericTableColumnDef[] = [
  { name: "Type", dataType: "string", isKey: true },
  { name: "IsWorkingDay", dataType: "boolean", isKey: false },
  { name: "Code", dataType: "string", isKey: false },
  { name: "BackgroundColor", dataType: "string", isKey: false },
  { name: "ForegroundColor", dataType: "string", isKey: false },
];

const CALENDAR_DAY_TYPE_ROWS: Record<string, unknown>[] = [
  {
    Type: "CalendarNonWorking",
    IsWorkingDay: false,
    Code: "",
    BackgroundColor: "#BFBFBF",
    ForegroundColor: "#000000",
  },
  {
    Type: "CalendarWorking",
    IsWorkingDay: true,
    Code: "",
    BackgroundColor: "#FFFFFF",
    ForegroundColor: "#000000",
  },
  {
    Type: "EmployeeNonWorking",
    IsWorkingDay: false,
    Code: "",
    BackgroundColor: "#F2F2F2",
    ForegroundColor: "#000000",
  },
  {
    Type: "EmployeeWorking",
    IsWorkingDay: true,
    Code: "",
    BackgroundColor: "#FFFFFF",
    ForegroundColor: "#000000",
  },
  {
    Type: "Pool",
    IsWorkingDay: true,
    Code: "P",
    BackgroundColor: "#FCCFCF",
    ForegroundColor: "#000000",
  },
  {
    Type: "TemporaryAssignment",
    IsWorkingDay: true,
    Code: "T",
    BackgroundColor: "#CCF2FF",
    ForegroundColor: "#000000",
  },
  {
    Type: "AvailableToWork",
    IsWorkingDay: false,
    Code: "W",
    BackgroundColor: "#C2F0C2",
    ForegroundColor: "#000000",
  },
  {
    Type: "Error",
    IsWorkingDay: true,
    Code: "E",
    BackgroundColor: "#991E00",
    ForegroundColor: "#FFFFFF",
  },
  {
    Type: "Warning",
    IsWorkingDay: true,
    Code: "W",
    BackgroundColor: "#FFFF99",
    ForegroundColor: "#000000",
  },
  {
    Type: "EmployeeNonWorkingTime",
    IsWorkingDay: true,
    Code: "",
    BackgroundColor: "#F7F719",
    ForegroundColor: "#000000",
  },
];

export function buildGenericTableDetail(name: string): GenericTableDetail {
  const record = buildGenericTableSeeds().find((table) => table.name === name);
  const base = record ?? {
    name,
    description: `${name} Generic Table.`,
    isSystem: false,
    state: RecordState.Active,
    kind: "generic" as const,
  };
  if (name === "CalendarDayType") {
    return {
      ...base,
      dataGroup: "",
      enableHistory: true,
      historyDaysDefault: 0,
      localizedMessageKey: "",
      columns: CALENDAR_DAY_TYPE_COLUMNS,
      rows: CALENDAR_DAY_TYPE_ROWS,
    };
  }
  return {
    ...base,
    dataGroup: "",
    enableHistory: false,
    historyDaysDefault: 0,
    localizedMessageKey: "",
    columns: [
      { name: "Code", dataType: "string", isKey: true },
      { name: "Description", dataType: "string", isKey: false },
    ],
    rows: [
      { Code: "001", Description: "First record" },
      { Code: "002", Description: "Second record" },
    ],
  };
}
