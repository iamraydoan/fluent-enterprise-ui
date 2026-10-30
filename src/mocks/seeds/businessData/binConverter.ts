import type { BinConverterDetail, BinConverterRecord, Page } from "@/api";

const RECORDS: BinConverterRecord[] = [
  {
    name: "BinConverter_01",
    description: "Bin Converter 01 of 10",
    converterType: "ColorsAndValues",
    binType: "Ascii",
    state: "Active",
  },
  {
    name: "BinConverter_02",
    description: "Colors only converter",
    converterType: "Colors",
    binType: "Decimal",
    state: "Active",
  },
];

export function queryBinConverters(
  page: number,
  limit: number,
  q?: string,
  state?: string,
): Page<BinConverterRecord> {
  let rows = RECORDS;
  if (q) {
    const n = q.toLowerCase();
    rows = rows.filter(
      (r) => r.name.toLowerCase().includes(n) || r.description.toLowerCase().includes(n),
    );
  }
  if (state && state !== "" && state !== "all")
    rows = rows.filter((r) => r.state.toLowerCase() === state.toLowerCase());
  const total = rows.length;
  const start = (page - 1) * limit;
  return { data: rows.slice(start, start + limit), meta: { total, page, limit } };
}

const BIN_CONVERTER_OVERLAYS: Record<string, Partial<BinConverterDetail>> = {};

export interface BinConverterUpsertInput extends Partial<BinConverterDetail> {
  name: string;
}

export function buildBinConverterDetail(name: string): BinConverterDetail {
  const r = RECORDS.find((x) => x.name === name) ?? {
    name,
    description: name,
    converterType: "ColorsAndValues",
    binType: "Ascii",
    state: "Active",
  };
  const overlay = BIN_CONVERTER_OVERLAYS[r.name] ?? {};
  return {
    ...r,
    universalState: r.state,
    dataGroup: "",
    conversions: [
      {
        fromBinCode: "1",
        toBinCode: "G",
        toBinDescription: "Good Bin",
        toBinQuality: "Unknown",
        toBinColor: "Orange",
      },
      {
        fromBinCode: "8",
        toBinCode: "A",
        toBinDescription: "Very Good Bin",
        toBinQuality: "Pass",
        toBinColor: "Green",
      },
      {
        fromBinCode: "9",
        toBinCode: "F",
        toBinDescription: "Bad Bin",
        toBinQuality: "Fail",
        toBinColor: "Red",
      },
    ],
    ...overlay,
  };
}

export function createBinConverterDetail(input: BinConverterUpsertInput): BinConverterDetail {
  const record = {
    name: input.name,
    description: input.description ?? "",
    converterType: input.converterType ?? "ColorsAndValues",
    binType: input.binType ?? "Ascii",
    state: "Active",
  };
  RECORDS.push(record);
  const overlay: Partial<BinConverterDetail> = { ...input };
  delete overlay.name;
  delete overlay.description;
  delete overlay.converterType;
  delete overlay.binType;
  delete overlay.state;
  BIN_CONVERTER_OVERLAYS[input.name] = overlay;
  return buildBinConverterDetail(input.name);
}

export function updateBinConverterDetail(
  name: string,
  input: Partial<BinConverterDetail>,
): BinConverterDetail | undefined {
  const record = RECORDS.find((x) => x.name === name);
  if (!record) return undefined;
  if (input.description !== undefined) record.description = input.description;
  if (input.converterType !== undefined) record.converterType = input.converterType;
  if (input.binType !== undefined) record.binType = input.binType;
  BIN_CONVERTER_OVERLAYS[name] = { ...BIN_CONVERTER_OVERLAYS[name], ...input };
  return buildBinConverterDetail(name);
}

export function setBinConverterState(name: string, state: string): BinConverterDetail | undefined {
  const record = RECORDS.find((x) => x.name === name);
  if (!record) return undefined;
  record.state = state;
  return buildBinConverterDetail(name);
}
