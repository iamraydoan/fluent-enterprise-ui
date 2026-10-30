import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import { apiFetch } from "../client";
import type { Page } from "../types";

export interface NotificationRecord {
  name: string;
  description: string;
  severity: string;
  type: string;
  state: string;
  validTo: string;
  tracking: string;
}

export interface NotificationDetail extends NotificationRecord {
  detailNote?: string;
}

export function listNotifications(params: ListQueryParams): Promise<Page<NotificationRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return apiFetch<Page<NotificationRecord>>(`/business-data/notifications?${search.toString()}`);
}

export function useNotifications(params: ListQueryParams) {
  return useQuery({
    queryKey: ["business-data", "notifications", params],
    queryFn: () => listNotifications(params),
    placeholderData: keepPreviousData,
  });
}

export function getNotification(name: string): Promise<NotificationDetail> {
  return apiFetch<NotificationDetail>(`/business-data/notifications/${encodeURIComponent(name)}`);
}

export function useNotificationDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "notification", name],
    queryFn: () => getNotification(name),
  });
}
