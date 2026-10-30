import type { MaterialDetail, MaterialRecord, Page } from "@/api";

const RECORDS: MaterialRecord[] = [
  {
    name: "Flour-01",
    description: "Flour-01",
    type: "Production",
    product: "Flour [A]",
    step: "Mixing",
    primaryQuantity: "1,000 Kg",
    state: "Active",
  },
  {
    name: "Cookie01",
    description: "Cookie batch 01",
    type: "Production",
    product: "Belgas [A]",
    step: "Moulding",
    primaryQuantity: "500 Kg",
    state: "Active",
  },
  {
    name: "Sugar-02",
    description: "Sugar lot 02",
    type: "Production",
    product: "Sugar [A]",
    step: "Mixing",
    primaryQuantity: "250 Kg",
    state: "Active",
  },
];

export function queryMaterials(page: number, limit: number, q?: string, state?: string): Page<MaterialRecord> {
  let rows = RECORDS;
  if (q !== undefined && q !== "") {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (r) => r.name.toLowerCase().includes(needle) || r.description.toLowerCase().includes(needle),
    );
  }
  if (state !== undefined && state !== "" && state !== "all") {
    rows = rows.filter((r) => r.state.toLowerCase() === state.toLowerCase());
  }
  const total = rows.length;
  const start = (page - 1) * limit;
  return { data: rows.slice(start, start + limit), meta: { total, page, limit } };
}

export function buildMaterialDetail(name: string): MaterialDetail {
  const record = RECORDS.find((r) => r.name === name) ?? RECORDS[0];
  return {
    ...record,
    form: "Lot",
    facility: "Cookie Factory",
    productDescription: "Flour",
    productGroup: "",
    universalState: "Active",
    systemState: "Queued",
    flow: "CookiesFlow [A]",
    flowPath: "CookiesFlow [A] > Mixing",
    secondaryQuantity: "",
    subMaterialCount: 0,
  };
}
