import { RECORD_STATE_LABELS } from "@/components/common/listState";
import type { TranslationKey } from "@/i18n";
import type { EnumOption } from "@/lib/enum";
import { enumOptions } from "@/lib/enum";
import type { RecordState } from "@/lib/recordState";

export const FILTER_ALL_VALUE = "all";

export function allOption(): EnumOption<string> {
  return { value: FILTER_ALL_VALUE, labelKey: "common.all" };
}

export type DataFilter =
  | {
      type: "search";
      param: string;
      placeholderKey?: TranslationKey;
    }
  | {
      type: "select";
      param: string;
      labelKey: TranslationKey;
      includeAll?: boolean;
      options: EnumOption<string>[];
    }
  | {
      type: "checkbox";
      param: string;
      labelKey: TranslationKey;
      defaultChecked?: boolean;
    };

export function stateFilter(states: readonly RecordState[]): DataFilter {
  return {
    type: "select",
    param: "state",
    labelKey: "common.stateFilterLabel",
    includeAll: true,
    options: enumOptions(states, RECORD_STATE_LABELS),
  };
}

export function searchFilter(param = "q"): DataFilter {
  return { type: "search", param };
}
