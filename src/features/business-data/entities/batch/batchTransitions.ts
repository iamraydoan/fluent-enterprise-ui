export type BatchTransition = "release" | "unrelease" | "abort" | "cancel" | "trackIn" | "trackOut";

export const BATCH_TRANSITIONS: BatchTransition[] = [
  "release",
  "unrelease",
  "abort",
  "cancel",
  "trackIn",
  "trackOut",
];

export const TRANSITION_STATE: Record<BatchTransition, { systemState?: string; state?: string }> = {
  release: { systemState: "Released" },
  unrelease: { systemState: "Created" },
  abort: { systemState: "In Process" },
  cancel: { systemState: "Canceled", state: "Terminated" },
  trackIn: { systemState: "In Process" },
  trackOut: { systemState: "Processed" },
};
