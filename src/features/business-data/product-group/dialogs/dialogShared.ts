import { makeStyles, tokens } from "@/components/ui";

export const useDialogStyles = makeStyles({
  steps: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 20px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
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
    backgroundColor: tokens.colorNeutralBackground5,
    color: tokens.colorNeutralForeground2,
  },
  stepActive: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  stepDone: {
    backgroundColor: tokens.colorPaletteGreenBackground3,
    color: tokens.colorPaletteGreenForeground3,
  },
  field: { marginBottom: "16px" },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    marginBottom: "6px",
  },
  required: { color: tokens.colorPaletteRedForeground1, marginRight: "4px" },
  hint: { fontSize: "12px", color: tokens.colorNeutralForeground3, marginTop: "4px" },
  row: { display: "flex", gap: "12px" },
  col: { flex: 1 },
});

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
}

export const PARAM_TYPES = ["Characteristic", "Specification"] as const;
