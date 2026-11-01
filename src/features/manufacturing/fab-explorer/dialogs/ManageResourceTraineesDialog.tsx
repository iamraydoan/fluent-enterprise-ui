import { useState } from "react";
import { useFabResources } from "@/api";
import { BaseDialog, DialogFooter, FormField, HStack, VStack  } from "@/components/common";
import { Button, Input, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { theme } from "@/styles/theme";

const useDialogStyles = makeStyles({
  
  row: {
    padding: "8px 0",
    borderBottom: `1px solid ${theme.color.border}`,
    fontSize: "13px",
  }
});

interface ManageResourceTraineesDialogProps {
  open: boolean;
  facilityName: string;
  onClose: () => void;
}

export function ManageResourceTraineesDialog({
  open,
  facilityName,
  onClose,
}: ManageResourceTraineesDialogProps) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [trainees, setTrainees] = useState<string[]>(["Bob Wilson"]);
  const [newTrainee, setNewTrainee] = useState("");

  const { data: resources = [] } = useFabResources(undefined, facilityName);

  const addTrainee = () => {
    if (newTrainee.trim()) {
      setTrainees((prev) => [...prev, newTrainee.trim()]);
      setNewTrainee("");
    }
  };

  const removeTrainee = (name: string) => {
    setTrainees((prev) => prev.filter((e) => e !== name));
  };

  return (
    <BaseDialog
      open={open}
      title={t("fabExplorer.manageResourceTrainees")}
      onClose={onClose}
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onClose}
          confirmLabel={t("fabExplorer.finish")}
        />
      }
    >
      <FormField label={t("fabExplorer.addTrainee")}>
        <HStack gap="8px">
          <Input value={newTrainee} onChange={setNewTrainee} style={{ flexGrow: 1 }} />
          <Button variant="primary" onClick={addTrainee}>
            {t("fabExplorer.addTrainee")}
          </Button>
        </HStack>
      </FormField>
      <VStack gap="8px">
        {trainees.map((e) => (
          <HStack align="center" justify="space-between" key={e} className={styles.row}>
            <span>{e}</span>
            <Button variant="secondary" size="sm" onClick={() => removeTrainee(e)}>
              {t("fabExplorer.removeTrainee")}
            </Button>
          </HStack>
        ))}
      </VStack>
      <div style={{ fontSize: "12px", color: theme.color.textTertiary }}>
        {t("fabExplorer.resources")}: {resources.length}
      </div>
    </BaseDialog>
  );
}
