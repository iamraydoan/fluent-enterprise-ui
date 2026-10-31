export type FabLevel = "enterprises" | "sites" | "facilities" | "facility" | "area";

export const FAB_LEVELS = {
  enterprises: "enterprises",
  sites: "sites",
  facilities: "facilities",
  facility: "facility",
  area: "area",
} as const;
