import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListQueryParams } from "@/lib/listQuery";
import { toListSearchParams } from "@/lib/listQuery";
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
  return apiFetch<Page<TaskRecord>>(`/business-data/tasks?${toListSearchParams(params)}`);
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
