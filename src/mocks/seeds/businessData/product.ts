import type { ProductDetail, ProductRecord, Page } from "@/api";
import { filterByQuery, filterByState, paginate } from "../../mockUtils";

const RECORDS: ProductRecord[] = [
  {
    name: "Flour [A]",
    description: "Flour product",
    productType: "Material",
    state: "Active",
    isActive: "Yes",
  },
  {
    name: "Belgas [A]",
    description: "Belgas cookies",
    productType: "Material",
    state: "Active",
    isActive: "Yes",
  },
  {
    name: "Box [A]",
    description: "Packaging box",
    productType: "Packaging",
    state: "Active",
    isActive: "Yes",
  },
];

export function queryProducts(
  page: number,
  limit: number,
  q?: string,
  state?: string,
): Page<ProductRecord> {
  const rows = filterByState(filterByQuery(RECORDS, q, ["name"]), state);
  return paginate(rows, page, limit);
}

export function buildProductDetail(name: string): ProductDetail {
  const record = RECORDS.find((r) => r.name === name) ?? RECORDS[0];
  return { ...record };
}
