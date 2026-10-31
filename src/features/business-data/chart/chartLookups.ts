export const CHART_TYPES = [
  "Average And Range",
  "Average And Standard Deviation",
  "Individuals And Moving Range",
  "Median And Range",
  "Fraction Defective",
  "Number Defective",
  "Number Of Defects",
  "Number Of Defects Per Unit",
];

export const SPC_RULES: { value: string; description: string }[] = [
  { value: "Nelson 1", description: "One point more than 3 sigma from centerline" },
  { value: "Nelson 2", description: "Nine points in a row on same side of centerline" },
  { value: "Nelson 3", description: "Six points in a row steadily increasing or decreasing" },
  { value: "Nelson 4", description: "Fourteen points in a row alternating up and down" },
  {
    value: "Nelson 5",
    description: "Two out of three points more than 2 sigma from centerline (same side)",
  },
  {
    value: "Nelson 6",
    description: "Four out of five points more than 1 sigma from centerline (same side)",
  },
  { value: "Nelson 7", description: "Fifteen points in a row within 1 sigma of centerline" },
  {
    value: "Nelson 8",
    description: "Eight points in a row more than 1 sigma from centerline (either side)",
  },
  { value: "Out of Spec", description: "Point outside specification limits" },
  { value: "Western Electric 1", description: "One point beyond 3 sigma" },
  { value: "Western Electric 2", description: "Two of three consecutive points beyond 2 sigma" },
  { value: "Western Electric 3", description: "Four of five consecutive points beyond 1 sigma" },
  {
    value: "Western Electric 4",
    description: "Eight consecutive points on one side of centerline",
  },
];

export const ELEMENT_TYPE_OPTIONS = [
  { value: "FreeText", label: "Free Text" },
  { value: "LookupTable", label: "Lookup Table" },
  { value: "Object", label: "Object" },
];

export const RULE_SCOPE_OPTIONS = [
  { value: "Chart", label: "Chart" },
  { value: "Logical Chart", label: "Logical Chart" },
];

export const DATA_POINT_ACTION_KEYS = {
  annotate: "annotate",
  edit: "edit",
  exclude: "exclude",
  include: "include",
  remove: "remove",
  protocol: "protocol",
} as const;

export type DataPointAction = (typeof DATA_POINT_ACTION_KEYS)[keyof typeof DATA_POINT_ACTION_KEYS];
