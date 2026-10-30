import { RecordState } from "@/api";
import type { Page, TransferOrderDetail, TransferOrderRecord } from "@/api";

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
  let filtered = RECORDS;
  if (params.q) {
    const q = params.q.toLowerCase();
    filtered = filtered.filter((r) => r.name.toLowerCase().includes(q));
  }
  if (params.state && params.state !== "All") {
    filtered = filtered.filter((r) => r.state === params.state);
  }
  const start = (params.page - 1) * params.limit;
  return {
    data: filtered.slice(start, start + params.limit),
    meta: { page: params.page, limit: params.limit, total: filtered.length },
  };
}

export function getTransferOrderDetail(name: string): TransferOrderDetail | undefined {
  return DETAILS[name];
}
