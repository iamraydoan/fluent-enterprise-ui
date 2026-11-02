export type EntityItemKind = "property" | "attribute" | "operation" | "opAttr";

export interface AccessFlags {
  roView: boolean;
  roCreate: boolean;
  roUpdate: boolean;
  hidView: boolean;
  hidCreate: boolean;
  hidUpdate: boolean;
}

export interface AccessLevel {
  ent: AccessFlags;
  tpl: AccessFlags;
}

export interface EntityItem {
  id: string;
  kind: EntityItemKind;
  name: string;
  desc: string;
  system: boolean;
  enabled: boolean;
  refType: string;
  refTo: string;
  scalar: string;
  size: string;
  decimals: string;
  def: string;
  array: boolean;
  editableOnClone: boolean;
  copyOnClone: boolean;
  importMode: string;
  refMode: string;
  weak: boolean;
  weakType: string;
  weakEntity: string;
  exportAutoInclude: boolean;
  indexed: boolean;
  reportable: boolean;
  mandatory: boolean;
  searchable: boolean;
  searchType: string;
  versionedPortion: boolean;
  localOverrides: boolean;
  historyEnabled: boolean;
  dataGroup: string;
  range: string;
  regex: string;
  locKey: string;
  cloneOrder: string;
  state: string;
  toEnrichCDM: boolean;
  publishEvent: boolean;
  fabLive: boolean;
  kafka: boolean;
  type: string;
  al: AccessLevel;
}

export interface EntityTypeRow {
  name: string;
  description: string;
  system: boolean;
  relation: boolean;
  versioned: boolean;
  state: string;
}

export interface EntityTypeDetails {
  name: string;
  desc: string;
  system: boolean;
  state: string;
  licensed: boolean;
  uniqueName: boolean;
  replicateOds: boolean;
  historyEnabled: boolean;
  partitioned: boolean;
  visibleBD: boolean;
  connectIoT: boolean;
  semanticSearch: boolean;
  withAttributes: boolean;
  withOpAttributes: boolean;
  sysManagedSM: boolean;
  multipleSM: boolean;
  barcodeIds: boolean;
  canImport: boolean;
  canExport: boolean;
  relation: boolean;
  sourceEntity: string;
  targetEntity: string;
  lockType: string;
  cloneBehavior: string;
  histRetention: string;
  histInterval: string;
  purge: string;
  procedure: string;
  cloneable: boolean;
  locKey: string;
  versioned: boolean;
  allowAutoCS: boolean;
  makeEffective: boolean;
  csNameGen: string;
  approvalKind: string;
  approvalRef: string;
  notifyReq: boolean;
  notifyApp: boolean;
  useCsCtx: boolean;
  autoApproval: boolean;
  displayCsClone: boolean;
  allowDelete: boolean;
  defaultRevDates: boolean;
  versionCreation: boolean;
  newStateFirst: string;
  newStateNext: string;
}

export interface StateModel {
  name: string;
  desc: string;
  main: boolean;
}

export interface OdsRule {
  id: string;
  n: string;
  unit: string;
  loc: string;
}

export interface OdsModel {
  state: OdsRule[];
  history: OdsRule[];
}

export interface EntityTypeModel {
  properties: EntityItem[];
  attributes: EntityItem[];
  operations: EntityItem[];
  opAttributes: EntityItem[];
  stateModels: StateModel[];
  ods: OdsModel;
}

export interface EntityTypeStoreEntry {
  details: EntityTypeDetails;
  model: EntityTypeModel;
}

export interface SchemaContext {
  versioned: boolean;
  entityNames: string[];
}

export type SchemaFieldKind = "text" | "number" | "select" | "combo" | "switch" | "access" | "fixed";

export interface SchemaField {
  section: string;
  k: string;
  label: string;
  kind: SchemaFieldKind;
  req?: boolean;
  ro?: boolean;
  edit?: boolean;
  clearable?: boolean;
  opts?: string[];
  icon?: boolean;
  narrow?: boolean;
  value?: string;
  when?: (item: EntityItem, ctx: SchemaContext) => boolean;
}

export interface Issue {
  level: "error" | "warn";
  msg: string;
}

