import { useState } from "react";
import {
  Body1Strong,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Field,
  Input,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";

interface UnterminateRecipeDialogProps {
  open: boolean;
  onClose: () => void;
  recipeName: string;
}

export function UnterminateRecipeDialog({
  open,
  onClose,
  recipeName,
}: UnterminateRecipeDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.recipe.dialogs.unterminate";
  const [step, setStep] = useState(1);
  const [changeSet, setChangeSet] = useState("");
  const [approverRole, setApproverRole] = useState("");
  const [automaticChangeSet, setAutomaticChangeSet] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface style={{ maxWidth: 800, width: "88vw" }}>
        <DialogBody>
          <DialogTitle>{t(`${k}.title`)}</DialogTitle>
          <DialogContent>
            <div style={{ display: "flex", alignItems: "center", columnGap: 8, marginBottom: 12 }}>
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  backgroundColor: step === 1 ? "#0078d4" : "#ccc",
                  color: "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                }}
              >
                1
              </span>
              <Body1Strong>{t(`${k}.changeSet`)}</Body1Strong>
              <span style={{ width: 40, height: 1, backgroundColor: "#ccc" }} />
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  backgroundColor: step === 2 ? "#0078d4" : "#ccc",
                  color: "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                }}
              >
                2
              </span>
              <Body1Strong>{t(`${k}.details`)}</Body1Strong>
            </div>

            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", rowGap: 12 }}>
                <Field label={t(`${k}.changeSet`)}>
                  <div style={{ display: "flex", columnGap: 8 }}>
                    <Input value={changeSet} onChange={(_, d) => setChangeSet(d.value)} />
                    <Button appearance="secondary" onClick={() => {}}>
                      {t(`${k}.createNew`)}
                    </Button>
                  </div>
                </Field>
                <Field label={t(`${k}.approverRole`)}>
                  <Input value={approverRole} onChange={(_, d) => setApproverRole(d.value)} />
                </Field>
                <Field label={t(`${k}.useAutomaticChangeSet`)}>
                  <Checkbox
                    checked={automaticChangeSet}
                    onChange={(_, d) => setAutomaticChangeSet(d.checked === true)}
                  />
                </Field>
              </div>
            )}

            {step === 2 && (
              <div style={{ padding: "12px 0" }}>{t(`${k}.message`, { name: recipeName })}</div>
            )}
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            {step === 2 && (
              <Button appearance="secondary" onClick={() => setStep(1)}>
                {t("common.back")}
              </Button>
            )}
            {step === 1 ? (
              <Button appearance="primary" onClick={() => setStep(2)}>
                {t("common.next")}
              </Button>
            ) : (
              <Button appearance="primary" onClick={onClose}>
                {t(`${k}.confirm`)}
              </Button>
            )}
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
