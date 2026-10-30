export type WizardMode = "edit";

export const MODE_EDIT: WizardMode = "edit";

export type TerminateMode = "terminate" | "unterminate";

export const TERMINATE: TerminateMode = "terminate";
export const UNTERMINATE: TerminateMode = "unterminate";

export type MaoAction =
  | "approve"
  | "release"
  | "begin"
  | "complete"
  | "accept"
  | "reject"
  | "cancelAction"
  | "skip"
  | "abort"
  | "rework";
