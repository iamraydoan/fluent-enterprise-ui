import { useState } from "react";
import { BaseDialog, DialogFooter } from "@/components/common";
import { Button, Checkbox, Input, Textarea, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

const L: Record<string, TranslationKey> = {
  linkTitle: "businessData.map.linkDialog.linkTitle",
  material: "businessData.map.linkDialog.material",
  mapOrder: "businessData.map.linkDialog.mapOrder",
  isMasterMap: "businessData.map.linkDialog.isMasterMap",
  linkageMode: "businessData.map.linkDialog.linkageMode",
  linkageVerify: "businessData.map.linkDialog.linkageVerify",
  linkageSynchronize: "businessData.map.linkDialog.linkageSynchronize",
  isDefault: "businessData.map.linkDialog.isDefault",
  isMerged: "businessData.map.linkDialog.isMerged",
  comment: "businessData.map.linkDialog.comment",
  link: "businessData.map.linkDialog.link",
  unlinkTitle: "businessData.map.linkDialog.unlinkTitle",
  unlinkMessage: "businessData.map.linkDialog.unlinkMessage",
  unlink: "businessData.map.linkDialog.unlink",
  cancel: "businessData.map.linkDialog.cancel",
};

const useDialogStyles = makeStyles({
  field: { display: "grid", gridTemplateColumns: "150px 1fr", gap: "12px", alignItems: "center" },
  select: {
    padding: "6px 8px",
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    fontSize: tokens.fontSizeBase300,
    backgroundColor: tokens.colorNeutralBackground1,
  },
});

export function MapLinkDialog({
  open,
  mapName,
  onClose,
}: {
  open: boolean;
  mapName: string;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [material, setMaterial] = useState("");
  const [mapOrder, setMapOrder] = useState("1");
  const [isMasterMap, setIsMasterMap] = useState(false);
  const [linkageMode, setLinkageMode] = useState("Verify");
  const [isDefault, setIsDefault] = useState(false);
  const [isMerged, setIsMerged] = useState(false);
  const [comment, setComment] = useState("");

  return (
    <BaseDialog
      open={open}
      title={t(L.linkTitle, { name: mapName })}
      onClose={onClose}
      width="600px"
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t(L.cancel)}
          </Button>
          <Button
            appearance="primary"
            onClick={onClose}
            disabled={material.trim().length === 0}
          >
            {t(L.link)}
          </Button>
        </>
      }
    >
      <div className={styles.field}>
        <label>
          <span style={{ color: tokens.colorPaletteRedForeground1 }}>* </span>
          {t(L.material)}
        </label>
        <Input value={material} onChange={(_, d) => setMaterial(d.value)} />
      </div>
      <div className={styles.field}>
        <label>{t(L.mapOrder)}</label>
        <Input value={mapOrder} onChange={(_, d) => setMapOrder(d.value)} />
      </div>
      <div className={styles.field}>
        <span />
        <Checkbox
          label={t(L.isMasterMap)}
          checked={isMasterMap === true}
          onChange={(_, d) => setIsMasterMap(d.checked === true)}
        />
      </div>
      {isMasterMap && (
        <div className={styles.field}>
          <label>{t(L.linkageMode)}</label>
          <select
            className={styles.select}
            value={linkageMode}
            onChange={(e) => setLinkageMode(e.target.value)}
          >
            <option value="Verify">{t(L.linkageVerify)}</option>
            <option value="Synchronize">{t(L.linkageSynchronize)}</option>
          </select>
        </div>
      )}
      <div className={styles.field}>
        <span />
        <Checkbox
          label={t(L.isDefault)}
          checked={isDefault === true}
          onChange={(_, d) => setIsDefault(d.checked === true)}
        />
      </div>
      <div className={styles.field}>
        <span />
        <Checkbox
          label={t(L.isMerged)}
          checked={isMerged === true}
          onChange={(_, d) => setIsMerged(d.checked === true)}
        />
      </div>
      <div className={styles.field}>
        <label>{t(L.comment)}</label>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </div>
    </BaseDialog>
  );
}

export function MapUnlinkDialog({
  open,
  mapName,
  onClose,
}: {
  open: boolean;
  mapName: string;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [comment, setComment] = useState("");

  return (
    <BaseDialog
      open={open}
      title={t(L.unlinkTitle)}
      onClose={onClose}
      width="600px"
      footer={
        <DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(L.unlink)} />
      }
    >
      <div>{t(L.unlinkMessage, { name: mapName })}</div>
      <div className={styles.field}>
        <label>{t(L.comment)}</label>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </div>
    </BaseDialog>
  );
}
