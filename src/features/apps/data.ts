export interface AppRow {
  name: string;
  description: string;
  type: string;
  state: string;
}

export const APP_ROWS: AppRow[] = [
  {
    name: "Shop Floor",
    description: "Operator console for work orders",
    type: "System",
    state: "Active",
  },
  { name: "Quality", description: "Inspection and NCR handling", type: "System", state: "Active" },
  {
    name: "Maintenance",
    description: "Equipment maintenance app",
    type: "User defined",
    state: "Active",
  },
  {
    name: "Traceability",
    description: "Genealogy and lot tracking",
    type: "System",
    state: "Active",
  },
];
