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

export function buildChangeSetDetail(name: string): ChangeSetDetail {
  const r = RECORDS.find((x) => x.name === name) ?? { name, description: name, type: "General", state: "Active", systemState: "Created" };
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
  };
}
