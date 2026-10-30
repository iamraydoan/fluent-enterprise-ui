import type { ProductDetail, ProductRecord, Page } from "@/api";

const RECORDS: ProductRecord[] = [
  { name: "Flour [A]", description: "Flour product", productType: "Material", state: "Active", isActive: "Yes" },
  { name: "Belgas [A]", description: "Belgas cookies", productType: "Material", state: "Active", isActive: "Yes" },
  { name: "Box [A]", description: "Packaging box", productType: "Packaging", state: "Active", isActive: "Yes" },
];

export function queryProducts(page: number, limit: number, q?: string, state?: string): Page<ProductRecord> {
  let rows = RECORDS;
  if (q !== undefined && q !== "") {
    const needle = q.toLowerCase();
    rows = rows.filter((r) => r.name.toLowerCase().includes(needle));
  }
  if (state !== undefined && state !== "" && state !== "all") {
    rows = rows.filter((r) => (r as unknown as Record<string, string>).state?.toLowerCase() === state.toLowerCase());
  }
  const total = rows.length;
  const start = (page - 1) * limit;
  return { data: rows.slice(start, start + limit), meta: { total, page, limit } };
}

export function buildProductDetail(name: string): ProductDetail {
  const record = RECORDS.find((r) => r.name === name) ?? RECORDS[0];
  return { ...record };
}
