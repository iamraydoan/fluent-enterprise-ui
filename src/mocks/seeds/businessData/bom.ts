import type { BomDetail, BomRecord, Page } from "@/api";
import { filterByQuery, filterByState, paginate } from "../../mockUtils";

const BOMS: BomRecord[] = [
  {
    name: "Chocolate Chip Cookies",
    description: "Chocolate Chip Cookies",
    product: "Cookie A",
    version: "1",
    state: "Active",
  },
  {
    name: "Oatmeal Cookies",
    description: "Oatmeal Cookies",
    product: "Cookie B",
    version: "2",
    state: "Active",
  },
  {
    name: "Sugar Cookies",
    description: "Sugar Cookies",
    product: "Cookie C",
    version: "1",
    state: "Terminated",
  },
];

export function queryBoms(
  page: number,
  limit: number,
  q?: string,
  state?: string,
): Page<BomRecord> {
  const rows = filterByState(filterByQuery(BOMS, q, ["name", "description"]), state);
  return paginate(rows, page, limit);
}

export function buildBomDetail(name: string): BomDetail {
  const record = BOMS.find((b) => b.name === name) ?? {
    name,
    description: name,
    product: "",
    version: "1",
    state: "Active",
  };
  const overlay = BOM_DETAIL_OVERLAYS[record.name] ?? {};
  return {
    ...record,
    type: "Standard",
    universalState: "Created",
    dataGroup: "",
    changeSet: "Clone 112",
    scope: "Materials",
    baseQuantity: 1,
    units: "Kg",
    useTolerances: false,
    useMixedAssembly: false,
    items: [
      { item: 1, product: "Flour [A]", quantity: 2, units: "Kg", position: 1, source: "Mixing" },
    ],
    ...overlay,
  };
}

const BOM_DETAIL_OVERLAYS: Record<string, Partial<BomDetail>> = {};

export interface BomUpsertInput extends Partial<BomDetail> {
  name: string;
}

export function createBomDetail(input: BomUpsertInput): BomDetail {
  const record: BomRecord = {
    name: input.name,
    description: input.description ?? "",
    product: input.product ?? "",
    version: "1",
    state: "Active",
  };
  BOMS.push(record);
  const overlay: Partial<BomDetail> = { ...input };
  delete overlay.name;
  delete overlay.description;
  delete overlay.product;
  delete overlay.version;
  delete overlay.state;
  BOM_DETAIL_OVERLAYS[input.name] = overlay;
  return buildBomDetail(input.name);
}

export function updateBomDetail(name: string, input: Partial<BomDetail>): BomDetail | undefined {
  const record = BOMS.find((b) => b.name === name);
  if (!record) return undefined;
  if (input.description !== undefined) record.description = input.description;
  if (input.product !== undefined) record.product = input.product;
  BOM_DETAIL_OVERLAYS[name] = { ...BOM_DETAIL_OVERLAYS[name], ...input };
  return buildBomDetail(name);
}
