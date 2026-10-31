import type { BinConverterDetail, BinConverterRecord, Page } from "@/api";
import { filterByQuery, filterByState, paginate } from "../../mockUtils";

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
  const rows = filterByState(filterByQuery(RECORDS, q, ["name", "description"]), state);
  return paginate(rows, page, limit);
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
