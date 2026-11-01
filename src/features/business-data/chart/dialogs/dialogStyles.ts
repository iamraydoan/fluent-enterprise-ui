import { makeStyles } from "@/components/ui";
import { theme } from "@/styles/theme";

export const useDialogStyles = makeStyles({
  hint: { fontSize: "13px", color: theme.color.textSecondary, marginBottom: theme.spacing.md },
  fieldRow: { display: "flex", flexDirection: "column", rowGap: theme.spacing.xs, marginBottom: theme.spacing.md },
  fieldLabel: { fontSize: "13px", fontWeight: theme.font.weightSemibold },
  ruleRow: {
    display: "grid",
    gridTemplateColumns: "110px 150px minmax(0,1fr) 130px 130px auto",
    columnGap: theme.spacing.sm,
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  contextRow: {
    display: "grid",
    gridTemplateColumns: "64px 70px minmax(0,1fr) minmax(0,1fr) 130px minmax(0,1fr) auto",
    columnGap: theme.spacing.sm,
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  readingRow: { display: "flex", columnGap: theme.spacing.sm, alignItems: "center", marginBottom: theme.spacing.sm },
  toolbar: { display: "flex", columnGap: theme.spacing.sm, marginBottom: theme.spacing.md, flexWrap: "wrap" },
  preview: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
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