export const REF_PROP: string[] = ["Entity", "Entity Definition", "Entity Type", "Entity Version", "Enum", "File", "Lookup Table", "Lookup Value", "None", "Query", "Role", "User"];
export const REF_ATTR: string[] = ["None", "Lookup Value", "Lookup Table", "Enum"];
export const ENTITYISH: string[] = ["Entity", "Entity Definition", "Entity Type", "Entity Version"];
export const SCALARS: string[] = ["BigInt", "Boolean", "DateTime", "Decimal", "Int", "NVarChar", "VarChar"];
export const IMPORT_MODES: string[] = ["Override Always", "Override If Null", "Ignore"];
export const REF_MODES: string[] = ["Is Instance", "Is Part", "Is Reference"];
export const SEARCH_TYPES: string[] = ["Contains", "Starts With"];
export const LOCK_TYPES: string[] = ["LockNone", "LockSource", "LockTarget", "LockSourceAndTarget"];
export const CLONE_BEHAVIORS: string[] = ["CopyIfSource", "CopyIfSourceOrTarget", "CopyIfTarget", "NoCopy"];
export const PURGE_TYPES: string[] = ["Generic", "Specific", "Bypass"];
export const NAME_GENERATORS: string[] = ["ChangeSetNameGenerator", "DefaultNameGenerator", "SequentialNameGenerator"];
export const ROLES: string[] = ["Administrators", "Supervisors", "Quality Engineers", "Operators"];
export const WORKFLOWS: string[] = ["Single Approval", "Two-Step Approval", "Quality Approval"];
export const STATES: string[] = ["Created", "Active", "InReview", "Released"];
export const DATA_GROUPS: string[] = ["Default", "Quality", "Production"];

const REF_TO: Record<string, string[]> = {
  Enum: ["Cmf.Foundation.BusinessObjects.UIType", "Cmf.Foundation.Common.LogLevel", "Cmf.Navigo.BusinessObjects.MaterialState"],
  "Lookup Table": ["ScrapReasons", "HoldReasons", "Shifts"],
  "Lookup Value": ["ScrapReasons.Damaged", "HoldReasons.Quality", "Shifts.Morning"],
  Role: ROLES,
  User: ["admin", "operator1", "supervisor1"],
  Query: ["ActiveContainers", "OpenOrders"],
  File: ["Instructions.pdf", "Drawing.dwg"],
};

export function refToOptions(refType: string, entityNames: string[]): string[] {
  return ENTITYISH.includes(refType) ? entityNames : REF_TO[refType] ?? [];
}

let uid = 1;
export const nid = (): string => "i" + String(uid++);
export const spaced = (s: string | null | undefined): string => String(s ?? "").replace(/([a-z])([A-Z])/g, "$1 $2");

export function detailsFor(row: EntityTypeRow): EntityTypeDetails {
  return {
    name: row.name,
    desc: row.description,
    system: row.system,
    state: row.state,
    licensed: row.system,
    uniqueName: true,
    replicateOds: true,
    historyEnabled: true,
    partitioned: false,
    visibleBD: true,
    connectIoT: false,
    semanticSearch: false,
    withAttributes: true,
    withOpAttributes: true,
    sysManagedSM: false,
    multipleSM: true,
    barcodeIds: false,
    canImport: true,
    canExport: true,
    relation: row.relation,
    sourceEntity: "",
    targetEntity: "",
    lockType: "LockNone",
    cloneBehavior: "NoCopy",
    histRetention: "180",
    histInterval: "180",
    purge: "Generic",
    procedure: "",
    cloneable: true,
    locKey: `Cmf.Navigo.BusinessObjects.${row.name}`,
    versioned: row.versioned,
    allowAutoCS: false,
    makeEffective: false,
    csNameGen: "",
    approvalKind: "Role",
    approvalRef: "",
    notifyReq: false,
    notifyApp: false,
    useCsCtx: false,
    autoApproval: false,
    displayCsClone: false,
    allowDelete: false,
    defaultRevDates: false,
    versionCreation: true,
    newStateFirst: "",
    newStateNext: "",
  };
}

