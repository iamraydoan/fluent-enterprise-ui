import type { TranslationKey } from "@/i18n";
import { RecordState } from "@/lib/recordState";

export const RECORD_STATE_LABELS: Record<RecordState, TranslationKey> = {
  [RecordState.Active]: "common.active",
  [RecordState.Draft]: "common.draft",
  [RecordState.Terminated]: "common.terminated",
};

export const RECORD_STATE_COLUMN_OPTIONS = {
  [RecordState.Active]: { labelKey: RECORD_STATE_LABELS[RecordState.Active], color: "success" },
  [RecordState.Draft]: { labelKey: RECORD_STATE_LABELS[RecordState.Draft], color: "warning" },
  [RecordState.Terminated]: {
    labelKey: RECORD_STATE_LABELS[RecordState.Terminated],
    color: "danger",
  },
} as const;
