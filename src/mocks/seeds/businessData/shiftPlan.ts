import { RecordState } from "@/api";
import type { Page, ShiftPlanDetail, ShiftPlanRecord } from "@/api";

const RECORDS: ShiftPlanRecord[] = [
  {
    name: "Cookie Factory Shift Plan",
    description: "Main shift plan for Cookie Factory",
    type: "Production",
    calendar: "Standard",
    state: RecordState.Active,
  },
  {
    name: "Weekend Shift Plan",
    description: "Weekend coverage plan",
    type: "Production",
    calendar: "Standard",
    state: RecordState.Terminated,
  },
];

const DETAILS: Record<string, ShiftPlanDetail> = {
  "Cookie Factory Shift Plan": {
    name: "Cookie Factory Shift Plan",
    description: "Main shift plan for Cookie Factory",
    type: "Production",
    calendar: "Standard",
    state: RecordState.Active,
    dataGroup: "",
    ownerRole: "ShiftManager",
    workgroups: [
      {
        name: "Mixing WG",
        description: "Mixing workgroup",
        ownerRole: "ShiftManager",
        resources: ["Mixer-01", "Mixer-02"],
        personnelRequirements: [{ position: "Operator", quantity: 4 }],
      },
      {
        name: "Baking WG",
        description: "Baking workgroup",
        ownerRole: "ShiftManager",
        resources: ["Oven-01"],
        personnelRequirements: [{ position: "Baker", quantity: 2 }],
      },
    ],
    employees: [
      { name: "John Doe", team: "Team A", workgroup: "Mixing WG", position: "Operator" },
      { name: "Jane Smith", team: "Team A", workgroup: "Baking WG", position: "Baker" },
    ],
  },
  "Weekend Shift Plan": {
    name: "Weekend Shift Plan",
    description: "Weekend coverage plan",
    type: "Production",
    calendar: "Standard",
    state: RecordState.Terminated,
    dataGroup: "",
    ownerRole: "ShiftManager",
    workgroups: [],
    employees: [],
  },
};

export function getShiftPlanPage(params: {
  page: number;
  limit: number;
  q?: string;
  state?: string;
}): Page<ShiftPlanRecord> {
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

export function getShiftPlanDetail(name: string): ShiftPlanDetail | undefined {
  return DETAILS[name];
}
