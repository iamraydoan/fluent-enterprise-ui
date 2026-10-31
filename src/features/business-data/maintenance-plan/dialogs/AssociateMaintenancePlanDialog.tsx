import { useState } from "react";
import { BaseDialog } from "@/components/common";
import { Button, Input, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

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
  field: { display: "grid", gridTemplateColumns: "160px 1fr", gap: "12px", alignItems: "center" },
  select: {
    padding: "6px 8px",
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    fontSize: tokens.fontSizeBase300,
    backgroundColor: tokens.colorNeutralBackground1,
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
          <Button appearance="secondary" onClick={onClose}>
            {t(L.cancel)}
          </Button>
          <Button appearance="primary" onClick={onClose} disabled={!entity.trim()}>
            {t(L.associate)}
          </Button>
        </>
      }
    >
      <div className={styles.field}>
        <label>{t(L.entityType)}</label>
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
      </div>
      <div className={styles.field}>
        <label>
          <span style={{ color: tokens.colorPaletteRedForeground1 }}>* </span>
          {t(L.entity)}
        </label>
        <Input value={entity} onChange={(_, d) => setEntity(d.value)} />
      </div>
    </BaseDialog>
  );
}
