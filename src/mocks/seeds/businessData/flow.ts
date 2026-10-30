import type { FlowDetail, FlowRecord, Page } from "@/api";
import { RecordState } from "@/api";

const FLOWS: FlowRecord[] = [
  {
    name: "MOSRM8H",
    description: "MOSRM8H Front-End Flow",
    type: "FrontEnd",
    flowType: "Sequential",
    state: RecordState.Active,
  },
  {
    name: "Warehouse",
    description: "Warehouse flow",
    type: "FrontEnd",
    flowType: "Sequential",
    state: RecordState.Active,
  },
  {
    name: "Old Flow",
    description: "",
    type: "FrontEnd",
    flowType: "Alternate",
    state: RecordState.Terminated,
  },
];

const DETAILS: Record<string, FlowDetail> = {
  MOSRM8H: {
    name: "MOSRM8H",
    description: "MOSRM8H Front-End Flow",
    type: "FrontEnd",
    flowType: "Sequential",
    state: RecordState.Active,
    dataGroup: "",
    enabled: true,
    items: [
      {
        position: 1,
        name: "Ash Clean",
        itemType: "Step",
        logicalName: "",
        isOptional: false,
        hasRework: true,
      },
      {
        position: 2,
        name: "Wet Bench",
        itemType: "Step",
        logicalName: "",
        isOptional: false,
        hasRework: false,
      },
      {
        position: 3,
        name: "Ash Clean",
        itemType: "Step",
        logicalName: "",
        isOptional: false,
        hasRework: false,
      },
      {
        position: 4,
        name: "Epitaxy",
        itemType: "Step",
        logicalName: "",
        isOptional: false,
        hasRework: false,
      },
      {
        position: 5,
        name: "Oxidation",
        itemType: "Step",
        logicalName: "",
        isOptional: false,
        hasRework: false,
      },
      {
        position: 6,
        name: "High Temperature Anneal",
        itemType: "Step",
        logicalName: "",
        isOptional: false,
        hasRework: false,
      },
      {
        position: 7,
        name: "Wet Bench",
        itemType: "Step",
        logicalName: "",
        isOptional: false,
        hasRework: false,
      },
      {
        position: 8,
        name: "Wafer Inspection",
        itemType: "Step",
        logicalName: "",
        isOptional: false,
        hasRework: false,
      },
      {
        position: 9,
        name: "Dielectric Deposition",
        itemType: "Step",
        logicalName: "",
        isOptional: false,
        hasRework: false,
      },
      {
        position: 10,
        name: "Exposure",
        itemType: "Step",
        logicalName: "",
        isOptional: false,
        hasRework: false,
      },
      {
        position: 11,
        name: "Overlay",
        itemType: "Step",
        logicalName: "",
        isOptional: false,
        hasRework: false,
      },
    ],
  },
};

export function queryFlows(
  page: number,
  limit: number,
  q?: string,
  state?: string,
): Page<FlowRecord> {
  let rows = FLOWS;
  if (q !== undefined && q !== "") {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (row) =>
        row.name.toLowerCase().includes(needle) || row.description.toLowerCase().includes(needle),
    );
  }
  if (state !== undefined && state !== "") {
    const needle = state.toLowerCase();
    rows = rows.filter((row) => row.state.toLowerCase() === needle);
  }
  const total = rows.length;
  const start = (page - 1) * limit;
  return { data: rows.slice(start, start + limit), meta: { total, page, limit } };
}

export function getFlowDetail(name: string): FlowDetail | undefined {
  return DETAILS[name];
}
