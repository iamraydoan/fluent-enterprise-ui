import type { PropertySearchType } from "@/api";
import type { TranslationKey } from "@/i18n";

export const DEFAULT_SEARCH_TYPE: PropertySearchType = "StartsWith";

export const NOT_APPLICABLE = "—";

export function searchTypeLabelKey(searchType: PropertySearchType): TranslationKey {
  return searchType === "Contains"
    ? "entityTypes.searchType.contains"
    : "entityTypes.searchType.startswith";
}

export function isContainsSearchType(searchType: PropertySearchType | undefined): boolean {
  return searchType === "Contains";
}