const blank: Omit<EntityItem, "id" | "kind" | "name" | "type" | "al"> = {
  desc: "",
  system: false,
  enabled: true,
  refType: "None",
  refTo: "",
  scalar: "NVarChar",
  size: "50",
  decimals: "",
  def: "",
  array: false,
  editableOnClone: false,
  copyOnClone: false,
  importMode: "Override Always",
  refMode: "",
  weak: false,
  weakType: "",
  weakEntity: "",
  exportAutoInclude: false,
  indexed: false,
  reportable: true,
  mandatory: false,
  searchable: false,
  searchType: "Starts With",
  versionedPortion: false,
  localOverrides: false,
  historyEnabled: false,
  dataGroup: "",
  range: "",
  regex: "",
  locKey: "",
  cloneOrder: "1",
  state: "Active",
  toEnrichCDM: false,
  publishEvent: false,
  fabLive: false,
  kafka: false,
};

const ALF: AccessFlags = { roView: false, roCreate: false, roUpdate: false, hidView: false, hidCreate: false, hidUpdate: false };

export const alOf = (o: Partial<AccessFlags> = {}): AccessLevel => ({ ent: { ...ALF, ...o }, tpl: { ...ALF, ...o } });

export const mk = (kind: EntityItemKind, name: string, o: Partial<EntityItem> = {}): EntityItem =>
  Object.assign(
    {
      id: nid(),
      kind,
      name,
      type: kind === "property" ? "Property" : kind === "operation" ? "" : "Attribute",
      ...blank,
      al: alOf(),
    },
    o,
  );

export const newItem = (kind: EntityItemKind, items: EntityItem[]): EntityItem => {
  const bases: Record<EntityItemKind, string> = {
    property: "Custom Property",
    attribute: "CustomAttribute",
    operation: "CustomOperation",
    opAttr: "CustomOperationAttribute",
  };
  const base = bases[kind];
  let name = base;
  let n = 1;
  while (items.some((i) => i.name.toLowerCase() === name.toLowerCase())) {
    n += 1;
    name = kind === "property" ? `${base} ${n}` : `${base}${n}`;
  }
  return mk(kind, name, {
    reportable: kind !== "operation",
    ...(kind === "property" ? { refType: "None", scalar: "NVarChar" } : {}),
  });
};

const SYS_ORDER_CREATED: string[] = ["RevisionState", "Revision", "Name", "Description", "MainStateModelStateReason", "OwnerInstance", "DataGroupName", "CreatedBy", "ModifiedBy", "LockedBy", "DocumentationURL", "Image"];
const SYS_GENERIC: string[] = ["Name", "Description", "CreatedBy", "CreatedOn", "ModifiedBy", "ModifiedOn", "LockedBy", "OwnerInstance", "DataGroupId", "DataGroupName", "DocumentationURL", "Image", "MainStateModelStateReason"];

function systemProps(row: EntityTypeRow, created: boolean): EntityItem[] {
  const nm = row.name;
  const P = (n: string, desc: string, o: Partial<EntityItem> = {}): EntityItem => mk("property", n, { system: true, desc, ...o });
  const common: Record<string, EntityItem> = {
    Name: P("Name", `${nm} Name`, { mandatory: true, searchable: true, size: "256", regex: ".+", historyEnabled: true, copyOnClone: true, al: alOf({ roUpdate: true }) }),
    Description: P("Description", `${nm} Description.`, { size: "255" }),
    CreatedBy: P("CreatedBy", "User that created the object.", { al: alOf({ roCreate: true, roUpdate: true }) }),
    CreatedOn: P("CreatedOn", "Creation date and time.", { scalar: "DateTime", size: "0", al: alOf({ roCreate: true, roUpdate: true }) }),
    ModifiedBy: P("ModifiedBy", "User that last modified the object.", { al: alOf({ roCreate: true, roUpdate: true }) }),
    ModifiedOn: P("ModifiedOn", "Last modification date and time.", { scalar: "DateTime", size: "0", al: alOf({ roCreate: true, roUpdate: true }) }),
    LockedBy: P("LockedBy", "User holding the lock on the object."),
    OwnerInstance: P("OwnerInstance", "MES instance that owns the object."),
    DataGroupId: P("DataGroupId", "Identifier of the data group.", { scalar: "BigInt", size: "0" }),
    DataGroupName: P("DataGroupName", "Name of the data group."),
    DocumentationURL: P("DocumentationURL", "Link to the object documentation.", { size: "512" }),
    Image: P("Image", "Image of the object.", { size: "512" }),
    MainStateModelStateReason: P("MainStateModelStateReason", "Reason of the main state model state."),
    Revision: P("Revision", "Revision of the object.", { size: "50" }),
    RevisionState: P("RevisionState", "State of the revision.", { size: "50" }),
  };
  if (created) {
    return SYS_ORDER_CREATED.filter((n) => row.versioned || !n.startsWith("Revision")).map((n) => common[n]);
  }
  let list: EntityItem[] = SYS_GENERIC.map((n) => common[n]);
  if (nm === "Container") {
    list = [
      P("CapacityForm", "Form of the container capacity."),
      P("CapacityPerPosition", "Capacity each position can carry in number of units;", { scalar: "Decimal", size: "18", decimals: "8" }),
      P("CapacityUnits", "Units of the container capacity."),
      P("CapacityValidationMode", "Validation mode for the container capacity."),
      ...list,
      P("Facility", "Facility of the container."),
      P("HoldCount", "Number of holds.", { scalar: "Int", size: "0" }),
    ];
  } else if (nm === "Calendar") {
    list = list.map((p) => (p.name === "Description" ? { ...p, searchable: true } : p));
    list.push(P("TimeZone", "The time zone of the Facility.", { searchable: true }));
  }
  if (row.versioned) {
    list.push(common.Revision, common.RevisionState);
  }
  return list.sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));
}

