import { useState } from "react";
import { BaseDialog, DialogFooter, HStack } from "@/components/common";
import { Button, Input } from "@/components/ui";
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

interface DialogProps {
  name: string;
  onClose: () => void;
}

export function ManageDelegatesDialog({ name, onClose }: DialogProps) {
  const { t } = useAppTranslation();
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
      <HStack gap="8px" align="center">
        <Button
          size="sm"
          onClick={() => setDelegates([...delegates, { employee: "", validFrom: "", validTo: "" }])}
        >
          + {t(L.addDelegate)}
        </Button>
      </HStack>
      {delegates.map((d, i) => (
        <HStack gap="8px" align="center" key={i}>
          <Input
            placeholder={t(L.delegateEmployee)}
            value={d.employee}
            onChange={(value) =>
              setDelegates(delegates.map((x, j) => (j === i ? { ...x, employee: value } : x)))
            }
          />
          <Input
            placeholder={t(L.validFrom)}
            value={d.validFrom}
            onChange={(value) =>
              setDelegates(delegates.map((x, j) => (j === i ? { ...x, validFrom: value } : x)))
            }
          />
          <Input
            placeholder={t(L.validTo)}
            value={d.validTo}
            onChange={(value) =>
              setDelegates(delegates.map((x, j) => (j === i ? { ...x, validTo: value } : x)))
            }
          />
          <Button size="sm" onClick={() => setDelegates(delegates.filter((_, j) => j !== i))}>
            {t(L.remove)}
          </Button>
        </HStack>
      ))}
    </BaseDialog>
  );
}

export function ManageTraineesDialog({ name, onClose }: DialogProps) {
  const { t } = useAppTranslation();
  const [trainees, setTrainees] = useState<string[]>([]);

  return (
    <BaseDialog
      open
      title={`${t(L.manageTraineesTitle)} ${name}`}
      onClose={onClose}
      size="lg"
      footer={<DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(L.checkOut)} />}
    >
      <HStack gap="8px" align="center">
        <Button size="sm" onClick={() => setTrainees([...trainees, ""])}>
          + {t(L.addTrainee)}
        </Button>
      </HStack>
      {trainees.map((tr, i) => (
        <HStack gap="8px" align="center" key={i}>
          <Input
            value={tr}
            onChange={(value) => setTrainees(trainees.map((x, j) => (j === i ? value : x)))}
          />
          <Button size="sm" onClick={() => setTrainees(trainees.filter((_, j) => j !== i))}>
            {t(L.remove)}
          </Button>
        </HStack>
      ))}
    </BaseDialog>
  );
}
