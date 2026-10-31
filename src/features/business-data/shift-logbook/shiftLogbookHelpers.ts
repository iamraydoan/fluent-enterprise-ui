import type { ShiftLogbookEntry } from "@/api";

export function formatEntryMeta(entry: ShiftLogbookEntry): string {
  return [entry.category, entry.severity, entry.author, entry.createdOn]
    .filter(Boolean)
    .join(" · ");
}

export const SHIFT_LOGBOOK_DETAILS_SECTION = "businessData.shiftLogbook.sections.details" as const;
