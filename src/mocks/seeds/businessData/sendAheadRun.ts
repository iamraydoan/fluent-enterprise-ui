import type { SendAheadRunDetail, SendAheadRunRecord } from "@/api";
import { RecordState } from "@/api";

const RECORDS: SendAheadRunRecord[] = [
  {
    name: "SAR-001",
    description: "First send-ahead run",
    state: RecordState.Active,
  },
  {
    name: "SAR-002",
    description: "Second send-ahead run",
    state: RecordState.Active,
  },
  {
    name: "SAR-003",
    description: "Cancelled send-ahead run",
    state: RecordState.Terminated,
  },
];

export function querySendAheadRuns(q?: string, state?: string): SendAheadRunRecord[] {
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

export function buildSendAheadRunDetail(name: string): SendAheadRunDetail {
  const record = RECORDS.find((item) => item.name === name) ?? {
    name,
    description: "",
    state: RecordState.Active,
  };
  return {
    ...record,
    dataGroup: "",
    resultsCaptureMode: "Manual",
  };
}
