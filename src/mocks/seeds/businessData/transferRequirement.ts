import { RecordState } from "@/api";
import type { Page, TransferRequirementDetail, TransferRequirementRecord } from "@/api";
import { filterByQuery, filterByState, paginate } from "../../mockUtils";

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
  const rows = filterByState(filterByQuery(RECORDS, params.q, ["name"]), params.state);
  return paginate(rows, params.page, params.limit);
}

export function getTransferRequirementDetail(name: string): TransferRequirementDetail | undefined {
  return DETAILS[name];
}
