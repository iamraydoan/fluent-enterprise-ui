import type { SubstrateMapOverlay } from "@/api";

export function formatOverlayMeta(overlay: SubstrateMapOverlay): string {
  return [overlay.type, overlay.version].filter(Boolean).join(" · ");
}
