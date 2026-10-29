import type { TranslationKey } from "@/i18n";

export const RECORD_STATE_LABELS: Record<string, TranslationKey> = {
  Active: "common.active",
  Draft: "common.draft",
  Terminated: "common.terminated",
};

export const RECORD_STATE_OPTIONS = ["all", "active", "draft", "terminated"];
