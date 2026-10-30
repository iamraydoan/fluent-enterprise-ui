import type { MapDefinitionDetail, MapDefinitionRecord, Page } from "@/api";
import { RecordState } from "@/api";

const DEFINITIONS: MapDefinitionRecord[] = [
  {
    name: "Dough pouring map",
    description: "",
    type: "General",
    state: RecordState.Active,
  },
  {
    name: "Wafer Map Definition",
    description: "",
    type: "General",
    state: RecordState.Active,
  },
  {
    name: "Old Map Definition",
    description: "",
    type: "General",
    state: RecordState.Terminated,
  },
];

const DETAILS: Record<string, MapDefinitionDetail> = {
  "Dough pouring map": {
    name: "Dough pouring map",
    description: "",
    type: "General",
    state: RecordState.Active,
    layoutType: "Regular",
    height: 250,
    width: 250,
    dimensionUnits: "Kg",
    rows: 3,
    columns: 3,
    maskFile: "Dough pouring map_Mask.xml",
    backgroundFile: "",
    emptyUnitsColor: "#FFFFFF",
    gridLinesColor: "#000000",
    showGridLinesByDefault: true,
    rulerMode: "Absolute",
    showRulerByDefault: true,
    notch: "Bottom",
    defaultRotation: "Rotate 0",
    materialUnits: "",
    layers: [
      { name: "Bin", layerType: "Bin", dataType: "String", isDefault: true },
      { name: "Measurement", layerType: "Measurement", dataType: "Decimal", isDefault: false },
    ],
  },
};

export function queryMapDefinitions(
  page: number,
  limit: number,
  q?: string,
  state?: string,
): Page<MapDefinitionRecord> {
  let rows = DEFINITIONS;
  if (q !== undefined && q !== "") {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (row) =>
        row.name.toLowerCase().includes(needle) || row.description.toLowerCase().includes(needle),
    );
  }
  if (state !== undefined && state !== "") {
    const needle = state.toLowerCase();
    rows = rows.filter((row) => row.state.toLowerCase() === needle);
  }
  const total = rows.length;
  const start = (page - 1) * limit;
  return { data: rows.slice(start, start + limit), meta: { total, page, limit } };
}

export function getMapDefinitionDetail(name: string): MapDefinitionDetail | undefined {
  return DETAILS[name];
}
