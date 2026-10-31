import { useEffect, useState } from "react";
import {
  BARCODE_ENTITIES,
  BARCODE_PROPERTY_OPTIONS,
  useBarcodeIdentificationSettings,
  useUpdateBarcodeIdentificationSettings,
} from "@/api";
import type { BarcodeEntityKind } from "@/api";
import { BaseDialog, DialogFooter, SidebarNavItem } from "@/components/common";
import { makeStyles, Text, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

const useSettingsStyles = makeStyles({
  body: {
    display: "grid",
    gridTemplateColumns: "220px 1fr",
    columnGap: "16px",
    minHeight: "280px",
  },
  listLabel: {
    fontSize: "13px",
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: "8px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    rowGap: "16px",
  },
  field: {
    display: "grid",
    gridTemplateColumns: "140px 1fr",
    columnGap: "12px",
    alignItems: "center",
    fontSize: "13px",
  },
  required: {
    color: tokens.colorPaletteRedForeground1,
  },
  select: {
    fontFamily: "inherit",
    fontSize: "13px",
    padding: "6px 8px",
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground1,
    maxWidth: "360px",
  },
});

const L: Record<string, TranslationKey> = {
  title: "manufacturing.barcodeIdentification.settings.title",
  entities: "manufacturing.barcodeIdentification.settings.entities",
  entity: "manufacturing.barcodeIdentification.settings.entity",
  barcodeProperty: "manufacturing.barcodeIdentification.settings.barcodeProperty",
  material: "manufacturing.barcodeIdentification.settings.entityNames.material",
  resource: "manufacturing.barcodeIdentification.settings.entityNames.resource",
  container: "manufacturing.barcodeIdentification.settings.entityNames.container",
  save: "common.save",
  cancel: "common.cancel",
};

const ENTITY_LABEL_KEYS: Record<BarcodeEntityKind, TranslationKey> = {
  material: L.material,
  resource: L.resource,
  container: L.container,
};

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsDialog({ open, onClose }: SettingsDialogProps) {
  const { t } = useAppTranslation();
  const styles = useSettingsStyles();
  const { data: settings } = useBarcodeIdentificationSettings();
  const updateSettings = useUpdateBarcodeIdentificationSettings();
  const [selectedEntity, setSelectedEntity] = useState<BarcodeEntityKind>("material");
  const [properties, setProperties] = useState<Record<BarcodeEntityKind, string>>({
    material: "Name",
    resource: "Name",
    container: "Name",
  });

  useEffect(() => {
    if (open && settings) {
      setProperties({ ...settings.barcodePropertyByEntity });
      setSelectedEntity("material");
    }
  }, [open, settings]);

  const handleSave = () => {
    updateSettings.mutate({ barcodePropertyByEntity: properties }, { onSuccess: onClose });
  };

  return (
    <BaseDialog
      open={open}
      title={t(L.title)}
      size="lg"
      onClose={onClose}
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={handleSave}
          confirmLabel={t(L.save)}
          cancelLabel={t(L.cancel)}
          disabled={updateSettings.isPending}
        />
      }
    >
      <div className={styles.body}>
        <div>
          <Text className={styles.listLabel}>{t(L.entities)}</Text>
          {BARCODE_ENTITIES.map((entity) => (
            <SidebarNavItem
              key={entity}
              label={t(ENTITY_LABEL_KEYS[entity])}
              active={selectedEntity === entity}
              onClick={() => setSelectedEntity(entity)}
            />
          ))}
        </div>
        <div className={styles.form}>
          <div className={styles.field}>
            <Text>
              <span className={styles.required}>* </span>
              {t(L.entity)}:
            </Text>
            <Text weight="semibold">{t(ENTITY_LABEL_KEYS[selectedEntity])}</Text>
          </div>
          <div className={styles.field}>
            <Text>
              <span className={styles.required}>* </span>
              {t(L.barcodeProperty)}:
            </Text>
            <select
              className={styles.select}
              value={properties[selectedEntity]}
              onChange={(event) =>
                setProperties((prev) => ({ ...prev, [selectedEntity]: event.target.value }))
              }
              aria-label={t(L.barcodeProperty)}
            >
              {BARCODE_PROPERTY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </BaseDialog>
  );
}