const OPS: string[] = ["SaveRelations", "AddRelations", "RemoveRelations", "SetObjectsLocation", "Load", "SaveAttributes", "RemoveAttributes", "AddRelatedEntities", "CreateTemplate", "Create", "LogEvent", "Unterminate", "Terminate", "Edit", "ChangeState", "Clone"];
const OPS_WITH_HISTORY: string[] = ["SaveAttributes", "Create", "Edit", "Terminate", "Unterminate", "ChangeState", "Clone"];

export function modelFor(row: EntityTypeRow, created: boolean): EntityTypeModel {
  const nm = row.name;
  const attrs: EntityItem[] =
    nm === "Container"
      ? [mk("attribute", "Notes", { desc: "Free-text notes.", size: "255", copyOnClone: true }), mk("attribute", "Color", { desc: "Container color.", size: "20" })]
      : nm === "Calendar"
        ? [mk("attribute", "Notes", { desc: "Free-text notes.", size: "255" })]
        : [];
  return {
    properties: systemProps(row, created),
    attributes: attrs,
    operations: OPS.map((n) => mk("operation", n, { system: true, desc: n, historyEnabled: OPS_WITH_HISTORY.includes(n) })),
    opAttributes: [],
    stateModels: [{ name: `${nm}StateModel`, desc: `Main state model of ${nm}`, main: true }],
    ods: {
      state: [
        { id: nid(), n: "90", unit: "Days", loc: "default" },
        { id: nid(), n: "180", unit: "Days", loc: "Delete" },
      ],
      history: [],
    },
  };
}

const STORE = new Map<string, EntityTypeStoreEntry>();

export function entityStore(row: EntityTypeRow, created = false): EntityTypeStoreEntry {
  let entry = STORE.get(row.name);
  if (!entry) {
    entry = { details: detailsFor(row), model: modelFor(row, created) };
    STORE.set(row.name, entry);
  }
  return entry;
}

export const setEntityStore = (name: string, entry: EntityTypeStoreEntry): void => {
  STORE.set(name, entry);
};

const isEntityish = (i: EntityItem): boolean => ENTITYISH.includes(i.refType);

export const eligibleSearch = (i: EntityItem): boolean =>
  i.refType === "None" && ["VarChar", "NVarChar"].includes(i.scalar) && Number(i.size) >= 1 && Number(i.size) <= 512;

const T: SchemaFieldKind = "text";
const N: SchemaFieldKind = "number";
const S: SchemaFieldKind = "select";
const C: SchemaFieldKind = "combo";
const W: SchemaFieldKind = "switch";
const A: SchemaFieldKind = "access";

interface RawFieldOptions {
  req?: boolean;
  ro?: boolean;
  edit?: boolean;
  clearable?: boolean;
  opts?: string[];
  icon?: boolean;
  narrow?: boolean;
  value?: string;
  off?: boolean;
  ent?: boolean;
  when?: (item: EntityItem, ctx: SchemaContext) => boolean;
}

type RawField = [string, string, string, SchemaFieldKind, RawFieldOptions];

