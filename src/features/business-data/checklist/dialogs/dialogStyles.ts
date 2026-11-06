import { makeStyles } from "@/components/ui";
import { theme } from "@/styles/theme";

export const useDialogStyles = makeStyles({
  hint: { fontSize: "13px", color: theme.color.textSecondary, marginBottom: theme.spacing.md },
  fieldRow: {
    display: "flex",
    flexDirection: "column",
    rowGap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  fieldLabel: { fontSize: "13px", fontWeight: theme.font.weightSemibold },
  itemRow: {
    display: "flex",
    flexWrap: "wrap",
    columnGap: theme.spacing.sm,
    rowGap: theme.spacing.sm,
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  itemNameWrap: { flex: "1 1 160px", minWidth: "140px" },
  detailGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    columnGap: theme.spacing.md,
    rowGap: theme.spacing.sm,
    margin: "8px 0 16px 0",
    padding: theme.spacing.md,
    backgroundColor: theme.color.surfaceSecondary,
    borderRadius: theme.radius.md,
  },
  toolbar: {
    display: "flex",
    columnGap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    flexWrap: "wrap",
    alignItems: "center",
  },
  paramRow: {
    display: "flex",
    flexWrap: "wrap",
    columnGap: theme.spacing.sm,
    rowGap: theme.spacing.sm,
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  paramNameWrap: { flex: "1 1 140px", minWidth: "120px" },
  performRow: {
    display: "grid",
    gridTemplateColumns: "minmax(0,1fr) auto auto",
    columnGap: theme.spacing.md,
    alignItems: "center",
    padding: "10px 0",
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
  },
  stateBadge: {
    fontSize: "12px",
    padding: "2px 8px",
    borderRadius: "10px",
    backgroundColor: theme.color.surfaceTertiary,
  },
});
