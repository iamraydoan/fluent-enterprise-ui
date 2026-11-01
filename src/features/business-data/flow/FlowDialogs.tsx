import { useState } from "react";
import { BaseDialog, DialogFooter, FormField, HStack  } from "@/components/common";
import { Button, Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

const L: Record<string, TranslationKey> = {
  logicalNamesTitle: "businessData.flow.manageDialog.logicalNamesTitle",
  logicalName: "businessData.flow.manageDialog.logicalName",
  addLogicalName: "businessData.flow.manageDialog.addLogicalName",
  remove: "businessData.flow.manageDialog.remove",
  update: "businessData.flow.manageDialog.update",
  cancel: "businessData.flow.manageDialog.cancel",
  reworkPathsTitle: "businessData.flow.manageDialog.reworkPathsTitle",
  filterByStep: "businessData.flow.manageDialog.filterByStep",
  close: "businessData.flow.manageDialog.close",
};


export function FlowLogicalNamesDialog({ onClose }: { onClose: () => void }) {
  const { t } = useAppTranslation();
  const [names, setNames] = useState<string[]>([]);

  return (
    <BaseDialog
      open
      title={t(L.logicalNamesTitle)}
      width="600px"
      onClose={onClose}
      footer={<DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(L.update)} />}
    >
      <HStack gap="8px" align="center">
        <Button size="sm" onClick={() => setNames([...names, ""])}>
          + {t(L.addLogicalName)}
        </Button>
      </HStack>
      {names.map((n, i) => (
        <HStack gap="8px" align="center" key={i}>
          <Input
            placeholder={t(L.logicalName)}
            value={n}
            onChange={(value) => setNames(names.map((x, j) => (j === i ? value : x)))}
          />
          <Button size="sm" onClick={() => setNames(names.filter((_, j) => j !== i))}>
            {t(L.remove)}
          </Button>
        </HStack>
      ))}
    </BaseDialog>
  );
}

export function FlowReworkPathsDialog({ onClose }: { onClose: () => void }) {
  const { t } = useAppTranslation();
  const [filter, setFilter] = useState("");

  return (
    <BaseDialog
      open
      title={t(L.reworkPathsTitle)}
      width="600px"
      onClose={onClose}
      footer={
        <Button variant="primary" onClick={onClose}>
          {t(L.close)}
        </Button>
      }
    >
      <FormField label={<>{t(L.filterByStep)}</>} labelWidth="150px">
        <Input value={filter} onChange={setFilter} />
      </FormField>
    </BaseDialog>
  );
}
