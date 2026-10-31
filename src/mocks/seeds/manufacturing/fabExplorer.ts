import type { FabMaterial, FabResource, Page, FabResourceDetail, StepSummary } from "@/api";

const MATERIAL_NAMES = [
  "AttrMaterial",
  "Cookie02",
  "Cookie02.2_Clor",
  "Cookie02_Clone",
  "ExpGuiMat#IG",
  "Flour 1",
  "Flour 10",
  "Sugar 5",
  "Butter 2",
  "ChocoChip 7",
  "DoughMix A",
  "DoughMix B",
];

const MATERIAL_STATES = ["Queued", "In Process", "Queued", "Queued", "Queued"];

function buildStepMaterials(step: string, count: number): FabMaterial[] {
  const rows: FabMaterial[] = [];
  for (let i = 0; i < count; i++) {
    const base = MATERIAL_NAMES[i % MATERIAL_NAMES.length];
    const name = i < MATERIAL_NAMES.length ? base : `${base}_${i}`;
    rows.push({
      name,
      qty: [10, 19, 1, 20, 85, 100, 7, 1000, 9800, 25, 40, 60][i % 12],
      units: "Kg",
      product: i % 9 === 8 ? "Flour" : "Belgas",
      flow: i % 7 === 6 ? "CookiesFlowIG" : "CookiesFlow",
      step,
      priority: 5,
      state: MATERIAL_STATES[i % MATERIAL_STATES.length],
      inOffFlow: i % 11 === 3,
      subMaterialCount: i % 9 === 1 ? 2 : i % 13 === 5 ? 1 : 0,
    });
  }
  return rows;
}

const STEP_MATERIALS: Record<string, FabMaterial[]> = {
  Mixing: buildStepMaterials("Mixing", 91),
  Moulding: buildStepMaterials("Moulding", 34),
  Baking: buildStepMaterials("Baking", 58),
};

const STEP_RESOURCES: Record<string, FabResource[]> = {
  Mixing: [
    {
      name: "Mixer-01",
      description: "Mixer-01 Resource",
      processingType: "Process",
      group: "",
      systemState: "Up",
      state: "Productive",
    },
    {
      name: "Mixer-02",
      description: "Mixer-02 Resource",
      processingType: "Process",
      group: "",
      systemState: "Up",
      state: "Productive",
    },
    {
      name: "Mixer-03",
      description: "Mixer-03 Resource",
      processingType: "Process",
      group: "",
      systemState: "Down",
      state: "Unscheduled Down",
    },
    {
      name: "Mixer-04",
      description: "Mixer-04 Resource",
      processingType: "Process",
      group: "",
      systemState: "Up",
      state: "Productive",
    },
    {
      name: "Mixer-05",
      description: "Mixer-05 Resource",
      processingType: "Process",
      group: "",
      systemState: "Up",
      state: "Productive",
    },
    {
      name: "Mixer-99",
      description: "Mixer-04 Resource",
      processingType: "Process",
      group: "",
      systemState: "Up",
      state: "Productive",
    },
    {
      name: "MixerWD",
      description: "Mixer for WD scenario",
      processingType: "Process",
      group: "",
      systemState: "Up",
      state: "Standby",
    },
    {
      name: "Mixer-03_Clone",
      description: "Mixer-03 Resource",
      processingType: "Process",
      group: "",
      systemState: "Up",
      state: "Standby",
    },
    {
      name: "Mixer-01_Clone",
      description: "Mixer-01 Resource",
      processingType: "Process",
      group: "",
      systemState: "Up",
      state: "Standby",
    },
    {
      name: "Mixer-100",
      description: "Mixer-02 Resource",
      processingType: "Process",
      group: "",
      systemState: "Up",
      state: "Productive",
    },
    {
      name: "Mixer-101",
      description: "Mixer-02 Resource",
      processingType: "Process",
      group: "",
      systemState: "Up",
      state: "Standby",
    },
    {
      name: "Mixer-101.CF3",
      description: "Mixer-02 Resource",
      processingType: "Process",
      group: "",
      systemState: "Up",
      state: "Productive",
    },
    {
      name: "MixerWD#2",
      description: "Mixer for WD scenario",
      processingType: "Process",
      group: "",
      systemState: "Up",
      state: "Standby",
    },
  ],
  Moulding: [
    {
      name: "Moulder-01",
      description: "Moulder-01 Resource",
      processingType: "Process",
      group: "",
      systemState: "Up",
      state: "Productive",
    },
    {
      name: "Moulder-02",
      description: "Moulder-02 Resource",
      processingType: "Process",
      group: "",
      systemState: "Up",
      state: "Standby",
    },
  ],
};

