import { useState } from "react";
import { BaseDialog, DialogFooter, FormField } from "@/components/common";
import { Button, Checkbox, Input, Textarea, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { theme } from "@/styles/theme";

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
  select: {
    padding: "6px 8px",
    border: `1px solid ${theme.color.border}`,
    borderRadius: theme.radius.md,
    fontSize: theme.font.sizeMd,
    backgroundColor: theme.color.surface,
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
          <Button variant="secondary" onClick={onClose}>
            {t(L.cancel)}
          </Button>
          <Button variant="primary" onClick={onClose} disabled={material.trim().length === 0}>
            {t(L.link)}
          </Button>
        </>
      }
    >
      <FormField
        label={
          <>
            <span style={{ color: theme.color.textDanger }}>* </span>
            {t(L.material)}
          </>
        }
        labelWidth="150px"
      >
        <Input value={material} onChange={setMaterial} />
      </FormField>
      <FormField label={<>{t(L.mapOrder)}</>} labelWidth="150px">
        <Input value={mapOrder} onChange={setMapOrder} />
      </FormField>
      <FormField
        label={
          <>
            <span />
          </>
        }
        labelWidth="150px"
      >
        <Checkbox
          label={t(L.isMasterMap)}
          checked={isMasterMap === true}
          onChange={setIsMasterMap}
        />
      </FormField>
      {isMasterMap && (
        <FormField label={<>{t(L.linkageMode)}</>} labelWidth="150px">
          <select
            className={styles.select}
            value={linkageMode}
            onChange={(e) => setLinkageMode(e.target.value)}
          >
            <option value="Verify">{t(L.linkageVerify)}</option>
            <option value="Synchronize">{t(L.linkageSynchronize)}</option>
          </select>
        </FormField>
      )}
      <FormField
        label={
          <>
            <span />
          </>
        }
        labelWidth="150px"
      >
        <Checkbox label={t(L.isDefault)} checked={isDefault === true} onChange={setIsDefault} />
      </FormField>
      <FormField
        label={
          <>
            <span />
          </>
        }
        labelWidth="150px"
      >
        <Checkbox label={t(L.isMerged)} checked={isMerged === true} onChange={setIsMerged} />
      </FormField>
      <FormField label={<>{t(L.comment)}</>} labelWidth="150px">
        <Textarea value={comment} onChange={setComment} />
      </FormField>
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
  const [comment, setComment] = useState("");

  return (
    <BaseDialog
      open={open}
      title={t(L.unlinkTitle)}
      onClose={onClose}
      width="600px"
      footer={<DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(L.unlink)} />}
    >
      <div>{t(L.unlinkMessage, { name: mapName })}</div>
      <FormField label={<>{t(L.comment)}</>} labelWidth="150px">
        <Textarea value={comment} onChange={setComment} />
      </FormField>
    </BaseDialog>
  );
}
