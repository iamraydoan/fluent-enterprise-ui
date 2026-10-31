import { useState } from "react";
import { BaseDialog } from "@/components/common";
import { Button, Checkbox, Input, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

const L: Record<string, TranslationKey> = {
  title: "businessData.dataSilo.create.title",
  name: "businessData.dataSilo.create.name",
  description: "businessData.dataSilo.create.description",
  type: "businessData.dataSilo.create.type",
  typeDefault: "businessData.dataSilo.create.typeDefault",
  dataVersion: "businessData.dataSilo.create.dataVersion",
  enterpriseName: "businessData.dataSilo.create.enterpriseName",
  facilityName: "businessData.dataSilo.create.facilityName",
  isExternal: "businessData.dataSilo.create.isExternal",
  isSystem: "businessData.dataSilo.create.isSystem",
  keywords: "businessData.dataSilo.create.keywords",
  siteName: "businessData.dataSilo.create.siteName",
  user: "businessData.dataSilo.create.user",
  comments: "businessData.dataSilo.create.comments",
  cancel: "businessData.dataSilo.create.cancel",
  create: "businessData.dataSilo.create.create",
  properties: "businessData.dataSilo.details.properties",
};

const useDialogStyles = makeStyles({
  field: {
    display: "grid",
    gridTemplateColumns: "160px 1fr",
    alignItems: "center",
    columnGap: "12px",
  },
  label: { fontSize: "13px", textAlign: "right" },
  required: { color: tokens.colorPaletteRedForeground1 },
  sectionTitle: { fontSize: "14px", fontWeight: 600, paddingTop: "8px" },
});

export function CreateDataSiloDialog({ onClose }: { onClose: () => void }) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isExternal, setIsExternal] = useState(false);
  const [isSystem, setIsSystem] = useState(false);

  const field = (labelKey: TranslationKey, required: boolean, control: React.ReactNode) => (
    <div className={styles.field}>
      <span className={styles.label}>
        {required && <span className={styles.required}>* </span>}
        {t(labelKey)}
      </span>
      {control}
    </div>
  );

  return (
    <BaseDialog
      open
      title={t(L.title)}
      onClose={onClose}
      size="xl"
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t(L.cancel)}
          </Button>
          <Button appearance="primary" onClick={onClose} disabled={name.trim() === ""}>
            {t(L.create)}
          </Button>
        </>
      }
    >
      {field(L.name, false, <Input value={name} onChange={(_, d) => setName(d.value)} />)}
      {field(
        L.description,
        false,
        <Input value={description} onChange={(_, d) => setDescription(d.value)} />,
      )}
      {field(L.type, true, <Input value={t(L.typeDefault)} disabled />)}
      <div className={styles.sectionTitle}>{t(L.properties)}</div>
      {field(L.dataVersion, false, <Input />)}
      {field(L.enterpriseName, false, <Input />)}
      {field(L.facilityName, false, <Input />)}
      {field(
        L.isExternal,
        false,
        <Checkbox checked={isExternal} onChange={(_, d) => setIsExternal(d.checked === true)} />,
      )}
      {field(
        L.isSystem,
        false,
        <Checkbox checked={isSystem} onChange={(_, d) => setIsSystem(d.checked === true)} />,
      )}
      {field(L.keywords, false, <Input />)}
      {field(L.siteName, false, <Input />)}
      {field(L.user, true, <Input />)}
      {field(L.comments, false, <Input />)}
    </BaseDialog>
  );
}
