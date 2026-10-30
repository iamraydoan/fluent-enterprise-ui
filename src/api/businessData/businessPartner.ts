import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/api/client";
import type { Page } from "@/api/types";
import type { ListQueryParams } from "@/lib/listQuery";

export interface BusinessPartnerRecord {
  name: string;
  description: string;
  role: string;
  state: string;
}

export interface BusinessPartnerDetail extends BusinessPartnerRecord {
  universalState: string;
  dataGroup: string;
  isContractor: boolean;
  isCustomer: boolean;
  isSupplier: boolean;
  isManufacturer: boolean;
  labelSpecification: string;
  contactTitle: string;
  contactName: string;
  email: string;
  mobilePhone: string;
  businessPhone: string;
  businessFax: string;
  address: string;
  zipCode: string;
  country: string;
  stateName: string;
  city: string;
  taxNumber: string;
  website: string;
}

export function useBusinessPartners(params: ListQueryParams) {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return useQuery<Page<BusinessPartnerRecord>>({
    queryKey: ["business-data", "business-partners", params],
    queryFn: () => apiFetch<Page<BusinessPartnerRecord>>(`/business-data/business-partners?${search.toString()}`),
    placeholderData: keepPreviousData,
  });
}

export function useBusinessPartnerDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "business-partners", name],
    queryFn: () => apiFetch<BusinessPartnerDetail>(`/business-data/business-partners/${encodeURIComponent(name)}`),
  });
}
