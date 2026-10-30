import { RecordState } from "@/api";
import type { Page, TransferRequirementDetail, TransferRequirementRecord } from "@/api";

const RECORDS: TransferRequirementRecord[] = [
  {
    name: "TR-001",
    description: "Flour transfer request",
    sourceLocation: "Warehouse",
    destinationLocation: "Mixing Area",
    requirementState: "Approved",
    state: RecordState.Active,
  },
  {
    name: "TR-002",
    description: "Sugar transfer request",
    sourceLocation: "Warehouse",
    destinationLocation: "Mixing Area",
    requirementState: "Requested",
    state: RecordState.Active,
  },
];

const DETAILS: Record<string, TransferRequirementDetail> = {
  "TR-001": {
    name: "TR-001",
    description: "Flour transfer request",
    sourceLocation: "Warehouse",
    destinationLocation: "Mixing Area",
    requirementState: "Approved",
    state: RecordState.Active,
    dataGroup: "",
    items: [{ product: "Flour", quantity: 500, releasedQuantity: 500 }],
  },
  "TR-002": {
    name: "TR-002",
    description: "Sugar transfer request",
    sourceLocation: "Warehouse",
    destinationLocation: "Mixing Area",
    requirementState: "Requested",
    state: RecordState.Active,
    dataGroup: "",
    items: [{ product: "Sugar", quantity: 200, releasedQuantity: 0 }],
  },
};

export function getTransferRequirementPage(params: {
  page: number;
  limit: number;
  q?: string;
  state?: string;
}): Page<TransferRequirementRecord> {
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

export function getTransferRequirementDetail(name: string): TransferRequirementDetail | undefined {
  return DETAILS[name];
}
