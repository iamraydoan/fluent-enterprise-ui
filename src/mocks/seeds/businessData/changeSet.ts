import type { ChangeSetDetail, ChangeSetRecord } from "@/api";
import type { Page } from "@/api";

const RECORDS: ChangeSetRecord[] = [
  { name: "ChangeSetName", description: "", type: "General", state: "Active", systemState: "Created" },
  { name: "Clone 112", description: "Cloned change set", type: "General", state: "Active", systemState: "In Approval" },
];

export function queryChangeSets(page: number, limit: number, q?: string, state?: string): Page<ChangeSetRecord> {
  let rows = RECORDS;
  if (q) {
    const n = q.toLowerCase();
    rows = rows.filter((r) => r.name.toLowerCase().includes(n));
  }
  if (state && state !== "" && state !== "all") rows = rows.filter((r) => r.state.toLowerCase() === state.toLowerCase());
  const total = rows.length;
  const start = (page - 1) * limit;
  return { data: rows.slice(start, start + limit), meta: { total, page, limit } };
}

const CHANGE_SET_OVERLAYS: Record<string, Partial<ChangeSetDetail>> = {};

export interface ChangeSetUpsertInput extends Partial<ChangeSetDetail> {
  name: string;
}

export function buildChangeSetDetail(name: string): ChangeSetDetail {
  const r = RECORDS.find((x) => x.name === name) ?? { name, description: name, type: "General", state: "Active", systemState: "Created" };
  const overlay = CHANGE_SET_OVERLAYS[r.name] ?? {};
  return {
    ...r,
    universalState: r.state,
    dataGroup: "",
    sendEmailToApprovers: false,
    sendEmailToRequester: false,
    category: "",
    urgency: "",
    owner: "",
    reasonForChange: "",
    descriptionOfChange: "",
    requiresApproval: true,
    approvalRole: "Administrators",
    makeItemsEffectiveOnApproval: false,
    items: [
      { name: "Cookie A001 [A.1]", type: "Product", approvalRole: "", approver: "", approvalDate: "" },
      { name: "Cookie A002 [A.1]", type: "Product", approvalRole: "", approver: "", approvalDate: "" },
      { name: "Cookie BOM [A.1]", type: "BOM", approvalRole: "", approver: "", approvalDate: "" },
    ],
    subscribers: [{ name: "john.doe" }],
    ...overlay,
  };
}

export function createChangeSetDetail(input: ChangeSetUpsertInput): ChangeSetDetail {
  const record: ChangeSetRecord = {
    name: input.name,
    description: input.description ?? "",
    type: input.type ?? "General",
    state: "Active",
    systemState: "Created",
  };
  RECORDS.push(record);
  const overlay: Partial<ChangeSetDetail> = { ...input };
  delete overlay.name;
  delete overlay.description;
  delete overlay.type;
  delete overlay.state;
  delete overlay.systemState;
  CHANGE_SET_OVERLAYS[input.name] = overlay;
  return buildChangeSetDetail(input.name);
}

export function updateChangeSetDetail(
  name: string,
  input: Partial<ChangeSetDetail>,
): ChangeSetDetail | undefined {
  const record = RECORDS.find((x) => x.name === name);
  if (!record) return undefined;
  if (input.description !== undefined) record.description = input.description;
  if (input.type !== undefined) record.type = input.type;
  if (input.systemState !== undefined) record.systemState = input.systemState;
  CHANGE_SET_OVERLAYS[name] = { ...CHANGE_SET_OVERLAYS[name], ...input };
  return buildChangeSetDetail(name);
}

export function setChangeSetState(name: string, state: string): ChangeSetDetail | undefined {
  const record = RECORDS.find((x) => x.name === name);
  if (!record) return undefined;
  record.state = state;
  return buildChangeSetDetail(name);
}
