import { makeStyles} from "@/components/ui";
import { theme } from "@/styles/theme";

export const useDialogStyles = makeStyles({
  steps: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 20px",
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
    backgroundColor: theme.color.surfaceSecondary,
  },
  step: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  stepNumber: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    fontSize: "11px",
    fontWeight: 700,
    backgroundColor: theme.color.surfaceOverlay,
    color: theme.color.textSecondary,
  },
  stepActive: {
    backgroundColor: theme.color.brand,
    color: theme.color.textOnBrand,
  },
  stepDone: {
    backgroundColor: theme.color.successSubtle,
    color: theme.color.textSuccessStrong,
  },
  field: { marginBottom: "16px" },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    marginBottom: "6px",
  },
  required: { color: theme.color.textDanger, marginRight: "4px" },
  hint: { fontSize: "12px", color: theme.color.textTertiary, marginTop: "4px" },
  row: { display: "flex", gap: "12px" },
  col: { flex: 1 },
});

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
}

export const PARAM_TYPES = ["Characteristic", "Specification"] as const;
