import type { FacilityDetail, FacilityRecord, Page } from "@/api";
import { RecordState } from "@/api";

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
  let rows = FACILITIES;
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

export function getFacilityDetail(name: string): FacilityDetail | undefined {
  return DETAILS[name];
}
