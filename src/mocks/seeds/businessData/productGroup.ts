import type { ProductGroupDetail, ProductGroupRecord, Page } from "@/api";

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

export function buildProductGroupDetail(name: string): ProductGroupDetail {
  const record = RECORDS.find((r) => r.name === name) ?? RECORDS[0];
  return { ...record };
}
