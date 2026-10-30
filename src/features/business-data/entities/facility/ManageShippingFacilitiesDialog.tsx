import { useState } from "react";
import { Button, Input, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";

const tk = (key: string) => key as TranslationKey;

const L = {
  title: tk("businessData.facility.manageShipping.title"),
  facilities: tk("businessData.facility.manageShipping.facilities"),
  facilityDetails: tk("businessData.facility.manageShipping.facilityDetails"),
  addFacility: tk("businessData.facility.manageShipping.addFacility"),
  removeFacility: tk("businessData.facility.manageShipping.removeFacility"),
  facility: tk("businessData.facility.manageShipping.facility"),
  description: tk("businessData.facility.manageShipping.description"),
  type: tk("businessData.facility.manageShipping.type"),
  isRemote: tk("businessData.facility.manageShipping.isRemote"),
  cancel: tk("businessData.facility.manageShipping.cancel"),
  update: tk("businessData.facility.manageShipping.update"),
  yes: tk("common.yes"),
  no: tk("common.no"),
  none: tk("common.none"),
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
    width: "860px",
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
    display: "grid",
    gridTemplateColumns: "240px 1fr",
    gap: "16px",
    overflowY: "auto",
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    padding: "12px 16px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  panelHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "8px",
    fontWeight: tokens.fontWeightSemibold,
  },
  list: {
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    overflow: "hidden",
  },
  item: {
    padding: "8px 12px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    cursor: "pointer",
  },
  itemActive: {
    padding: "8px 12px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    cursor: "pointer",
    backgroundColor: tokens.colorNeutralBackground2,
    fontWeight: tokens.fontWeightSemibold,
  },
  details: { display: "flex", flexDirection: "column", gap: "12px" },
  field: { display: "grid", gridTemplateColumns: "140px 1fr", gap: "12px", alignItems: "center" },
});

export function ManageShippingFacilitiesDialog({
  name,
  onClose,
}: {
  name: string;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  const shared = useSharedStyles();
  const styles = useDialogStyles();
  const [facilities, setFacilities] = useState<string[]>(["Distribution Center", "Warehouse"]);
  const [selected, setSelected] = useState(0);
  const [facilityName, setFacilityName] = useState("Distribution Center");

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
          <div>
            <div className={styles.panelHead}>
              <span>{t(L.facilities)}</span>
              <Button
                size="small"
                onClick={() => {
                  const next = [...facilities, ""];
                  setFacilities(next);
                  setSelected(next.length - 1);
                  setFacilityName("");
                }}
              >
                + {t(L.addFacility)}
              </Button>
            </div>
            <div className={styles.list}>
              {facilities.map((f, i) => (
                <div
                  key={i}
                  className={i === selected ? styles.itemActive : styles.item}
                  onClick={() => {
                    setSelected(i);
                    setFacilityName(f);
                  }}
                >
                  {f || t(L.none)}
                </div>
              ))}
            </div>
            {facilities.length > 0 && (
              <Button
                size="small"
                style={{ marginTop: "8px" }}
                onClick={() => {
                  const next = facilities.filter((_, i) => i !== selected);
                  setFacilities(next);
                  setSelected(0);
                  setFacilityName(next[0] ?? "");
                }}
              >
                {t(L.removeFacility)}
              </Button>
            )}
          </div>
          <div className={styles.details}>
            <div className={styles.panelHead}>{t(L.facilityDetails)}</div>
            <div className={styles.field}>
              <label>
                <span style={{ color: tokens.colorPaletteRedForeground1 }}>* </span>
                {t(L.facility)}
              </label>
              <Input
                value={facilityName}
                onChange={(_, d) => {
                  setFacilityName(d.value);
                  setFacilities(facilities.map((f, i) => (i === selected ? d.value : f)));
                }}
              />
            </div>
            <div className={styles.field}>
              <label>{t(L.description)}</label>
              <span>{t(L.none)}</span>
            </div>
            <div className={styles.field}>
              <label>{t(L.type)}</label>
              <span>{t(L.none)}</span>
            </div>
            <div className={styles.field}>
              <label>{t(L.isRemote)}</label>
              <span>{t(L.no)}</span>
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          <Button appearance="primary" onClick={onClose}>
            {t(L.update)}
          </Button>
        </div>
      </div>
    </div>
  );
}
