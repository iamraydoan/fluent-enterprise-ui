import { makeStyles, tokens } from "@/components/ui";

export const useDialogStyles = makeStyles({
  hint: { fontSize: "13px", color: tokens.colorNeutralForeground2, marginBottom: "12px" },
  fieldRow: { display: "flex", flexDirection: "column", rowGap: "4px", marginBottom: "12px" },
  fieldLabel: { fontSize: "13px", fontWeight: tokens.fontWeightSemibold },
  empty: { padding: "16px", textAlign: "center", color: tokens.colorNeutralForeground3 },
  ruleRow: {
    display: "grid",
    gridTemplateColumns: "110px 150px minmax(0,1fr) 130px 130px auto",
    columnGap: "8px",
    alignItems: "center",
    marginBottom: "8px",
  },
  contextRow: {
    display: "grid",
    gridTemplateColumns: "64px 70px minmax(0,1fr) minmax(0,1fr) 130px minmax(0,1fr) auto",
    columnGap: "8px",
    alignItems: "center",
    marginBottom: "8px",
  },
  readingRow: { display: "flex", columnGap: "8px", alignItems: "center", marginBottom: "8px" },
  toolbar: { display: "flex", columnGap: "8px", marginBottom: "12px", flexWrap: "wrap" },
  preview: {
    marginTop: "12px",
    padding: "12px",
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    fontSize: "13px",
  },
  selectedRow: { backgroundColor: tokens.colorNeutralBackground1Selected },
});

export function numOrUndef(v: string | number | boolean | undefined): number | undefined {
  if (v === undefined || v === "" || typeof v === "boolean") return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
}
