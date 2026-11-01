import { makeStyles } from "@/components/ui";
import { theme } from "@/styles/theme";

export const useDialogStyles = makeStyles({
  hint: { fontSize: "13px", color: theme.color.textSecondary, marginBottom: "12px" },
  fieldRow: { display: "flex", flexDirection: "column", rowGap: "4px", marginBottom: "12px" },
  fieldLabel: { fontSize: "13px", fontWeight: theme.font.weightSemibold },
  itemRow: {
    display: "flex",
    flexWrap: "wrap",
    columnGap: "8px",
    rowGap: "8px",
    alignItems: "center",
    marginBottom: "8px",
  },
  itemNameWrap: { flex: "1 1 160px", minWidth: "140px" },
  detailGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    columnGap: "12px",
    rowGap: "8px",
    margin: "8px 0 16px 0",
    padding: "12px",
    backgroundColor: theme.color.surfaceSecondary,
    borderRadius: theme.radius.md,
  },
  toolbar: {
    display: "flex",
    columnGap: "8px",
    marginBottom: "12px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  paramRow: {
    display: "flex",
    flexWrap: "wrap",
    columnGap: "8px",
    rowGap: "8px",
    alignItems: "center",
    marginBottom: "8px",
  },
  paramNameWrap: { flex: "1 1 140px", minWidth: "120px" },
  performRow: {
    display: "grid",
    gridTemplateColumns: "minmax(0,1fr) auto auto",
    columnGap: "12px",
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
