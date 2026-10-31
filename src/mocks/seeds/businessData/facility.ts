import type { FacilityDetail, FacilityRecord, Page } from "@/api";
import { RecordState } from "@/api";
import { filterByQuery, filterByState, paginate } from "../../mockUtils";

const FACILITIES: FacilityRecord[] = [
  {
    name: "Giant Distribution Center Facility",
    description: "This is a giant facility.",
    type: "Distribution Center",
    site: "Giant Enterprise Asia",
    state: RecordState.Active,
  },
  {
    name: "Dresden Fab",
    description: "",
    type: "Factory",
    site: "Dresden-Backend",
    state: RecordState.Active,
  },
  {
    name: "Old Facility",
    description: "Closed",
    type: "Factory",
    site: "",
    state: RecordState.Terminated,
  },
];

const DETAILS: Record<string, FacilityDetail> = {
  "Giant Distribution Center Facility": {
    name: "Giant Distribution Center Facility",
    description: "This is a giant facility.",
    type: "Distribution Center",
    site: "Giant Enterprise Asia",
    state: RecordState.Active,
    dataGroup: "",
    displayOrder: 0,
    defaultCalendar: "Standard",
    remote: false,
    terminateOnShipToThisFacility: false,
  },
};

export function queryFacilities(
  page: number,
  limit: number,
  q?: string,
  state?: string,
): Page<FacilityRecord> {
  const rows = filterByState(filterByQuery(FACILITIES, q, ["name", "description"]), state);
  return paginate(rows, page, limit);
}

export function getFacilityDetail(name: string): FacilityDetail | undefined {
  return DETAILS[name];
}
