import type { BinConverterDetail, BinConverterRecord } from "@/api";
import type { Page } from "@/api";

const RECORDS: BinConverterRecord[] = [
  { name: "BinConverter_01", description: "Bin Converter 01 of 10", converterType: "ColorsAndValues", binType: "Ascii", state: "Active" },
  { name: "BinConverter_02", description: "Colors only converter", converterType: "Colors", binType: "Decimal", state: "Active" },
];

export function queryBinConverters(page: number, limit: number, q?: string, state?: string): Page<BinConverterRecord> {
  let rows = RECORDS;
  if (q) {
    const n = q.toLowerCase();
    rows = rows.filter((r) => r.name.toLowerCase().includes(n) || r.description.toLowerCase().includes(n));
  }
  if (state && state !== "" && state !== "all") rows = rows.filter((r) => r.state.toLowerCase() === state.toLowerCase());
  const total = rows.length;
  const start = (page - 1) * limit;
  return { data: rows.slice(start, start + limit), meta: { total, page, limit } };
}

export function buildBinConverterDetail(name: string): BinConverterDetail {
  const r = RECORDS.find((x) => x.name === name) ?? { name, description: name, converterType: "ColorsAndValues", binType: "Ascii", state: "Active" };
  return {
    ...r,
    universalState: r.state,
    dataGroup: "",
    conversions: [
      { fromBinCode: "1", toBinCode: "G", toBinDescription: "Good Bin", toBinQuality: "Unknown", toBinColor: "Orange" },
      { fromBinCode: "8", toBinCode: "A", toBinDescription: "Very Good Bin", toBinQuality: "Pass", toBinColor: "Green" },
      { fromBinCode: "9", toBinCode: "F", toBinDescription: "Bad Bin", toBinQuality: "Fail", toBinColor: "Red" },
    ],
  };
}
