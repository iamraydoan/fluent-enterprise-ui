import type { TranslationKey } from "@/i18n";
import { RecordState } from "@/lib/recordState";

export const RECORD_STATE_LABELS: Record<RecordState, TranslationKey> = {
  [RecordState.Active]: "common.active",
  [RecordState.Draft]: "common.draft",
  [RecordState.Terminated]: "common.terminated",
};
