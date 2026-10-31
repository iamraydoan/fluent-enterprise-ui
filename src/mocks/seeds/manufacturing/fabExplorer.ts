import type {
  FabArea,
  FabEnterprise,
  FabFacility,
  FabMaterial,
  FabResource,
  FabSite,
  FabStep,
} from "@/api";

export const fabEnterprises: FabEnterprise[] = [
  { name: "Main Enterprise", description: "Main Enterprise" },
  { name: "Giant Enterprise", description: "Giant Enterprise" },
];

export const fabSites: FabSite[] = [
  {
    name: "Main Site",
    description: "Main Site",
    enterprise: "Main Enterprise",
    isRemote: false,
  },
  {
    name: "Giant Enterprise Asia",
    description: "Giant Enterprise Asia",
    enterprise: "Giant Enterprise",
    isRemote: true,
  },
  {
    name: "Giant Enterprise EMEA",
    description: "Giant Enterprise EMEA",
    enterprise: "Giant Enterprise",
    isRemote: true,
  },
];

export const fabFacilities: FabFacility[] = [
  {
    name: "Facility 1",
    description: "Production",
    type: "Production",
    site: "Main Site",
    enterprise: "Main Enterprise",
    areaCount: 1,
  },
  {
    name: "Inspection Facility",
    description: "Production",
    type: "Production",
    site: "Main Site",
    enterprise: "Main Enterprise",
    areaCount: 1,
  },
  {
    name: "Resistor Factory - 01",
    description: "Resistor Factory",
    type: "Resistor Factory",
    site: "Main Site",
    enterprise: "Main Enterprise",
    areaCount: 184,
  },
  {
    name: "Resistor WH - 01",
    description: "Resistor Factory",
    type: "Resistor Factory",
    site: "Main Site",
    enterprise: "Main Enterprise",
    areaCount: 1,
  },
  {
    name: "FrontEnd",
    description: "Warehouse",
    type: "Warehouse",
    site: "Main Site",
    enterprise: "Main Enterprise",
    areaCount: 11,
  },
  {
    name: "Warehouse",
    description: "Warehouse",
    type: "Warehouse",
    site: "Main Site",
    enterprise: "Main Enterprise",
    areaCount: 1,
  },
  {
    name: "Chocolate Factory",
    description: "Chocolate Production",
    type: "Chocolate Production",
    site: "Main Site",
    enterprise: "Main Enterprise",
    areaCount: 3,
  },
  {
    name: "Cookie Factory",
    description: "Cookie Production",
    type: "Cookie Production",
    site: "Main Site",
    enterprise: "Main Enterprise",
    areaCount: 2,
  },
  {
    name: "Distribution Center",
    description: "Distribution Center",
    type: "Distribution Center",
    site: "Main Site",
    enterprise: "Main Enterprise",
    areaCount: 0,
  },
  {
    name: "Giant Facility One",
    description: "Distribution Center",
    type: "Distribution Center",
    site: "Giant Enterprise Asia",
    enterprise: "Giant Enterprise",
    areaCount: 0,
  },
  {
    name: "Giant Facility Two",
    description: "Production",
    type: "Production",
    site: "Giant Enterprise EMEA",
    enterprise: "Giant Enterprise",
    areaCount: 0,
  },
];

const resistorAreas: FabArea[] = [
  "Resistor Manufacturing Area",
  "Resistor Manufacturing Area 10",
  "Resistor Manufacturing Area 100",
  "Resistor Manufacturing Area 101",
  "Resistor Manufacturing Area 102",
  "Resistor Manufacturing Area 103",
  "Resistor Manufacturing Area 104",
  "Resistor Manufacturing Area 105",
  "Resistor Manufacturing Area 106",
  "Resistor Manufacturing Area 107",
  "Resistor Manufacturing Area 108",
  "Resistor Manufacturing Area 109",
  "Resistor Manufacturing Area 11",
  "Resistor Manufacturing Area 110",
  "Resistor Manufacturing Area 111",
  "Resistor Manufacturing Area 112",
  "Resistor Manufacturing Area 113",
  "Resistor Manufacturing Area 114",
  "Resistor Manufacturing Area 115",
  "Resistor Manufacturing Area 116",
  "Resistor Manufacturing Area 117",
  "Resistor Manufacturing Area 118",
  "Resistor Manufacturing Area 119",
  "Resistor Manufacturing Area 12",
  "Resistor Manufacturing Area 120",
  "Resistor Manufacturing Area 121",
  "Resistor Manufacturing Area 122",
  "Resistor Manufacturing Area 123",
  "Resistor Manufacturing Area 124",
  "Resistor Manufacturing Area 125",
].map((name, index) => ({
  name,
  description: "Resistor Manufacturing",
  type: "Resistor Manufacturing",
  facility: "Resistor Factory - 01",
  resources:
    index === 0
      ? { up: 12, down: 0, maintenance: 0, nonScheduled: 0 }
      : { up: 0, down: 0, maintenance: 0, nonScheduled: 0 },
}));

export const fabAreas: FabArea[] = [
  ...resistorAreas,
  {
    name: "Cookie Manufacturing",
    description: "Cookie Production",
    type: "ProductionLine",
    facility: "Cookie Factory",
    resources: { up: 18, down: 1, maintenance: 0, nonScheduled: 0 },
  },
  {
    name: "Chocolate Manufacturing",
    description: "Chocolate Production",
    type: "ProductionLine",
    facility: "Chocolate Factory",
    resources: { up: 8, down: 0, maintenance: 2, nonScheduled: 0 },
  },
  {
    name: "FrontEnd Area",
    description: "FrontEnd",
    type: "Area",
    facility: "FrontEnd",
    resources: { up: 5, down: 1, maintenance: 1, nonScheduled: 0 },
  },
];

