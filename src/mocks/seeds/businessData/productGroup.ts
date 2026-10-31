import type { ProductGroupDetail, ProductGroupRecord, Page } from "@/api";
import { filterByQuery, filterByState, paginate } from "../../mockUtils";

const RECORDS: ProductGroupRecord[] = [
  { name: "Cookies", description: "Cookie products", state: "Active", productCount: "12" },
  { name: "Packaging", description: "Packaging materials", state: "Active", productCount: "8" },
];

export function queryProductGroups(
  page: number,
  limit: number,
  q?: string,
  state?: string,
): Page<ProductGroupRecord> {
  const rows = filterByState(filterByQuery(RECORDS, q, ["name"]), state);
  return paginate(rows, page, limit);
}

export function buildProductGroupDetail(name: string): ProductGroupDetail {
  const record = RECORDS.find((r) => r.name === name) ?? RECORDS[0];
  return { ...record };
}
