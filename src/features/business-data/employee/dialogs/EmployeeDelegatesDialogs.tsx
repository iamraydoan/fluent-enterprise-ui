import { useState } from "react";
import { BaseDialog, DialogFooter } from "@/components/common";
import { Button, Input, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

const L: Record<string, TranslationKey> = {
  manageDelegatesTitle: "businessData.employee.delegates.manageDelegatesTitle",
  manageTraineesTitle: "businessData.employee.delegates.manageTraineesTitle",
  delegateEmployee: "businessData.employee.delegates.delegateEmployee",
  validFrom: "businessData.employee.delegates.validFrom",
  validTo: "businessData.employee.delegates.validTo",
  addDelegate: "businessData.employee.delegates.addDelegate",
  addTrainee: "businessData.employee.delegates.addTrainee",
  cancel: "businessData.employee.delegates.cancel",
  update: "businessData.employee.delegates.update",
  checkOut: "businessData.employee.delegates.checkOut",
  remove: "businessData.employee.dialog.remove",
};

const useDialogStyles = makeStyles({
  row: { display: "flex", gap: "8px", alignItems: "center" },
});

interface DialogProps {
  name: string;
  onClose: () => void;
}

export function ManageDelegatesDialog({ name, onClose }: DialogProps) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [delegates, setDelegates] = useState<
    { employee: string; validFrom: string; validTo: string }[]
  >([]);

  return (
    <BaseDialog
      open
      title={`${t(L.manageDelegatesTitle)} ${name}`}
      onClose={onClose}
      size="lg"
      footer={<DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(L.update)} />}
    >
      <div className={styles.row}>
        <Button
          size="small"
          onClick={() => setDelegates([...delegates, { employee: "", validFrom: "", validTo: "" }])}
        >
          + {t(L.addDelegate)}
        </Button>
      </div>
      {delegates.map((d, i) => (
        <div key={i} className={styles.row}>
          <Input
            placeholder={t(L.delegateEmployee)}
            value={d.employee}
            onChange={(_, v) =>
              setDelegates(delegates.map((x, j) => (j === i ? { ...x, employee: v.value } : x)))
            }
          />
          <Input
            placeholder={t(L.validFrom)}
            value={d.validFrom}
            onChange={(_, v) =>
              setDelegates(delegates.map((x, j) => (j === i ? { ...x, validFrom: v.value } : x)))
            }
          />
          <Input
            placeholder={t(L.validTo)}
            value={d.validTo}
            onChange={(_, v) =>
              setDelegates(delegates.map((x, j) => (j === i ? { ...x, validTo: v.value } : x)))
            }
          />
          <Button size="small" onClick={() => setDelegates(delegates.filter((_, j) => j !== i))}>
            {t(L.remove)}
          </Button>
        </div>
      ))}
    </BaseDialog>
  );
}

export function ManageTraineesDialog({ name, onClose }: DialogProps) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [trainees, setTrainees] = useState<string[]>([]);

  return (
    <BaseDialog
      open
      title={`${t(L.manageTraineesTitle)} ${name}`}
      onClose={onClose}
      size="lg"
      footer={<DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(L.checkOut)} />}
    >
      <div className={styles.row}>
        <Button size="small" onClick={() => setTrainees([...trainees, ""])}>
          + {t(L.addTrainee)}
        </Button>
      </div>
      {trainees.map((tr, i) => (
        <div key={i} className={styles.row}>
          <Input
            value={tr}
            onChange={(_, v) => setTrainees(trainees.map((x, j) => (j === i ? v.value : x)))}
          />
          <Button size="small" onClick={() => setTrainees(trainees.filter((_, j) => j !== i))}>
            {t(L.remove)}
          </Button>
        </div>
      ))}
    </BaseDialog>
  );
}
