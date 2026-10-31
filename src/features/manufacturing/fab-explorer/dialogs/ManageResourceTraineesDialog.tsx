import { useState } from "react";
import { useFabResources } from "@/api";
import { BaseDialog, DialogFooter, FormField } from "@/components/common";
import { Button, Input, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";

const useDialogStyles = makeStyles({
  list: { display: "flex", flexDirection: "column", rowGap: "8px" },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    fontSize: "13px",
  },
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
        <div style={{ display: "flex", columnGap: "8px" }}>
          <Input
            value={newTrainee}
            onChange={(_, data) => setNewTrainee(data.value)}
            style={{ flexGrow: 1 }}
          />
          <Button appearance="primary" onClick={addTrainee}>
            {t("fabExplorer.addTrainee")}
          </Button>
        </div>
      </FormField>
      <div className={styles.list}>
        {trainees.map((e) => (
          <div key={e} className={styles.row}>
            <span>{e}</span>
            <Button appearance="secondary" size="small" onClick={() => removeTrainee(e)}>
              {t("fabExplorer.removeTrainee")}
            </Button>
          </div>
        ))}
      </div>
      <div style={{ fontSize: "12px", color: tokens.colorNeutralForeground3 }}>
        {t("fabExplorer.resources")}: {resources.length}
      </div>
    </BaseDialog>
  );
}
