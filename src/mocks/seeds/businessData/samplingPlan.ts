import type { SamplingPlanDetail, SamplingPlanRecord } from "@/api";
import { RecordState } from "@/api";

const RECORDS: SamplingPlanRecord[] = [
  {
    name: "Early Bird Plan",
    description: "Counter based sampling plan",
    type: "Lot-based",
    defaultSamplingType: "CounterBased",
    state: RecordState.Active,
  },
  {
    name: "Time Check Plan",
    description: "Time based sampling plan",
    type: "Lot-based",
    defaultSamplingType: "TimeBased",
    state: RecordState.Active,
  },
  {
    name: "Combined Plan",
    description: "Counter and time based plan",
    type: "Lot-based",
    defaultSamplingType: "CounterAndTimeBased",
    state: RecordState.Terminated,
  },
];

export function querySamplingPlans(q?: string, state?: string): SamplingPlanRecord[] {
  let rows = RECORDS;
  if (q !== undefined && q !== "") {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (record) =>
        record.name.toLowerCase().includes(needle) ||
        record.description.toLowerCase().includes(needle),
    );
  }
  if (state !== undefined && state !== "") {
    rows = rows.filter((record) => record.state === state);
  }
  return rows;
}

export function buildSamplingPlanDetail(name: string): SamplingPlanDetail {
  const record = RECORDS.find((item) => item.name === name) ?? {
    name,
    description: "",
    type: "Lot-based",
    defaultSamplingType: "CounterBased" as const,
    state: RecordState.Active,
  };
  return {
    ...record,
    dataGroup: "",
    counterFrequency: 10,
    timeFrequency: 24,
  };
}
