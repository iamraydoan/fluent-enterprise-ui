import { useState } from "react";
import { Button, Checkbox, Input, Textarea, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";

const tk = (key: string) => key as TranslationKey;

const L = {
  linkTitle: tk("businessData.map.linkDialog.linkTitle"),
  material: tk("businessData.map.linkDialog.material"),
  mapOrder: tk("businessData.map.linkDialog.mapOrder"),
  isMasterMap: tk("businessData.map.linkDialog.isMasterMap"),
  linkageMode: tk("businessData.map.linkDialog.linkageMode"),
  linkageVerify: tk("businessData.map.linkDialog.linkageVerify"),
  linkageSynchronize: tk("businessData.map.linkDialog.linkageSynchronize"),
  isDefault: tk("businessData.map.linkDialog.isDefault"),
  isMerged: tk("businessData.map.linkDialog.isMerged"),
  comment: tk("businessData.map.linkDialog.comment"),
  link: tk("businessData.map.linkDialog.link"),
  unlinkTitle: tk("businessData.map.linkDialog.unlinkTitle"),
  unlinkMessage: tk("businessData.map.linkDialog.unlinkMessage"),
  unlink: tk("businessData.map.linkDialog.unlink"),
  cancel: tk("businessData.map.linkDialog.cancel"),
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
    width: "600px",
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
  field: { display: "grid", gridTemplateColumns: "150px 1fr", gap: "12px", alignItems: "center" },
  select: {
    padding: "6px 8px",
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    fontSize: tokens.fontSizeBase300,
    backgroundColor: tokens.colorNeutralBackground1,
  },
});

export function MapLinkDialog({ mapName, onClose }: { mapName: string; onClose: () => void }) {
  const { t } = useAppTranslation();
  const shared = useSharedStyles();
  const styles = useDialogStyles();
  const [material, setMaterial] = useState("");
  const [mapOrder, setMapOrder] = useState("1");
  const [isMasterMap, setIsMasterMap] = useState(false);
  const [linkageMode, setLinkageMode] = useState("Verify");
  const [isDefault, setIsDefault] = useState(false);
  const [isMerged, setIsMerged] = useState(false);
  const [comment, setComment] = useState("");

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={`${shared.contentCard} ${styles.surface}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.head}>{t(L.linkTitle, { name: mapName })}</div>
        <div className={styles.body}>
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
        </div>
        <div className={styles.footer}>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          <Button appearance="primary" onClick={onClose} disabled={material.trim().length === 0}>
            {t(L.link)}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function MapUnlinkDialog({ mapName, onClose }: { mapName: string; onClose: () => void }) {
  const { t } = useAppTranslation();
  const shared = useSharedStyles();
  const styles = useDialogStyles();
  const [comment, setComment] = useState("");

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={`${shared.contentCard} ${styles.surface}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.head}>{t(L.unlinkTitle)}</div>
        <div className={styles.body}>
          <div>{t(L.unlinkMessage, { name: mapName })}</div>
          <div className={styles.field}>
            <label>{t(L.comment)}</label>
            <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
          </div>
        </div>
        <div className={styles.footer}>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          <Button appearance="primary" onClick={onClose}>
            {t(L.unlink)}
          </Button>
        </div>
      </div>
    </div>
  );
}
