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
  };
}