const RESOURCE_DETAILS: Record<string, FabResourceDetail> = {
  "Mixer-01": {
    name: "Mixer-01",
    description: "Mixer-01 Resource",
    processingType: "Process",
    group: "",
    systemState: "Up",
    state: "Productive",
    dispatchCount: 43,
    materialsCount: 20,
    loadPortCount: 2,
    subResourceCount: 3,
    consumableCount: 4,
    durableCount: 2,
    recipe: "Rec_No_Parms",
    upcomingMaintenanceCount: 11,
    alertCount: 0,
  },
  "PW 1 OPP": {
    name: "PW 1 OPP",
    description: "Production Warehouse OPP",
    processingType: "Storage",
    group: "",
    systemState: "Up",
    state: "Productive",
    dispatchCount: 0,
    materialsCount: 7,
    loadPortCount: 0,
    subResourceCount: 0,
    consumableCount: 0,
    durableCount: 0,
    recipe: "",
    upcomingMaintenanceCount: 0,
    alertCount: 0,
  },
};

function buildResourceMaterials(count: number, baseStep: string): FabMaterial[] {
  const rows: FabMaterial[] = [];
  for (let i = 0; i < count; i++) {
    rows.push({
      name: `IB_MAT${String(i + 3).padStart(2, "0")}`,
      qty: [9, 5, 5, 8, 8, 10, 6][i % 7],
      units: "Kg",
      product: "Belgas",
      flow: "CookiesFlow",
      step: baseStep,
      priority: 5,
      state: "In Process",
      inOffFlow: false,
      subMaterialCount: i % 4 === 1 ? 3 : i % 6 === 4 ? 2 : 0,
    });
  }
  return rows;
}

const RESOURCE_MATERIALS: Record<string, FabMaterial[]> = {
  "Mixer-01": buildResourceMaterials(20, "Mixing"),
};

function buildDispatchList(count: number): FabMaterial[] {
  const rows: FabMaterial[] = [];
  for (let i = 0; i < count; i++) {
    const base = MATERIAL_NAMES[i % MATERIAL_NAMES.length];
    rows.push({
      name: i < MATERIAL_NAMES.length ? `DSP_${base}` : `DSP_${base}_${i}`,
      qty: [10, 19, 1, 20, 85, 100, 7, 1000][i % 8],
      units: "Kg",
      product: "Belgas",
      flow: "CookiesFlow",
      step: "Mixing",
      priority: 5,
      state: "Queued",
      inOffFlow: false,
      subMaterialCount: 0,
    });
  }
  return rows;
}

const DISPATCH_LISTS: Record<string, FabMaterial[]> = {
  "Mixer-01": buildDispatchList(43),
};

const STORED_MATERIALS: FabMaterial[] = [
  {
    name: "Material20200900001",
    qty: 125,
    units: "",
    product: "RawMaterial4",
    flow: "Production Warehouse",
    step: "Storage 4",
    priority: 0,
    state: "Queued",
    inOffFlow: false,
    subMaterialCount: 0,
  },
  {
    name: "Material20200900002",
    qty: 200,
    units: "",
    product: "RawMaterial4",
    flow: "Production Warehouse",
    step: "Storage 4",
    priority: 0,
    state: "Queued",
    inOffFlow: false,
    subMaterialCount: 0,
  },
  {
    name: "MAT_STORAGE_3",
    qty: 500,
    units: "",
    product: "RawMaterial1",
    flow: "Production Warehouse",
    step: "Storage 4",
    priority: 0,
    state: "Queued",
    inOffFlow: false,
    subMaterialCount: 0,
  },
  {
    name: "MAT_STORAGE_147",
    qty: 1000,
    units: "",
    product: "RawMaterial2",
    flow: "Production Warehouse",
    step: "Storage 4",
    priority: 0,
    state: "Queued",
    inOffFlow: false,
    subMaterialCount: 0,
  },
  {
    name: "MAT_STORAGE_43",
    qty: 500,
    units: "",
    product: "RawMaterial3",
    flow: "Production Warehouse",
    step: "Storage 4",
    priority: 0,
    state: "Queued",
    inOffFlow: false,
    subMaterialCount: 0,
  },
  {
    name: "MAT_1",
    qty: 100,
    units: "",
    product: "RawMaterial3",
    flow: "Production Warehouse",
    step: "Storage 5",
    priority: 0,
    state: "Queued",
    inOffFlow: false,
    subMaterialCount: 0,
  },
  {
    name: "MAT_STORAGE_40",
    qty: 500,
    units: "",
    product: "RawMaterial3",
    flow: "Production Warehouse",
    step: "Storage 4",
    priority: 0,
    state: "Queued",
    inOffFlow: false,
    subMaterialCount: 0,
  },
];

