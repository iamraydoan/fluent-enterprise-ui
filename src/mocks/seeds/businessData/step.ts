import { RecordState } from "@/api";
import type { Page, StepDetail, StepRecord } from "@/api";

const RECORDS: StepRecord[] = [
  { name: "Mixing", description: "Mix cookie dough", state: RecordState.Active },
  { name: "Baking", description: "Bake cookies", state: RecordState.Active },
];

const DETAILS: Record<string, StepDetail> = {
  Mixing: {
    name: "Mixing",
    description: "Mix cookie dough",
    state: RecordState.Active,
    dataGroup: "",
    includeInScheduling: true,
    logicalNames: ["Mixing-Primary"],
    areas: ["Mixing Area"],
    reasons: ["Ingredient Shortage", "Overmix"],
  },
  Baking: {
    name: "Baking",
    description: "Bake cookies",
    state: RecordState.Active,
    dataGroup: "",
    includeInScheduling: true,
    logicalNames: ["Baking-Primary"],
    areas: ["Baking Area"],
    reasons: ["Underbaked", "Overbaked"],
  },
};

export function getStepPage(params: {
  page: number;
  limit: number;
  q?: string;
  state?: string;
}): Page<StepRecord> {
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

export function getStepDetail(name: string): StepDetail | undefined {
  return DETAILS[name];
}