const propertyFields: RawField[] = [
  ["Property Details", "name", "Name", T, { req: true, ro: true }],
  ["Property Details", "desc", "Description", T, { ro: true }],
  ["Property Details", "type", "Type", "fixed", { value: "Property" }],
  ["Property Details", "enabled", "Enabled", W, { ro: true }],
  ["Content", "refType", "Reference Type", S, { req: true, opts: REF_PROP, ro: true }],
  ["Content", "refTo", "Reference To", C, { req: true, when: (i) => i.refType !== "None", ro: true }],
  ["Content", "scalar", "Scalar Type", S, { req: true, opts: SCALARS, when: (i) => i.refType === "None", ro: true }],
  ["Content", "size", "Size", N, { narrow: true, ro: true }],
  ["Content", "decimals", "Decimal Places", N, { narrow: true, when: (i) => i.refType === "None" && i.scalar === "Decimal", ro: true }],
  ["Content", "def", "Default Value", T, { ro: true }],
  ["Content", "array", "Array", W, { off: true, ro: true }],
  ["Content", "editableOnClone", "Editable On Clone", W, { ro: true }],
  ["Content", "copyOnClone", "Copy On Clone", W, { when: (i) => !i.system }],
  ["Content", "importMode", "Import Update Mode", S, { req: true, opts: IMPORT_MODES, edit: true }],
  ["Content", "refMode", "Reference Mode", S, { opts: REF_MODES, when: (i) => isEntityish(i) && !i.weak, ro: true }],
  ["Content", "weak", "Is Weak Reference", W, { when: (i) => i.refType === "None" && i.scalar === "BigInt", ro: true }],
  ["Content", "weakType", "Weak Reference Type", S, { req: true, opts: ENTITYISH, when: (i) => i.weak && i.refType === "None" && i.scalar === "BigInt", ro: true }],
  ["Content", "weakEntity", "Weak Reference Entity Type", C, { req: true, ent: true, when: (i) => i.weak && i.refType === "None" && i.scalar === "BigInt", ro: true }],
  ["Content", "exportAutoInclude", "Export Auto Include", W, { when: (i) => isEntityish(i) || (i.weak && i.scalar === "BigInt"), ro: true }],
  ["Flags", "indexed", "Indexed", W, { ro: true }],
  ["Flags", "reportable", "Reportable", W, { ro: true }],
  ["Flags", "mandatory", "Mandatory", W, { ro: true }],
  ["Flags", "searchable", "Searchable", W, { when: eligibleSearch, ro: true }],
  ["Flags", "searchType", "Search Type", S, { opts: SEARCH_TYPES, clearable: false, when: (i) => i.searchable && eligibleSearch(i), ro: true }],
  ["Flags", "versionedPortion", "Versioned", W, { when: (_i, c) => c.versioned, ro: true }],
  ["Flags", "localOverrides", "Enable Local Overrides", W, { when: (i) => !i.system, ro: true }],
  ["Validation", "range", "Range", T, { ro: true }],
  ["Validation", "regex", "Regular Expression", T, { ro: true }],
  ["Localized Message", "locKey", "Key", T, { ro: true }],
  ["Access Level", "al", "Access Level", A, { ro: true }],
];

const attrFields = (full: boolean): RawField[] => [
  ["Property Details", "name", "Name", T, { req: true, ro: true }],
  ["Property Details", "desc", "Description", T, { ro: true }],
  ...(full ? [["Property Details", "type", "Type", S, { opts: ["Attribute"], ro: true }] as RawField] : []),
  ["Property Details", "dataGroup", "Data Group", S, { opts: DATA_GROUPS, icon: true, ro: true }],
  ["Property Details", "enabled", "Enabled", W, { ro: true }],
  ["Content", "refType", "Reference Type", S, { req: true, opts: REF_ATTR, ro: true }],
  ["Content", "refTo", "Reference To", C, { req: true, when: (i) => i.refType === "Lookup Value" || i.refType === "Enum", ro: true }],
  ["Content", "scalar", "Scalar Type", S, { req: true, opts: SCALARS, when: (i) => i.refType === "None", ro: true }],
  ["Content", "size", "Size", N, { narrow: true, ro: true }],
  ["Content", "decimals", "Decimal Places", N, { narrow: true, when: (i) => i.refType === "None" && i.scalar === "Decimal", ro: true }],
  ["Content", "def", "Default Value", T, { ro: true }],
  ["Content", "array", "Array", W, { ro: true }],
  ...(full
    ? [
        ["Content", "copyOnClone", "Copy On Clone", W, { ro: true }] as RawField,
        ["Content", "importMode", "Import Update Mode", S, { req: true, opts: IMPORT_MODES, edit: true }] as RawField,
      ]
    : []),
  ["Flags", "indexed", "Indexed", W, { ro: true }],
  ["Flags", "reportable", "Reportable", W, { ro: true }],
  ["Flags", "historyEnabled", "History Enabled", W, { ro: true }],
  ...(full ? [["Flags", "versionedPortion", "Versioned", W, { when: (_i, c) => c.versioned, ro: true }] as RawField] : []),
  ["Validation", "range", "Range", T, { ro: true }],
  ["Validation", "regex", "Regular Expression", T, { ro: true }],
  ["Localized Message", "locKey", "Key", T, { ro: true }],
  ["Access Level", "al", "Access Level", A, { ro: true }],
];

