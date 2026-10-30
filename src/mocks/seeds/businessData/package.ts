import type { PackageDetail, PackageRecord, Page } from "@/api";

const RECORDS: PackageRecord[] = [
  { name: "PKG-0001", description: "Carton box 01", product: "Box [A]", level: "Level 2", state: "Open", packedQuantity: "100", contentType: "Packages" },
  { name: "PKG-0002", description: "Pallet 01", product: "Pallet [A]", level: "Level 3", state: "Closed", packedQuantity: "10", contentType: "Packages" },
];

export function queryPackages(page: number, limit: number, q?: string, state?: string): Page<PackageRecord> {
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

export function buildPackageDetail(name: string): PackageDetail {
  const record = RECORDS.find((r) => r.name === name) ?? RECORDS[0];
  return { ...record };
}
