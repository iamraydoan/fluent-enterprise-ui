import type { TranslationKey } from "@/i18n";
import type { EnumOption } from "@/lib/enum";

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
    };
