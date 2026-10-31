import type { InspectionPlanDetail, InspectionPlanRecord, Page } from "@/api";
import { RecordState } from "@/api";
import { filterByQuery, filterByState, paginate } from "../../mockUtils";

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
  const rows = filterByState(filterByQuery(PLANS, q, ["name", "description"]), state);
  return paginate(rows, page, limit);
}

export function getInspectionPlanDetail(name: string): InspectionPlanDetail | undefined {
  return DETAILS[name];
}
