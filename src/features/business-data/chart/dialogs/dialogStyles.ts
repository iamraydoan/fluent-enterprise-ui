import { makeStyles } from "@/components/ui";
import { theme } from "@/styles/theme";

export const useDialogStyles = makeStyles({
  hint: { fontSize: "13px", color: theme.color.textSecondary, marginBottom: "12px" },
  fieldRow: { display: "flex", flexDirection: "column", rowGap: "4px", marginBottom: "12px" },
  fieldLabel: { fontSize: "13px", fontWeight: theme.font.weightSemibold },
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
    backgroundColor: theme.color.surfaceSecondary,
    borderRadius: theme.radius.md,
    fontSize: "13px",
  },
  selectedRow: { backgroundColor: theme.color.surfaceSelected },
});

export function numOrUndef(v: unknown): number | undefined {
  if (v === undefined || v === "" || typeof v === "boolean") return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
}
