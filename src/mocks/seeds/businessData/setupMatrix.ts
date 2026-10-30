import type { SetupMatrixDetail, SetupMatrixRecord } from "@/api";
import { RecordState } from "@/api";

const RECORDS: SetupMatrixRecord[] = [
  {
    name: "Color Changeover",
    description: "Color changeover matrix",
    timeScale: "Minutes",
    state: RecordState.Active,
  },
  {
    name: "Tool Changeover",
    description: "Tool changeover matrix",
    timeScale: "Minutes",
    state: RecordState.Active,
  },
  {
    name: "Legacy Matrix",
    description: "Retired setup matrix",
    timeScale: "Hours",
    state: RecordState.Terminated,
  },
];

export function querySetupMatrices(q?: string, state?: string): SetupMatrixRecord[] {
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

export function buildSetupMatrixDetail(name: string): SetupMatrixDetail {
  const record = RECORDS.find((item) => item.name === name) ?? {
    name,
    description: "",
    timeScale: "Minutes",
    state: RecordState.Active,
  };
  return {
    ...record,
    useZeroInDiagonal: true,
  };
}
