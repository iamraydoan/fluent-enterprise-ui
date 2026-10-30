import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "../client";
import type { Page } from "../types";

export interface TaskRecord {
  name: string;
  description: string;
  owner: string;
  taskState: string;
  state: RecordState;
}

export interface TaskDetail extends TaskRecord {
  dataGroup: string;
  requester: string;
  dueDate: string;
}

export type TaskListParams = ListQueryParams;

export function listTasks(params: TaskListParams): Promise<Page<TaskRecord>> {
  const search = new URLSearchParams();
  search.set("page", String(params.page));
  search.set("limit", String(params.limit));
  if (params.filters?.q) search.set("q", params.filters.q);
  if (params.filters?.state) search.set("state", params.filters.state);
  return apiFetch<Page<TaskRecord>>(`/business-data/tasks?${search.toString()}`);
}

export function useTasks(params: TaskListParams) {
  return useQuery({
    queryKey: ["business-data", "tasks", params],
    queryFn: () => listTasks(params),
    placeholderData: keepPreviousData,
  });
}

export function getTask(name: string): Promise<TaskDetail> {
  return apiFetch<TaskDetail>(`/business-data/tasks/${encodeURIComponent(name)}`);
}

export function useTaskDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "task", name],
    queryFn: () => getTask(name),
  });
}
