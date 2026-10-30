import { RecordState } from "@/api";
import type { Page, TaskDetail, TaskRecord } from "@/api";

const RECORDS: TaskRecord[] = [
  {
    name: "Calibrate Mixer-01",
    description: "Monthly calibration of Mixer-01",
    owner: "John Doe",
    taskState: "In Progress",
    state: RecordState.Active,
  },
  {
    name: "Inspect Oven-01",
    description: "Quarterly inspection",
    owner: "Jane Smith",
    taskState: "Created",
    state: RecordState.Active,
  },
];

const DETAILS: Record<string, TaskDetail> = {
  "Calibrate Mixer-01": {
    name: "Calibrate Mixer-01",
    description: "Monthly calibration of Mixer-01",
    owner: "John Doe",
    taskState: "In Progress",
    state: RecordState.Active,
    dataGroup: "",
    requester: "Shift Manager",
    dueDate: "2026-11-15",
  },
  "Inspect Oven-01": {
    name: "Inspect Oven-01",
    description: "Quarterly inspection",
    owner: "Jane Smith",
    taskState: "Created",
    state: RecordState.Active,
    dataGroup: "",
    requester: "Maintenance Lead",
    dueDate: "2026-12-01",
  },
};

export function getTaskPage(params: {
  page: number;
  limit: number;
  q?: string;
  state?: string;
}): Page<TaskRecord> {
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

export function getTaskDetail(name: string): TaskDetail | undefined {
  return DETAILS[name];
}
