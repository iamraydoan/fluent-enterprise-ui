import type { MaterialTransferDetail, MaterialTransferRecord, Page } from "@/api";

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
  let rows = RECORDS;
  if (q !== undefined && q !== "") {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) => r.name.toLowerCase().includes(needle) || r.material.toLowerCase().includes(needle),
    );
  }
  if (state !== undefined && state !== "" && state !== "all") {
    rows = rows.filter((r) => r.state.toLowerCase() === state.toLowerCase());
  }
  const total = rows.length;
  const start = (page - 1) * limit;
  return { data: rows.slice(start, start + limit), meta: { total, page, limit } };
}

export function buildMaterialTransferDetail(name: string): MaterialTransferDetail {
  const record = RECORDS.find((r) => r.name === name) ?? RECORDS[0];
  return { ...record, requester: "admin", urgency: "Normal" };
}
