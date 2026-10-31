import type { BusinessPartnerDetail, BusinessPartnerRecord, Page } from "@/api";
import { filterByQuery, filterByState, paginate } from "../mockUtils";

const RECORDS: BusinessPartnerRecord[] = [
  { name: "Cooking Mining Company", description: "", role: "Supplier", state: "Active" },
  { name: "Contoso Ltd", description: "Main customer", role: "Customer", state: "Active" },
  { name: "Fabrikam Inc", description: "Contractor services", role: "Contractor", state: "Active" },
];

const EMPTY_DETAIL = {
  description: "",
  universalState: "",
  dataGroup: "",
  isContractor: false,
  isCustomer: false,
  isSupplier: false,
  isManufacturer: false,
  labelSpecification: "",
  contactTitle: "",
  contactName: "",
  email: "",
  mobilePhone: "",
  businessPhone: "",
  businessFax: "",
  address: "",
  zipCode: "",
  country: "",
  stateName: "",
  city: "",
  taxNumber: "",
  website: "",
};

export function queryBusinessPartners(
  page: number,
  limit: number,
  q?: string,
  state?: string,
): Page<BusinessPartnerRecord> {
  const rows = filterByState(filterByQuery(RECORDS, q, ["name"]), state);
  return paginate(rows, page, limit);
}

const BUSINESS_PARTNER_OVERLAYS: Record<string, Partial<BusinessPartnerDetail>> = {};

export interface BusinessPartnerUpsertInput extends Partial<BusinessPartnerDetail> {
  name: string;
}

export function buildBusinessPartnerDetail(name: string): BusinessPartnerDetail {
  const r = RECORDS.find((x) => x.name === name) ?? {
    name,
    description: name,
    role: "",
    state: "Active",
  };
  const overlay = BUSINESS_PARTNER_OVERLAYS[r.name] ?? {};
  return {
    ...r,
    ...overlay,
    ...EMPTY_DETAIL,
    universalState: r.state,
    labelSpecification: "GS1",
    isSupplier: r.role === "Supplier",
    isCustomer: r.role === "Customer",
    isContractor: r.role === "Contractor",
  };
}

export function createBusinessPartnerDetail(
  input: BusinessPartnerUpsertInput,
): BusinessPartnerDetail {
  const record = {
    name: input.name,
    description: input.description ?? "",
    role: input.role ?? "",
    state: "Active",
  };
  RECORDS.push(record);
  const overlay: Partial<BusinessPartnerDetail> = { ...input };
  delete overlay.name;
  delete overlay.description;
  delete overlay.role;
  delete overlay.state;
  BUSINESS_PARTNER_OVERLAYS[input.name] = overlay;
  return buildBusinessPartnerDetail(input.name);
}

export function updateBusinessPartnerDetail(
  name: string,
  input: Partial<BusinessPartnerDetail>,
): BusinessPartnerDetail | undefined {
  const record = RECORDS.find((x) => x.name === name);
  if (!record) return undefined;
  if (input.description !== undefined) record.description = input.description;
  if (input.role !== undefined) record.role = input.role;
  BUSINESS_PARTNER_OVERLAYS[name] = { ...BUSINESS_PARTNER_OVERLAYS[name], ...input };
  return buildBusinessPartnerDetail(name);
}
