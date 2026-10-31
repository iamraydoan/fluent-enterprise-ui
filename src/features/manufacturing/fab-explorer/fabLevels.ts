export type FabLevel =
  "enterprises" | "sites" | "facilities" | "facility" | "area" | "step" | "resource";

export const FAB_LEVELS = {
  enterprises: "enterprises",
  sites: "sites",
  facilities: "facilities",
  facility: "facility",
  area: "area",
  step: "step",
  resource: "resource",
} as const;
