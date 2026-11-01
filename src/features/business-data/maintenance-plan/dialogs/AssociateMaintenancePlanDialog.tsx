import { useState } from "react";
import { BaseDialog, FormField } from "@/components/common";
import { Button, Input, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { theme } from "@/styles/theme";

const L: Record<string, TranslationKey> = {
  title: "businessData.maintenancePlan.associate.title",
  entityType: "businessData.maintenancePlan.associate.entityType",
  entity: "businessData.maintenancePlan.associate.entity",
  area: "businessData.maintenancePlan.associate.area",
  container: "businessData.maintenancePlan.associate.container",
  material: "businessData.maintenancePlan.associate.material",
  resource: "businessData.maintenancePlan.associate.resource",
  cancel: "businessData.maintenancePlan.associate.cancel",
  associate: "businessData.maintenancePlan.associate.associate",
};

const useDialogStyles = makeStyles({
  select: {
    padding: `6px ${theme.spacing.sm}`,
    border: `1px solid ${theme.color.border}`,
    borderRadius: theme.radius.md,
    fontSize: theme.font.sizeMd,
    backgroundColor: theme.color.surface,
  },
});

export function AssociateMaintenancePlanDialog({
  open,
  name,
  onClose,
}: {
  open: boolean;
  name: string;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [entityType, setEntityType] = useState("Area");
  const [entity, setEntity] = useState("");

  return (
    <BaseDialog
      open={open}
      title={`${t(L.title)} ${name}`}
      onClose={onClose}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t(L.cancel)}
          </Button>
          <Button variant="primary" onClick={onClose} disabled={!entity.trim()}>
            {t(L.associate)}
          </Button>
        </>
      }
    >
      <FormField label={<>{t(L.entityType)}</>} labelWidth="160px">
        <select
          className={styles.select}
          value={entityType}
          onChange={(e) => setEntityType(e.target.value)}
        >
          <option value="Area">{t(L.area)}</option>
          <option value="Container">{t(L.container)}</option>
          <option value="Material">{t(L.material)}</option>
          <option value="Resource">{t(L.resource)}</option>
        </select>
      </FormField>
      <FormField
        label={
          <>
            <span style={{ color: theme.color.textDanger }}>* </span>
            {t(L.entity)}
          </>
        }
        labelWidth="160px"
      >
        <Input value={entity} onChange={setEntity} />
      </FormField>
    </BaseDialog>
  );
}
