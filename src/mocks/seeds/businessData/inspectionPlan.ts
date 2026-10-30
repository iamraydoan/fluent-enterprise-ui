import type {
  InspectionPlanDetail,
  InspectionPlanRecord,
  Page,
} from "@/api";
import { RecordState } from "@/api";

const PLANS: InspectionPlanRecord[] = [
  {
    name: "Cookie Inspection Plan",
    description: "Cookie Quality Inspection Plan",
    type: "Test",
    state: RecordState.Active,
  },
  {
    name: "Wafer Inspection Plan",
    description: "",
    type: "Test",
    state: RecordState.Active,
  },
  {
    name: "Old Inspection Plan",
    description: "",
    type: "Test",
    state: RecordState.Terminated,
  },
];

const DETAILS: Record<string, InspectionPlanDetail> = {
  "Cookie Inspection Plan": {
    name: "Cookie Inspection Plan",
    description: "Cookie Quality Inspection Plan",
    type: "Test",
    state: RecordState.Active,
    dataGroup: "",
    resultsRequiredBeforeTrackOut: true,
    enableMultipleSamples: false,
    containsSeparateInspectionSteps: true,
    closeAutomaticallyOnPass: true,
    closeAutomaticallyOnFail: true,
    openProtocolOnFail: false,
    protocol: "",
    futureHoldCreationMode: "On Fail",
    setHoldOnFail: true,
    futureHoldStep: "Mixing",
    futureHoldReason: "HoldForQuality",
    futureHoldReleaseRole: "CookieManager",
    futureHoldComment: "",
    futureHoldDistributionList: "",
    holdReason: "HoldForQuality",
    holdReleaseRole: "CookieManager",
    holdComment: "",
  },
};

export function queryInspectionPlans(
  page: number,
  limit: number,
  q?: string,
  state?: string,
): Page<InspectionPlanRecord> {
  let rows = PLANS;
  if (q !== undefined && q !== "") {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (row) =>
        row.name.toLowerCase().includes(needle) ||
        row.description.toLowerCase().includes(needle),
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

export function getInspectionPlanDetail(name: string): InspectionPlanDetail | undefined {
  return DETAILS[name];
}
