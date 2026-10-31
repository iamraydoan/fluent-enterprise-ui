import { useState } from "react";
import { BaseDialog, DialogFooter, FormField } from "@/components/common";
import { Button, Input, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

const L: Record<string, TranslationKey> = {
  title: "businessData.facility.manageShipping.title",
  facilities: "businessData.facility.manageShipping.facilities",
  facilityDetails: "businessData.facility.manageShipping.facilityDetails",
  addFacility: "businessData.facility.manageShipping.addFacility",
  removeFacility: "businessData.facility.manageShipping.removeFacility",
  facility: "businessData.facility.manageShipping.facility",
  description: "businessData.facility.manageShipping.description",
  type: "businessData.facility.manageShipping.type",
  isRemote: "businessData.facility.manageShipping.isRemote",
  cancel: "businessData.facility.manageShipping.cancel",
  update: "businessData.facility.manageShipping.update",
  yes: "common.yes",
  no: "common.no",
  none: "common.none",
};

const useStyles = makeStyles({
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
});

export function ManageShippingFacilitiesDialog({
  name,
  onClose,
}: {
  name: string;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();
  const styles = useStyles();
  const [facilities, setFacilities] = useState<string[]>(["Distribution Center", "Warehouse"]);
  const [selected, setSelected] = useState(0);
  const [facilityName, setFacilityName] = useState("Distribution Center");

  return (
    <BaseDialog
      open
      title={`${t(L.title)} ${name}`}
      width="860px"
      onClose={onClose}
      footer={<DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(L.update)} />}
    >
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "16px" }}>
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
          <FormField
            label={
              <>
                <span style={{ color: tokens.colorPaletteRedForeground1 }}>* </span>
                {t(L.facility)}
              </>
            }
            labelWidth="140px"
          >
            <Input
              value={facilityName}
              onChange={(_, d) => {
                setFacilityName(d.value);
                setFacilities(facilities.map((f, i) => (i === selected ? d.value : f)));
              }}
            />
          </FormField>
          <FormField label={<>{t(L.description)}</>} labelWidth="140px">
            <span>{t(L.none)}</span>
          </FormField>
          <FormField label={<>{t(L.type)}</>} labelWidth="140px">
            <span>{t(L.none)}</span>
          </FormField>
          <FormField label={<>{t(L.isRemote)}</>} labelWidth="140px">
            <span>{t(L.no)}</span>
          </FormField>
        </div>
      </div>
    </BaseDialog>
  );
}
