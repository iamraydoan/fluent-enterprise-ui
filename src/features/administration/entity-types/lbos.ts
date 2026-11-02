import { notify } from "@/components/common";

export const STEP_COUNT = 4;

const TARGETS = ["NetStandard", "NetFramework", "TypeScript", "Packages"];

export type LbosPhase = "idle" | "running" | "done" | "failed";

export interface LbosState {
  phase: LbosPhase;
  step: number;
  pct: number;
  attempt: number;
  last: string;
}

export type LbosListener = (state: LbosState) => void;

export const targetOf = (i: number): string => TARGETS[i - 1] ?? "";

let state: LbosState = { phase: "idle", step: 0, pct: 0, attempt: 0, last: "11/14/2023" };
const listeners = new Set<LbosListener>();

const emit = (): void => {
  listeners.forEach((listener) => listener({ ...state }));
};

export const lbosState = (): LbosState => ({ ...state });

export const onLbos = (listener: LbosListener): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export function startLbos(): void {
  if (state.phase === "running") return;
  state = { ...state, phase: "running", step: 1, pct: 0, attempt: state.attempt + 1 };
  emit();
  let i = 1;
  const tick = (): void => {
    if (i < STEP_COUNT) {
      i += 1;
      state = { ...state, step: i, pct: Math.round(((i - 1) / STEP_COUNT) * 100) };
      emit();
      setTimeout(tick, 700);
      return;
    }
    const ok = state.attempt % 2 === 1;
    const d = new Date();
    const stamp = `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`;
    state = { ...state, phase: ok ? "done" : "failed", pct: 100, last: ok ? stamp : state.last };
    emit();
    notify(
      ok ? "success" : "error",
      ok ? "LBOs were generated successfully." : "LBOs generation has failed.",
    );
  };
  setTimeout(tick, 700);
}

export const resetLbos = (): void => {
  if (state.phase !== "running") {
    state = { ...state, phase: "idle" };
    emit();
  }
};
