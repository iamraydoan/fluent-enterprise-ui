import type { ProductionOrderDetail, ProductionOrderRecord, Page } from "@/api";
import { filterByQuery, filterByState, paginate } from "../../mockUtils";

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
  const rows = filterByState(filterByQuery(RECORDS, q, ["name"]), state);
  return paginate(rows, page, limit);
}

export function buildProductionOrderDetail(name: string): ProductionOrderDetail {
  const record = RECORDS.find((r) => r.name === name) ?? RECORDS[0];
  return { ...record };
}
