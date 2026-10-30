import { useState } from "react";
import { Database20Regular, Dismiss20Regular } from "@/components/icons";
import {
  Button,
  Checkbox,
  Input,
  Text,
  makeStyles,
  tokens,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";


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
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "grid",
    placeItems: "center",
    padding: "24px",
    boxSizing: "border-box",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  surface: {
    width: "min(960px, calc(100vw - 48px))",
    maxHeight: "calc(100vh - 48px)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  head: {
    display: "flex",
    alignItems: "center",
    columnGap: "10px",
    height: "48px",
    padding: "0 16px",
    backgroundColor: "#DDE1E7",
    flexShrink: 0,
  },
  body: {
    padding: "20px 24px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    rowGap: "12px",
  },
  field: {
    display: "grid",
    gridTemplateColumns: "160px 1fr",
    alignItems: "center",
    columnGap: "12px",
  },
  label: { fontSize: "13px", textAlign: "right" },
  required: { color: tokens.colorPaletteRedForeground1 },
  sectionTitle: { fontSize: "14px", fontWeight: 600, paddingTop: "8px" },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    columnGap: "8px",
    padding: "12px 16px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0,
  },
  closeBtn: {
    marginLeft: "auto",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
    padding: "4px",
  },
});

export function CreateDataSiloDialog({ onClose }: { onClose: () => void }) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const shared = useSharedStyles();
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
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={`${shared.contentCard} ${styles.surface}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={t(L.title)}
      >
        <div className={styles.head}>
          <Database20Regular />
          <Text weight="semibold" size={400}>
            {t(L.title)}
          </Text>
          <button className={styles.closeBtn} onClick={onClose} aria-label={t("common.close")}>
            <Dismiss20Regular />
          </button>
        </div>
        <div className={styles.body}>
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
            <Checkbox
              checked={isExternal}
              onChange={(_, d) => setIsExternal(d.checked === true)}
            />,
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
        </div>
        <div className={styles.footer}>
          <Button appearance="secondary" onClick={onClose}>
            {t(L.cancel)}
          </Button>
          <Button appearance="primary" onClick={onClose} disabled={name.trim() === ""}>
            {t(L.create)}
          </Button>
        </div>
      </div>
    </div>
  );
}