const implantResources: FabResource[] = Array.from({ length: 11 }, (_, i) => ({
  name: `Implant-0${i + 1}`,
  description: `Implant-0${i + 1} Resource`,
  type: "FrontEnd",
  area: "FrontEnd Area",
  facility: "FrontEnd",
  state: "Up" as const,
  stateModelState: "Standby",
  services: ["Implant"],
  processedMaterials: 0,
  inQueueMaterials: 0,
  inProcessMaterials: 0,
}));

const mixerResources: FabResource[] = [
  "Mixer-01",
  "Mixer-02",
  "Mixer-03",
  "Mixer-04",
  "Mixer-05",
].map((name, i) => ({
  name,
  description: `${name} Resource`,
  type: "Standard",
  area: "Cookie Manufacturing",
  facility: "Cookie Factory",
  state: "Up" as const,
  stateModelState: "Standby",
  services: ["Mixing"],
  processedMaterials: i === 0 ? 37 : 0,
  inQueueMaterials: i === 1 ? 8 : 0,
  inProcessMaterials: i === 0 ? 1 : 0,
}));

const moulderResources: FabResource[] = [
  "Moulder-01",
  "Moulder-02",
  "Moulder-03",
  "Moulder-04",
  "Moulder-05",
].map((name, i) => ({
  name,
  description: `${name} Resource`,
  type: "Standard",
  area: "Cookie Manufacturing",
  facility: "Cookie Factory",
  state: "Up" as const,
  stateModelState: "Standby",
  services: ["Moulding"],
  processedMaterials: 0,
  inQueueMaterials: 0,
  inProcessMaterials: i === 0 ? 1 : 0,
}));

const bakerResources: FabResource[] = [
  "Baker-01",
  "Baker-03",
  "Baker-04",
  "Baker-05",
  "Baking-01",
  "Baking-02",
  "Baking-03",
].map((name, i) => ({
  name,
  description: `${name} Resource`,
  type: "Standard",
  area: "Cookie Manufacturing",
  facility: "Cookie Factory",
  state: "Up" as const,
  stateModelState: "Standby",
  services: ["Baking"],
  processedMaterials: 0,
  inQueueMaterials: 0,
  inProcessMaterials: i === 0 ? 1 : 0,
}));

const zfqResource: FabResource = {
  name: "Z_FQ_Test_1",
  description: "Z_FQ_Test_1 Resource",
  type: "Standard",
  area: "Cookie Manufacturing",
  facility: "Cookie Factory",
  state: "Down",
  stateModelState: "Standby",
  services: ["Mixing"],
  processedMaterials: 0,
  inQueueMaterials: 0,
  inProcessMaterials: 0,
};

export const fabResources: FabResource[] = [
  ...implantResources,
  ...mixerResources,
  ...moulderResources,
  ...bakerResources,
  zfqResource,
];

export const fabSteps: FabStep[] = [
  {
    name: "Mixing",
    description: "Process",
    type: "Process",
    area: "Cookie Manufacturing",
    facility: "Cookie Factory",
    materialCount: 37,
    resources: ["Mixer-01", "Mixer-02", "Mixer-03", "Mixer-04", "Mixer-05", "Z_FQ_Test_1"],
  },
  {
    name: "Mixing-2",
    description: "Process",
    type: "Process",
    area: "Cookie Manufacturing",
    facility: "Cookie Factory",
    materialCount: 0,
    resources: [],
  },
  {
    name: "Moulding",
    description: "Process",
    type: "Process",
    area: "Cookie Manufacturing",
    facility: "Cookie Factory",
    materialCount: 0,
    resources: ["Moulder-01", "Moulder-02", "Moulder-03", "Moulder-04", "Moulder-05"],
  },
  {
    name: "Moulding-2",
    description: "Process",
    type: "Process",
    area: "Cookie Manufacturing",
    facility: "Cookie Factory",
    materialCount: 0,
    resources: [],
  },
  {
    name: "Baking",
    description: "FrontEnd",
    type: "FrontEnd",
    area: "Cookie Manufacturing",
    facility: "Cookie Factory",
    materialCount: 0,
    resources: [
      "Baker-01",
      "Baker-03",
      "Baker-04",
      "Baker-05",
      "Baking-01",
      "Baking-02",
      "Baking-03",
    ],
  },
];

export const fabMaterialsToReceive: FabMaterial[] = [
  {
    name: "MAT-2024-001",
    quantity: 100,
    step: "Mixing",
    dueDate: "2026-11-05",
    facility: "Cookie Factory",
    isRemote: false,
  },
  {
    name: "MAT-2024-002",
    quantity: 50,
    step: "Baking",
    dueDate: "2026-11-06",
    facility: "Cookie Factory",
    isRemote: false,
  },
  {
    name: "MAT-2024-003",
    quantity: 200,
    step: "Implant",
    dueDate: "2026-11-07",
    facility: "FrontEnd",
    isRemote: true,
  },
];

export const fabUndispatchableMaterials: FabMaterial[] = [
  {
    name: "Material20200",
    quantity: 0,
    step: "Ash Clean",
    dueDate: "2026-11-01",
    facility: "Cookie Factory",
    isRemote: false,
  },
  {
    name: "Material20200",
    quantity: 0,
    step: "Ash Clean",
    dueDate: "2026-11-02",
    facility: "Cookie Factory",
    isRemote: false,
  },
];
