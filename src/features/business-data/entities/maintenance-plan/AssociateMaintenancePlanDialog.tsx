import { useState } from "react";
import { Button, Input, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";

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
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  surface: {
    width: "560px",
    maxWidth: "95vw",
    display: "flex",
    flexDirection: "column",
    maxHeight: "90vh",
  },
  head: {
    padding: "12px 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase400,
  },
  body: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    overflowY: "auto",
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    padding: "12px 16px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
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
  name,
  onClose,
}: {
  name: string;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  const shared = useSharedStyles();
  const styles = useDialogStyles();
  const [entityType, setEntityType] = useState("Area");
  const [entity, setEntity] = useState("");

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={`${shared.contentCard} ${styles.surface}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.head}>
          {t(L.title)} {name}
        </div>
        <div className={styles.body}>
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
        </div>
        <div className={styles.footer}>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          <Button appearance="primary" onClick={onClose} disabled={!entity.trim()}>
            {t(L.associate)}
          </Button>
        </div>
      </div>
    </div>
  );
}
