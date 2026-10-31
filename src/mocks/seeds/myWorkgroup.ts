import type {
  MyWorkgroupInfo,
  MyWorkgroupResourceParams,
  MyWorkgroupStepParams,
  WorkgroupResourceTile,
  WorkgroupStepTile,
} from "@/api";

const WORKGROUPS: MyWorkgroupInfo[] = [
  { name: "W1", shiftPlan: "Day Shift Plan" },
  { name: "W2", shiftPlan: "Day Shift Plan" },
  { name: "W3", shiftPlan: "Night Shift Plan" },
];

const RESOURCE_TILES: WorkgroupResourceTile[] = [
  {
    name: "Mixer-01",
    facility: "Cookie Factory",
    type: "Standard",
    systemState: "Up",
    dispatched: 0,
    inProcess: 4,
    processed: 16,
  },
  {
    name: "Mixer-01_Clone",
    facility: "Cookie Factory",
    type: "Standard",
    systemState: "Up",
    dispatched: 0,
    inProcess: 0,
    processed: 0,
  },
  {
    name: "Mixer_Sub_Res_1",
    facility: "Cookie Factory",
    type: "Standard",
    systemState: "Up",
    dispatched: 0,
    inProcess: 0,
    processed: 0,
  },
  {
    name: "Mixer_Sub_Res_2",
    facility: "Cookie Factory",
    type: "Standard",
    systemState: "Down",
    dispatched: 0,
    inProcess: 0,
    processed: 0,
  },
  {
    name: "Mixer_Sub_Res_3",
    facility: "Cookie Factory",
    type: "Standard",
    systemState: "Down",
    dispatched: 0,
    inProcess: 0,
    processed: 0,
  },
];

const STEP_TILES: WorkgroupStepTile[] = [
  {
    name: "Alluminum Metallization",
    facility: "FrontEnd",
    processingType: "FrontEnd",
    type: "Standard",
    materials: 0,
    resources: 10,
  },
];

function matches(value: string, needle?: string): boolean {
  if (needle === undefined || needle === "") return true;
  return value.toLowerCase().includes(needle.toLowerCase());
}

export function queryMyWorkgroupResources(
  params: MyWorkgroupResourceParams,
): WorkgroupResourceTile[] {
  return RESOURCE_TILES.filter(
    (tile) =>
      matches(tile.type, params.type) &&
      matches(tile.systemState, params.systemState) &&
      matches(tile.facility, params.facility) &&
      matches(tile.name, params.q),
  );
}

export function queryMyWorkgroupSteps(params: MyWorkgroupStepParams): WorkgroupStepTile[] {
  return STEP_TILES.filter(
    (tile) =>
      matches(tile.processingType, params.processingType) &&
      matches(tile.type, params.type) &&
      matches(tile.facility, params.facility) &&
      matches(tile.name, params.q),
  );
}

export function listWorkgroupInfos(): MyWorkgroupInfo[] {
  return WORKGROUPS;
}
