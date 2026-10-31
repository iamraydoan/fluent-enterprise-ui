import { RecordState } from "@/api";
import type { Page, TransferOrderDetail, TransferOrderRecord } from "@/api";
import { filterByQuery, filterByState, paginate } from "../../mockUtils";

const RECORDS: TransferOrderRecord[] = [
  {
    name: "TO-001",
    description: "Move materials to baking",
    sourceLocation: "Mixing Area",
    destinationLocation: "Baking Area",
    orderState: "Open",
    state: RecordState.Active,
  },
  {
    name: "TO-002",
    description: "Move packaging units",
    sourceLocation: "Warehouse",
    destinationLocation: "Shipping",
    orderState: "In Progress",
    state: RecordState.Active,
  },
];

const DETAILS: Record<string, TransferOrderDetail> = {
  "TO-001": {
    name: "TO-001",
    description: "Move materials to baking",
    sourceLocation: "Mixing Area",
    destinationLocation: "Baking Area",
    orderState: "Open",
    state: RecordState.Active,
    dataGroup: "",
    items: [{ material: "Dough Batch 01", product: "Chocolate Chip Cookie", quantity: 100 }],
  },
  "TO-002": {
    name: "TO-002",
    description: "Move packaging units",
    sourceLocation: "Warehouse",
    destinationLocation: "Shipping",
    orderState: "In Progress",
    state: RecordState.Active,
    dataGroup: "",
    items: [{ material: "Pack 500", product: "Chocolate Chip Cookie", quantity: 50 }],
  },
};

export function getTransferOrderPage(params: {
  page: number;
  limit: number;
  q?: string;
  state?: string;
}): Page<TransferOrderRecord> {
  const rows = filterByState(filterByQuery(RECORDS, params.q, ["name"]), params.state);
  return paginate(rows, params.page, params.limit);
}

export function getTransferOrderDetail(name: string): TransferOrderDetail | undefined {
  return DETAILS[name];
}
