import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/api/client";
import type { Page } from "@/api/types";
import type { ListQueryParams } from "@/lib/listQuery";

export interface CertificationRecord {
  name: string;
  description: string;
  type: string;
  state: string;
}

export interface CertificationEmployee {
  name: string;
  state: string;
  expirationDate: string;
}

export interface CertificationQualification {
  qualification: string;
  proficiency: string;
  required: boolean;
}

export interface CertificationDetail extends CertificationRecord {
  universalState: string;
  dataGroup: string;
  validFor: string;
  allowOverride: boolean;
  ownerRole: string;
  sendNotificationOnChanges: boolean;
  sendNotificationWhenRequired: boolean;
  trainingMaximumDuration: string;
  traineeByDefault: boolean;
  allowManualGrants: boolean;
  allowSelfGranting: boolean;
  allowGrantingByManager: boolean;
  employees: CertificationEmployee[];
  qualifications: CertificationQualification[];
}

export function useCertifications(params: ListQueryParams) {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return useQuery<Page<CertificationRecord>>({
    queryKey: ["business-data", "certifications", params],
    queryFn: () => apiFetch<Page<CertificationRecord>>(`/business-data/certifications?${search.toString()}`),
    placeholderData: keepPreviousData,
  });
}

export function useCertificationDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "certifications", name],
    queryFn: () => apiFetch<CertificationDetail>(`/business-data/certifications/${encodeURIComponent(name)}`),
  });
}
