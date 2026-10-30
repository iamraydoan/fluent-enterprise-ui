import type { TransferOrderItem } from "@/api";

export function formatItemMeta(item: TransferOrderItem): string {
  return [item.product, String(item.quantity)].filter(Boolean).join(" · ");
}
