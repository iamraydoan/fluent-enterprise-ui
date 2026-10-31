import type {
  BarcodeEntityInfo,
  BarcodeEntityKind,
  BarcodeIdentificationSettings,
  ScannedBarcode,
} from "@/api";

const LOOKUP: Record<string, ScannedBarcode> = {
  "BAKER-01": { code: "BAKER-01", entityKind: "resource", name: "Baker-01", state: "Up" },
  "BAKER-02": { code: "BAKER-02", entityKind: "resource", name: "Baker-02", state: "Up" },
  AS_MAT1: { code: "AS_MAT1", entityKind: "material", name: "AS_MAT1", state: "Dispatched" },
  "CONT-001": { code: "CONT-001", entityKind: "container", name: "CONT-001", state: "Available" },
};

const INFO: Record<string, BarcodeEntityInfo> = {
  "BAKER-01": {
    code: "BAKER-01",
    entityKind: "resource",
    titleKey: "manufacturing.barcodeIdentification.info.resourceTitle",
    rows: [
      {
        labelKey: "manufacturing.barcodeIdentification.info.resource",
        value: "Baker-01",
        link: true,
      },
      { labelKey: "manufacturing.barcodeIdentification.info.systemState", value: "Up" },
      {
        labelKey: "manufacturing.barcodeIdentification.info.currentState",
        value: "SEMI E10 > Standby",
      },
      {
        labelKey: "manufacturing.barcodeIdentification.info.description",
        value: "Baker-01 Resource",
      },
      {
        labelKey: "manufacturing.barcodeIdentification.info.type",
        value: "Standard",
        link: true,
      },
      { labelKey: "manufacturing.barcodeIdentification.info.materialsDispatched", value: "0" },
      { labelKey: "manufacturing.barcodeIdentification.info.materialsInProcess", value: "0" },
    ],
  },
  "BAKER-02": {
    code: "BAKER-02",
    entityKind: "resource",
    titleKey: "manufacturing.barcodeIdentification.info.resourceTitle",
    rows: [
      {
        labelKey: "manufacturing.barcodeIdentification.info.resource",
        value: "Baker-02",
        link: true,
      },
      { labelKey: "manufacturing.barcodeIdentification.info.systemState", value: "Up" },
      {
        labelKey: "manufacturing.barcodeIdentification.info.currentState",
        value: "SEMI E10 > Standby",
      },
      {
        labelKey: "manufacturing.barcodeIdentification.info.description",
        value: "Baker-02 Resource",
      },
      {
        labelKey: "manufacturing.barcodeIdentification.info.type",
        value: "Standard",
        link: true,
      },
      { labelKey: "manufacturing.barcodeIdentification.info.materialsDispatched", value: "0" },
      { labelKey: "manufacturing.barcodeIdentification.info.materialsInProcess", value: "0" },
    ],
  },
  AS_MAT1: {
    code: "AS_MAT1",
    entityKind: "material",
    titleKey: "manufacturing.barcodeIdentification.info.materialTitle",
    rows: [
      {
        labelKey: "manufacturing.barcodeIdentification.info.material",
        value: "AS_MAT1",
        link: true,
      },
      { labelKey: "manufacturing.barcodeIdentification.info.state", value: "Dispatched" },
      { labelKey: "manufacturing.barcodeIdentification.info.product", value: "Cookie [A]" },
      { labelKey: "manufacturing.barcodeIdentification.info.quantity", value: "500 Kg" },
      { labelKey: "manufacturing.barcodeIdentification.info.location", value: "Warehouse A" },
    ],
  },
  "CONT-001": {
    code: "CONT-001",
    entityKind: "container",
    titleKey: "manufacturing.barcodeIdentification.info.containerTitle",
    rows: [
      {
        labelKey: "manufacturing.barcodeIdentification.info.container",
        value: "CONT-001",
        link: true,
      },
      { labelKey: "manufacturing.barcodeIdentification.info.state", value: "Available" },
      { labelKey: "manufacturing.barcodeIdentification.info.location", value: "Warehouse A" },
      { labelKey: "manufacturing.barcodeIdentification.info.capacity", value: "100" },
    ],
  },
};

const DEFAULT_SETTINGS: BarcodeIdentificationSettings = {
  barcodePropertyByEntity: {
    material: "Name",
    resource: "Name",
    container: "Name",
  } satisfies Record<BarcodeEntityKind, string>,
};

let settingsOverride: BarcodeIdentificationSettings | null = null;

export function lookupBarcode(code: string): ScannedBarcode | null {
  const normalized = code.trim().toUpperCase();
  return LOOKUP[normalized] ?? null;
}

export function getBarcodeEntityInfo(code: string): BarcodeEntityInfo | null {
  const normalized = code.trim().toUpperCase();
  return INFO[normalized] ?? null;
}

export function getBarcodeIdentificationSettings(): BarcodeIdentificationSettings {
  return settingsOverride ?? DEFAULT_SETTINGS;
}

export function updateBarcodeIdentificationSettings(
  settings: BarcodeIdentificationSettings,
): BarcodeIdentificationSettings {
  settingsOverride = settings;
  return settingsOverride;
}
