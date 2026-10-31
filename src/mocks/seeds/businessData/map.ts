import type { MapDetail, MapRecord, Page } from "@/api";
import { RecordState } from "@/api";
import { filterByQuery, filterByState, paginate } from "../../mockUtils";

const MAPS: MapRecord[] = [
  {
    name: "Chocolate Chip Map",
    description: "",
    mapDefinition: "Map Definition 2026092820",
    state: RecordState.Active,
  },
  {
    name: "Wafer Map 01",
    description: "",
    mapDefinition: "Wafer Map Definition",
    state: RecordState.Active,
  },
  {
    name: "Old Map",
    description: "",
    mapDefinition: "",
    state: RecordState.Terminated,
  },
];

const DETAILS: Record<string, MapDetail> = {
  "Chocolate Chip Map": {
    name: "Chocolate Chip Map",
    description: "",
    mapDefinition: "Map Definition 2026092820",
    state: RecordState.Active,
    step: "Baking",
    resource: "Baker-01",
    material: "",
    layers: [
      { name: "Bin", type: "Bin", units: "Units" },
      { name: "Loss", type: "Loss", units: "Units" },
    ],
  },
};

export function queryMaps(
  page: number,
  limit: number,
  q?: string,
  state?: string,
): Page<MapRecord> {
  const rows = filterByState(filterByQuery(MAPS, q, ["name", "description"]), state);
  return paginate(rows, page, limit);
}

export function getMapDetail(name: string): MapDetail | undefined {
  return DETAILS[name];
}