const opFields: RawField[] = [
  ["Operation Details", "name", "Name", T, { req: true, ro: true }],
  ["Operation Details", "desc", "Description", T, { ro: true }],
  ["Flags", "historyEnabled", "History Enabled", W, { edit: true }],
  ["Flags", "publishEvent", "Publish Event On Completion", W, { edit: true }],
  ["Flags", "fabLive", "Subscribe In FabLive", W, { edit: true }],
  ["Flags", "kafka", "Publish To Kafka", W, { edit: true }],
];

const toSchema = (arr: RawField[]): SchemaField[] =>
  arr.map(([section, k, label, kind, o]) => {
    const { off: _off, ent: _ent, ...rest } = o;
    return { section, k, label, kind, ...rest };
  });

export const SCHEMAS: Record<EntityItemKind, SchemaField[]> = {
  property: toSchema(propertyFields),
  attribute: toSchema(attrFields(true)),
  opAttr: toSchema(attrFields(false)),
  operation: toSchema(opFields),
};

export const KIND_LABEL: Record<EntityItemKind, string> = {
  property: "Properties",
  attribute: "Attributes",
  operation: "Operations",
  opAttr: "Operation Attributes",
};

export const KIND_TITLE: Record<EntityItemKind, string> = {
  property: "Manage Entity Type Properties",
  attribute: "Manage Entity Type Attributes",
  operation: "Manage Entity Type Operations",
  opAttr: "Manage Entity Type Operation Attributes",
};

const fieldValue = (item: EntityItem, key: string): unknown => (item as unknown as Record<string, unknown>)[key];

export function validateItems(kind: EntityItemKind, items: EntityItem[], ctx: SchemaContext): Map<string, Issue[]> {
  const out = new Map<string, Issue[]>();
  const add = (id: string, level: Issue["level"], msg: string): void => {
    if (!out.has(id)) {
      out.set(id, []);
    }
    const list = out.get(id);
    if (list) {
      list.push({ level, msg });
    }
  };
  const schema = SCHEMAS[kind];
  let searchCount = items.filter((i) => i.system && i.searchable && i.name !== "Name").length;
  items.forEach((i) => {
    if (i.system) {
      return;
    }
    if (!i.name.trim()) {
      add(i.id, "error", "Name is required.");
    } else if (items.some((o) => o !== i && o.name.toLowerCase() === i.name.trim().toLowerCase())) {
      add(i.id, "error", "Another item already uses this name.");
    } else if (kind !== "property" && !/^[A-Za-z][A-Za-z0-9]*$/.test(i.name)) {
      add(i.id, "error", "The first character must be a letter and subsequent characters can be letters or digits.");
    }
    schema.forEach((f) => {
      if (f.req && f.k !== "name" && (!f.when || f.when(i, ctx)) && !String(fieldValue(i, f.k) ?? "").trim()) {
        add(i.id, "error", `${f.label} is required.`);
      }
    });
    if (kind === "property" && i.searchable && eligibleSearch(i)) {
      searchCount += 1;
      if (searchCount > 2) {
        add(i.id, "error", "Excluding the Name, it's not possible to mark more than two properties as searchable.");
      }
      if (i.searchType === "Contains") {
        add(i.id, "warn", "Contains search type might affect the performance of the entity search");
      }
    }
  });
  return out;
}
