import type { PackageDetail, PackageRecord, Page } from "@/api";
import { filterByQuery, filterByState, paginate } from "../mockUtils";

const RECORDS: PackageRecord[] = [
  {
    name: "PKG-0001",
    description: "Carton box 01",
    product: "Box [A]",
    level: "Level 2",
    state: "Open",
    packedQuantity: "100",
    contentType: "Packages",
  },
  {
    name: "PKG-0002",
    description: "Pallet 01",
    product: "Pallet [A]",
    level: "Level 3",
    state: "Closed",
    packedQuantity: "10",
    contentType: "Packages",
  },
];

export function queryPackages(
  page: number,
  limit: number,
  q?: string,
  state?: string,
): Page<PackageRecord> {
  const rows = filterByState(filterByQuery(RECORDS, q, ["name"]), state);
  return paginate(rows, page, limit);
}

export function buildPackageDetail(name: string): PackageDetail {
  const record = RECORDS.find((r) => r.name === name) ?? RECORDS[0];
  return { ...record };
}
