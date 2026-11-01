import { makeStyles } from "@/components/ui";
import { theme } from "@/styles/theme";

export const useDialogStyles = makeStyles({
  hint: { fontSize: "13px", color: theme.color.textSecondary, marginBottom: "12px" },
  fieldRow: { display: "flex", flexDirection: "column", rowGap: "4px", marginBottom: "12px" },
  fieldLabel: { fontSize: "13px", fontWeight: theme.font.weightSemibold },
  sectionTitle: { fontSize: "13px", fontWeight: theme.font.weightSemibold, margin: "16px 0 8px 0" },
  paramRow: {
    display: "flex",
    flexWrap: "wrap",
    columnGap: "8px",
    rowGap: "8px",
    alignItems: "flex-end",
  },
  paramCard: {
    display: "flex",
    flexDirection: "column",
    rowGap: "8px",
    padding: "12px",
    marginBottom: "8px",
    border: `1px solid ${theme.color.borderSubtle}`,
    borderRadius: theme.radius.md,
    backgroundColor: theme.color.surface,
  },
  miniLabel: {
    fontSize: "12px",
    color: theme.color.textTertiary,
    marginBottom: "4px",
  },
  rowActions: {
    marginLeft: "auto",
    display: "flex",
    columnGap: "4px",
    alignItems: "center",
  },
  grow: { flex: "1 1 130px", minWidth: "110px" },
  numWrap: { flex: "0 1 90px", minWidth: "80px" },
  tabs: {
    display: "flex",
    columnGap: "4px",
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
    marginBottom: "12px",
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
  kvRow: { display: "flex", columnGap: "12px", fontSize: "13px", marginBottom: "8px" },
  kvLabel: { color: theme.color.textTertiary, minWidth: "160px" },
});
