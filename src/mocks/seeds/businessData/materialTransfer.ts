import type { MaterialTransferDetail, MaterialTransferRecord, Page } from "@/api";
import { filterByQuery, filterByState, paginate } from "../../mockUtils";

const RECORDS: MaterialTransferRecord[] = [
  {
    name: "MT-0001",
    type: "ForMaterial",
    state: "Requested",
    material: "Flour-01",
    quantity: "500 Kg",
    fromFacility: "Warehouse A",
    toFacility: "Cookie Factory",
  },
  {
    name: "MT-0002",
    type: "ForCostCenter",
    state: "Approved",
    material: "Sugar-02",
    quantity: "100 Kg",
    fromFacility: "Warehouse A",
    toFacility: "Cookie Factory",
  },
  {
    name: "MT-0003",
    type: "ForReturn",
    state: "Completed",
    material: "Flour-01",
    quantity: "50 Kg",
    fromFacility: "Cookie Factory",
    toFacility: "Warehouse A",
  },
];

export function queryMaterialTransfers(
  page: number,
  limit: number,
  q?: string,
  state?: string,
): Page<MaterialTransferRecord> {
  const rows = filterByState(filterByQuery(RECORDS, q, ["name", "material"]), state);
  return paginate(rows, page, limit);
}

export function buildMaterialTransferDetail(name: string): MaterialTransferDetail {
  const record = RECORDS.find((r) => r.name === name) ?? RECORDS[0];
  return { ...record, requester: "admin", urgency: "Normal" };
}
