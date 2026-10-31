export type ChangeSetTransition = "requestApproval" | "approve" | "reject" | "rework" | "cancel";

export const CHANGE_SET_TRANSITIONS: ChangeSetTransition[] = [
  "requestApproval",
  "approve",
  "reject",
  "rework",
  "cancel",
];

export const TRANSITION_STATE: Record<
  ChangeSetTransition,
  { systemState?: string; state?: string }
> = {
  requestApproval: { systemState: "In Approval" },
  approve: { systemState: "Approved" },
  reject: { systemState: "Rejected", state: "Terminated" },
  rework: { systemState: "Created" },
  cancel: { systemState: "Canceled", state: "Terminated" },
};
