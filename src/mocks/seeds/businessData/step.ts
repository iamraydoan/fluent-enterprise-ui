import { RecordState } from "@/api";
import type { Page, StepDetail, StepRecord } from "@/api";
import { filterByQuery, filterByState, paginate } from "../../mockUtils";

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
  const rows = filterByState(filterByQuery(RECORDS, params.q, ["name"]), params.state);
  return paginate(rows, params.page, params.limit);
}

export function getStepDetail(name: string): StepDetail | undefined {
  return DETAILS[name];
}
