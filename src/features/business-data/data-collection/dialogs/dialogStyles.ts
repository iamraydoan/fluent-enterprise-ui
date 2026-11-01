import { makeStyles } from "@/components/ui";
import { theme } from "@/styles/theme";

export const useDialogStyles = makeStyles({
  hint: { fontSize: "13px", color: theme.color.textSecondary, marginBottom: theme.spacing.md },
  fieldRow: { display: "flex", flexDirection: "column", rowGap: theme.spacing.xs, marginBottom: theme.spacing.md },
  fieldLabel: { fontSize: "13px", fontWeight: theme.font.weightSemibold },
  sectionTitle: { fontSize: "13px", fontWeight: theme.font.weightSemibold, margin: "16px 0 8px 0" },
  paramRow: {
    display: "flex",
    flexWrap: "wrap",
    columnGap: theme.spacing.sm,
    rowGap: theme.spacing.sm,
    alignItems: "flex-end",
  },
  paramCard: {
    display: "flex",
    flexDirection: "column",
    rowGap: theme.spacing.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    border: `1px solid ${theme.color.borderSubtle}`,
    borderRadius: theme.radius.md,
    backgroundColor: theme.color.surface,
  },
  miniLabel: {
    fontSize: "12px",
    color: theme.color.textTertiary,
    marginBottom: theme.spacing.xs,
  },
  rowActions: {
    marginLeft: "auto",
    display: "flex",
    columnGap: theme.spacing.xs,
    alignItems: "center",
  },
  grow: { flex: "1 1 130px", minWidth: "110px" },
  numWrap: { flex: "0 1 90px", minWidth: "80px" },
  tabs: {
    display: "flex",
    columnGap: theme.spacing.xs,
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
    marginBottom: theme.spacing.md,
  },
  tab: {
    padding: "8px 16px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "13px",
    borderBottom: "2px solid transparent",
  },
  tabActive: {
    fontWeight: theme.font.weightSemibold,
    borderBottom: `2px solid ${theme.color.borderBrand}`,
  },
  kvRow: { display: "flex", columnGap: theme.spacing.md, fontSize: "13px", marginBottom: theme.spacing.sm },
  kvLabel: { color: theme.color.textTertiary, minWidth: "160px" },
});
