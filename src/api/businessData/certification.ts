import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
    queryFn: () =>
      apiFetch<Page<CertificationRecord>>(`/business-data/certifications?${search.toString()}`),
    placeholderData: keepPreviousData,
  });
}

export function useCertificationDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "certifications", name],
    queryFn: () =>
      apiFetch<CertificationDetail>(`/business-data/certifications/${encodeURIComponent(name)}`),
  });
}

export interface CertificationUpsertInput extends Partial<CertificationDetail> {
  name: string;
}

function postJson<T>(path: string, method: string, body: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function createCertificationRecord(
  input: CertificationUpsertInput,
): Promise<CertificationDetail> {
  return postJson<CertificationDetail>("/business-data/certifications", "POST", input);
}

export function updateCertificationRecord(
  name: string,
  input: Partial<CertificationDetail>,
): Promise<CertificationDetail> {
  return postJson<CertificationDetail>(
    `/business-data/certifications/${encodeURIComponent(name)}`,
    "PUT",
    input,
  );
}

export function setCertificationRecordState(
  name: string,
  state: string,
): Promise<CertificationDetail> {
  return postJson<CertificationDetail>(
    `/business-data/certifications/${encodeURIComponent(name)}/state`,
    "PATCH",
    { state },
  );
}

const CERTIFICATION_QUERY_KEY = ["business-data", "certifications"];

export function useCreateCertification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCertificationRecord,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CERTIFICATION_QUERY_KEY });
    },
  });
}

export function useUpdateCertification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, input }: { name: string; input: Partial<CertificationDetail> }) =>
      updateCertificationRecord(name, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CERTIFICATION_QUERY_KEY });
    },
  });
}

export function useSetCertificationState() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, state }: { name: string; state: string }) =>
      setCertificationRecordState(name, state),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CERTIFICATION_QUERY_KEY });
    },
  });
}