function paginate<T>(rows: T[], page: number, limit: number): Page<T> {
  const start = (page - 1) * limit;
  return {
    data: rows.slice(start, start + limit),
    meta: { total: rows.length, page, limit },
  };
}

function filterMaterials(
  rows: FabMaterial[],
  q?: string,
  state?: string,
  product?: string,
  flow?: string,
): FabMaterial[] {
  let result = rows;
  if (q) {
    const needle = q.toLowerCase();
    result = result.filter((r) => r.name.toLowerCase().includes(needle));
  }
  if (state) result = result.filter((r) => r.state === state);
  if (product) result = result.filter((r) => r.product === product);
  if (flow) result = result.filter((r) => r.flow === flow);
  return result;
}

export function queryStepMaterials(
  step: string,
  page: number,
  limit: number,
  q?: string,
  state?: string,
  product?: string,
  flow?: string,
): Page<FabMaterial> {
  const rows = filterMaterials(STEP_MATERIALS[step] ?? [], q, state, product, flow);
  return paginate(rows, page, limit);
}

export function queryStepResources(
  step: string,
  page: number,
  limit: number,
  q?: string,
  processingType?: string,
  systemState?: string,
  state?: string,
): Page<FabResource> {
  let rows = STEP_RESOURCES[step] ?? [];
  if (q) {
    const needle = q.toLowerCase();
    rows = rows.filter((r) => r.name.toLowerCase().includes(needle));
  }
  if (processingType) rows = rows.filter((r) => r.processingType === processingType);
  if (systemState) rows = rows.filter((r) => r.systemState === systemState);
  if (state) rows = rows.filter((r) => r.state === state);
  return paginate(rows, page, limit);
}

export function queryResourceMaterials(
  resource: string,
  page: number,
  limit: number,
  q?: string,
  state?: string,
): Page<FabMaterial> {
  const source =
    RESOURCE_DETAILS[resource]?.processingType === "Storage"
      ? STORED_MATERIALS
      : (RESOURCE_MATERIALS[resource] ?? []);
  return paginate(filterMaterials(source, q, state), page, limit);
}

export function queryDispatchList(
  resource: string,
  page: number,
  limit: number,
  q?: string,
): Page<FabMaterial> {
  return paginate(filterMaterials(DISPATCH_LISTS[resource] ?? [], q), page, limit);
}

export function buildResourceDetail(name: string): FabResourceDetail {
  const detail = RESOURCE_DETAILS[name];
  if (detail) return detail;
  const fromStep = Object.values(STEP_RESOURCES)
    .flat()
    .find((r) => r.name === name);
  return {
    name,
    description: fromStep?.description ?? `${name} Resource`,
    processingType: fromStep?.processingType ?? "Process",
    group: fromStep?.group ?? "",
    systemState: fromStep?.systemState ?? "Up",
    state: fromStep?.state ?? "Productive",
    dispatchCount: 0,
    materialsCount: 0,
    loadPortCount: 0,
    subResourceCount: 0,
    consumableCount: 0,
    durableCount: 0,
    recipe: "",
    upcomingMaintenanceCount: 0,
    alertCount: 0,
  };
}

export function buildStepSummary(name: string): StepSummary {
  return {
    name,
    state: "Active",
    materialCount: (STEP_MATERIALS[name] ?? []).length,
    resourceCount: (STEP_RESOURCES[name] ?? []).length,
  };
}
