import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { RecordState } from "@/lib/recordState";
import { apiFetch } from "../client";

export type RecipeState = "Active" | "Terminated" | "Created" | "Effective";

export interface RecipeRecord {
  name: string;
  revision: string;
  version: string;
  description: string;
  type: string;
  state: RecordState;
  isEnabled: boolean;
  isExecutable: boolean;
}

export interface RecipeDetail extends RecipeRecord {
  dataGroup: string;
  resourceRecipeName: string;
  userInformation: string;
  supplierInformation: string;
}

export interface RecipeListParams {
  q?: string;
  state?: string;
}

export function listRecipes(params: RecipeListParams): Promise<RecipeRecord[]> {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.state) search.set("state", params.state);
  return apiFetch<RecipeRecord[]>(`/business-data/recipes?${search.toString()}`);
}

export function useRecipes(params: RecipeListParams) {
  return useQuery({
    queryKey: ["business-data", "recipes", params],
    queryFn: () => listRecipes(params),
    placeholderData: keepPreviousData,
  });
}

export function getRecipe(name: string): Promise<RecipeDetail> {
  return apiFetch<RecipeDetail>(`/business-data/recipes/${encodeURIComponent(name)}`);
}

export function useRecipeDetail(name: string) {
  return useQuery({
    queryKey: ["business-data", "recipe", name],
    queryFn: () => getRecipe(name),
  });
}
