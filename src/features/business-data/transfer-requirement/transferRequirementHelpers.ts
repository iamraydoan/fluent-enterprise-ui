import type { TransferRequirementItem } from "@/api";

export function formatItemMeta(item: TransferRequirementItem): string {
  return [String(item.quantity), String(item.releasedQuantity)].filter(Boolean).join(" / ");
}
