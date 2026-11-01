import { useEffect, useRef, useState } from "react";
import { BaseDialog, DialogFooter } from "@/components/common";
import { makeStyles, Text} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { theme } from "@/styles/theme";

const useScanStyles = makeStyles({
  viewport: {
    position: "relative",
    width: "100%",
    aspectRatio: "4 / 3",
    backgroundColor: "#1b1b1b",
    borderRadius: theme.radius.md,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  code: {
    display: "flex",
    columnGap: "3px",
    alignItems: "stretch",
    height: "96px",
  },
  bar: {
    backgroundColor: theme.color.borderSubtle,
  },
  scanLine: {
    position: "absolute",
    left: "8%",
    right: "8%",
    height: "2px",
    backgroundColor: theme.color.textDanger,
    boxShadow: "0 0 8px rgba(255,0,0,0.8)",
    animation: "barcode-scan-line 1.6s ease-in-out infinite",
  },
  status: {
    textAlign: "center",
    color: theme.color.textTertiary,
    minHeight: "20px",
  },
  typeRow: {
    display: "flex",
    justifyContent: "center",
    columnGap: theme.spacing.xl,
    paddingTop: theme.spacing.xs,
  },
  typeOption: {
    display: "flex",
    alignItems: "center",
    columnGap: theme.spacing.sm,
    cursor: "pointer",
    fontSize: "13px",
  },
});

const L: Record<string, TranslationKey> = {
  title: "manufacturing.barcodeIdentification.scan.title",
  barcode: "manufacturing.barcodeIdentification.scan.barcode",
  qrCode: "manufacturing.barcodeIdentification.scan.qrCode",
  scanning: "manufacturing.barcodeIdentification.scan.scanning",
  cancel: "manufacturing.barcodeIdentification.scan.cancel",
};

const BARS = [4, 2, 6, 3, 8, 2, 4, 5, 3, 7, 2, 5, 4, 6, 3, 4, 2, 8, 3, 5];

interface ScanDialogProps {
  open: boolean;
  onClose: () => void;
  onDetected: (code: string) => void;
}

export function ScanDialog({ open, onClose, onDetected }: ScanDialogProps) {
  const { t } = useAppTranslation();
  const styles = useScanStyles();
  const [codeType, setCodeType] = useState<"barcode" | "qr">("qr");
  const detectedRef = useRef(false);

  useEffect(() => {
    if (!open) {
      detectedRef.current = false;
      return;
    }
    detectedRef.current = false;
    const timer = window.setTimeout(() => {
      if (!detectedRef.current) {
        detectedRef.current = true;
        onDetected("BAKER-01");
      }
    }, 2600);
    return () => window.clearTimeout(timer);
  }, [open, onDetected]);

  return (
    <BaseDialog
      open={open}
      title={t(L.title)}
      size="lg"
      onClose={onClose}
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onClose}
          confirmLabel={t(L.cancel)}
          hideCancel
        />
      }
    >
      <style>{`@keyframes barcode-scan-line { 0% { top: 12%; } 50% { top: 86%; } 100% { top: 12%; } }`}</style>
      <div className={styles.viewport} aria-label={t(L.title)}>
        <div className={styles.code} aria-hidden="true">
          {BARS.map((width, index) => (
            <span key={index} className={styles.bar} style={{ width: `${width}px` }} />
          ))}
        </div>
        <div className={styles.scanLine} aria-hidden="true" />
      </div>
      <Text className={styles.status}>{t(L.scanning)}</Text>
      <div className={styles.typeRow} role="radiogroup" aria-label={t(L.title)}>
        <label className={styles.typeOption}>
          <input
            type="radio"
            name="barcode-type"
            checked={codeType === "barcode"}
            onChange={() => setCodeType("barcode")}
          />
          {t(L.barcode)}
        </label>
        <label className={styles.typeOption}>
          <input
            type="radio"
            name="barcode-type"
            checked={codeType === "qr"}
            onChange={() => setCodeType("qr")}
          />
          {t(L.qrCode)}
        </label>
      </div>
    </BaseDialog>
  );
}
