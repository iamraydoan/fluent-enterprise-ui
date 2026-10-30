import type { AreaDetail, AreaRecord, Page  } from "@/api";

const AREAS: AreaRecord[] = [
  {
    name: "Cookie Manufacturing",
    description: "Cookie Manufacturing Area",
    facility: "Cookie Factory",
    type: "Cookie Production",
    state: "Active",
  },
  {
    name: "Mixing",
    description: "Mixing process area",
    facility: "Cookie Factory",
    type: "Process",
    state: "Active",
  },
  {
    name: "Moulding",
    description: "Moulding process area",
    facility: "Cookie Factory",
    type: "Process",
    state: "Active",
  },
  {
    name: "Baking",
    description: "Baking process area",
    facility: "Cookie Factory",
    type: "Process",
    state: "Active",
  },
  {
    name: "Packaging",
    description: "Packaging area",
    facility: "Cookie Factory",
    type: "Process",
    state: "Terminated",
  },
];

export function queryAreas(page: number, limit: number, q?: string, state?: string): Page<AreaRecord> {
  let rows = AREAS;
  if (q !== undefined && q !== "") {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (area) =>
        area.name.toLowerCase().includes(needle) ||
        area.description.toLowerCase().includes(needle),
    );
  }
  if (state !== undefined && state !== "" && state !== "all") {
    rows = rows.filter((area) => area.state.toLowerCase() === state.toLowerCase());
  }
  const total = rows.length;
  const start = (page - 1) * limit;
  return {
    data: rows.slice(start, start + limit),
    meta: { total, page, limit },
  };
}

export function buildAreaDetail(name: string): AreaDetail {
  const record = AREAS.find((area) => area.name === name) ?? {
    name,
    description: `${name} Area`,
    facility: "Cookie Factory",
    type: "Process",
    state: "Active",
  };
  const overlay = AREA_DETAIL_OVERLAYS[record.name] ?? {};
  return {
    ...record,
    universalState: record.state,
    dataGroup: "",
    displayOrder: 4,
    areaType: "Area",
    calendar: "Standard",
    schedule: "",
    costCenter: "",
    enableShiftLogbook: false,
    steps: ["Mixing", "Moulding", "Baking"],
    resources: ["Mixer-01", "Mixer-02", "Moulder-01", "Baker-01"],
    subAreas: ["Mixing", "Moulding", "Baking"],
    ...overlay,
  };
}

const AREA_DETAIL_OVERLAYS: Record<string, Partial<AreaDetail>> = {};

export interface AreaUpsertInput extends Partial<AreaDetail> {
  name: string;
}

export function createAreaDetail(input: AreaUpsertInput): AreaDetail {
  const record: AreaRecord = {
    name: input.name,
    description: input.description ?? "",
    facility: input.facility ?? "",
    type: input.type ?? "",
    state: "Active",
  };
  AREAS.push(record);
  const overlay: Partial<AreaDetail> = { ...input };
  delete overlay.name;
  delete overlay.description;
  delete overlay.facility;
  delete overlay.type;
  delete overlay.state;
  AREA_DETAIL_OVERLAYS[input.name] = overlay;
  return buildAreaDetail(input.name);
}

export function updateAreaDetail(name: string, input: Partial<AreaDetail>): AreaDetail | undefined {
  const record = AREAS.find((area) => area.name === name);
  if (!record) return undefined;
  if (input.description !== undefined) record.description = input.description;
  if (input.facility !== undefined) record.facility = input.facility;
  if (input.type !== undefined) record.type = input.type;
  AREA_DETAIL_OVERLAYS[name] = { ...AREA_DETAIL_OVERLAYS[name], ...input };
  return buildAreaDetail(name);
}

export function setAreaState(name: string, state: string): AreaDetail | undefined {
  const record = AREAS.find((area) => area.name === name);
  if (!record) return undefined;
  record.state = state;
  return buildAreaDetail(name);
}
