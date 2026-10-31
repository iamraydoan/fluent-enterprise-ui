import type { DataSiloDetail, DataSiloRecord, Page } from "@/api";
import { RecordState } from "@/api";
import { filterByQuery, filterByState, paginate } from "../mockUtils";

const SILOS: DataSiloRecord[] = [
  {
    name: "Dresden Backend",
    description: "Dresden Backend",
    type: "Generic",
    enterpriseName: "ACME",
    siteName: "Dresden-Backend",
    state: RecordState.Active,
  },
  {
    name: "Porto Frontend",
    description: "Porto Frontend",
    type: "Generic",
    enterpriseName: "ACME",
    siteName: "Porto-Frontend",
    state: RecordState.Active,
  },
  {
    name: "External Partner",
    description: "Third-party ingestion silo",
    type: "External",
    enterpriseName: "ACME",
    siteName: "Partner-Site",
    state: RecordState.Terminated,
  },
];

const DETAILS: Record<string, DataSiloDetail> = {
  "Dresden Backend": {
    name: "Dresden Backend",
    description: "Dresden Backend",
    type: "Generic",
    enterpriseName: "ACME",
    siteName: "Dresden-Backend",
    state: RecordState.Active,
    dataVersion: "10.2.10",
    facilityName: "",
    isExternal: false,
    isObsolete: false,
    isSystem: false,
    isTemplate: false,
    keywords: "",
    ownerInstance: "",
    user: "EDPCONNECTOR - DRESDENBACKEND",
  },
  "Porto Frontend": {
    name: "Porto Frontend",
    description: "Porto Frontend",
    type: "Generic",
    enterpriseName: "ACME",
    siteName: "Porto-Frontend",
    state: RecordState.Active,
    dataVersion: "10.2.10",
    facilityName: "Porto",
    isExternal: false,
    isObsolete: false,
    isSystem: false,
    isTemplate: false,
    keywords: "",
    ownerInstance: "",
    user: "EDPCONNECTOR - PORTOFRONTEND",
  },
  "External Partner": {
    name: "External Partner",
    description: "Third-party ingestion silo",
    type: "External",
    enterpriseName: "ACME",
    siteName: "Partner-Site",
    state: RecordState.Terminated,
    dataVersion: "10.1.0",
    facilityName: "",
    isExternal: true,
    isObsolete: false,
    isSystem: false,
    isTemplate: false,
    keywords: "partner",
    ownerInstance: "",
    user: "EDPCONNECTOR - PARTNER",
  },
};

export function queryDataSilos(
  page: number,
  limit: number,
  q?: string,
  state?: string,
): Page<DataSiloRecord> {
  const rows = filterByState(filterByQuery(SILOS, q, ["name", "description"]), state);
  return paginate(rows, page, limit);
}

export function getDataSiloDetail(name: string): DataSiloDetail | undefined {
  return DETAILS[name];
}
