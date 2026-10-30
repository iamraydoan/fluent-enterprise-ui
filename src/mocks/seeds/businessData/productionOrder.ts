import type { ProductionOrderDetail, ProductionOrderRecord, Page } from "@/api";

const RECORDS: ProductionOrderRecord[] = [
  {
    name: "PO-0001",
    description: "Cookie production",
    product: "Belgas [A]",
    quantity: "10,000",
    state: "Released",
    priority: "High",
  },
  {
    name: "PO-0002",
    description: "Flour batch",
    product: "Flour [A]",
    quantity: "5,000 Kg",
    state: "Created",
    priority: "Normal",
  },
];

export function queryProductionOrders(
  page: number,
  limit: number,
  q?: string,
  state?: string,
): Page<ProductionOrderRecord> {
  let rows = RECORDS;
  if (q !== undefined && q !== "") {
    const needle = q.toLowerCase();
    rows = rows.filter((r) => r.name.toLowerCase().includes(needle));
  }
  if (state !== undefined && state !== "" && state !== "all") {
    rows = rows.filter(
      (r) => (r as unknown as Record<string, string>).state?.toLowerCase() === state.toLowerCase(),
    );
  }
  const total = rows.length;
  const start = (page - 1) * limit;
  return { data: rows.slice(start, start + limit), meta: { total, page, limit } };
}

export function buildProductionOrderDetail(name: string): ProductionOrderDetail {
  const record = RECORDS.find((r) => r.name === name) ?? RECORDS[0];
  return { ...record };
}
