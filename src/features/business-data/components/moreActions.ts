import type { TranslationKey } from "@/i18n";

/**
 * Static definition of a "More" menu action on a detail page.
 * The DetailPage maps these to DetailShellMoreAction by providing
 * real onClick handlers per id (never no-ops).
 */
export interface MoreActionDef {
  id: string;
  labelKey: TranslationKey;
}
