import { useState } from "react";
import { useFabResources } from "@/api";
import type { FabResourceState } from "@/api";
import { BaseDialog, FormField } from "@/components/common";
import { Button, Checkbox, Input, Text, Textarea, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";

const useDialogStyles = makeStyles({
  stepsBar: {
    display: "flex",
    alignItems: "center",
    columnGap: "8px",
    margin: "-16px -20px 0",
    padding: "12px 20px",
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorNeutralForegroundOnBrand,
    fontSize: "13px",
    fontWeight: tokens.fontWeightSemibold,
  },
  stepActive: { display: "flex", alignItems: "center", columnGap: "6px" },
  stepInactive: {
    display: "flex",
    alignItems: "center",
    columnGap: "6px",
    opacity: 0.6,
  },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
  th: {
    textAlign: "left",
    padding: "8px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    color: tokens.colorNeutralForeground3,
    fontSize: "12px",
    textTransform: "uppercase",
  },
  td: { padding: "8px", borderBottom: `1px solid ${tokens.colorNeutralStroke1}` },
  rowSelected: { backgroundColor: tokens.colorNeutralBackground1Selected },
  commentsBox: { marginTop: "16px" },
});

interface ChangeResourcesDialogProps {
  open: boolean;
  facilityName: string;
  onClose: () => void;
}

const STATES: FabResourceState[] = ["Up", "Down", "Maintenance", "NonScheduled"];

export function ChangeResourcesDialog({ open, facilityName, onClose }: ChangeResourcesDialogProps) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [newState, setNewState] = useState<FabResourceState>("Up");
  const [comments, setComments] = useState("");
  const [search, setSearch] = useState("");

  const { data: resources = [] } = useFabResources(undefined, facilityName);

  const filtered = resources.filter(
    (r) => !search || r.name.toLowerCase().includes(search.toLowerCase()),
  );

  const toggle = (name: string) => {
    setSelected((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
  };

  const toggleAll = () => {
    setSelected((prev) => (prev.length === filtered.length ? [] : filtered.map((r) => r.name)));
  };

  const handleClose = () => {
    setStep(0);
    setSelected([]);
    setComments("");
    onClose();
  };

  const footer =
    step === 0 ? (
      <>
        <Button appearance="secondary" onClick={handleClose}>
          {t("fabExplorer.cancel")}
        </Button>
        <Button appearance="primary" disabled={selected.length === 0} onClick={() => setStep(1)}>
          {t("fabExplorer.next")}
        </Button>
      </>
    ) : (
      <>
        <Button appearance="secondary" onClick={() => setStep(0)}>
          {t("fabExplorer.back")}
        </Button>
        <Button appearance="primary" onClick={handleClose}>
          {t("fabExplorer.finish")}
        </Button>
      </>
    );

  return (
    <BaseDialog
      open={open}
      title={t("fabExplorer.changeAreaResourcesState")}
      width="min(900px, calc(100vw - 48px))"
      onClose={handleClose}
      footer={footer}
    >
      <div className={styles.stepsBar}>
        <span className={styles.stepActive}>1. {t("fabExplorer.resources")}</span>
        <span>-</span>
        <span className={styles.stepInactive}>2. {t("fabExplorer.newState")}</span>
      </div>

      {step === 0 && (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Input
              placeholder={t("fabExplorer.search")}
              value={search}
              onChange={(_, data) => setSearch(data.value)}
              style={{ width: "200px" }}
            />
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>
                  <Checkbox
                    checked={selected.length === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                  />
                </th>
                <th className={styles.th}>{t("fabExplorer.resource")}</th>
                <th className={styles.th}>{t("fabExplorer.systemState")}</th>
                <th className={styles.th}>{t("fabExplorer.stateModelState")}</th>
                <th className={styles.th}>{t("fabExplorer.type")}</th>
                <th className={styles.th}>{t("fabExplorer.description")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.name}
                  className={selected.includes(r.name) ? styles.rowSelected : undefined}
                >
                  <td className={styles.td}>
                    <Checkbox checked={selected.includes(r.name)} onChange={() => toggle(r.name)} />
                  </td>
                  <td className={styles.td} style={{ color: tokens.colorBrandForeground1 }}>
                    {r.name}
                  </td>
                  <td className={styles.td}>{r.state}</td>
                  <td className={styles.td}>{r.stateModelState}</td>
                  <td className={styles.td}>{r.type}</td>
                  <td className={styles.td}>{r.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.commentsBox}>
            <FormField label={t("fabExplorer.comments")}>
              <Textarea value={comments} onChange={(_, data) => setComments(data.value)} rows={3} />
            </FormField>
          </div>
        </>
      )}

      {step === 1 && (
        <>
          <FormField label={t("fabExplorer.selectState")}>
            <select
              value={newState}
              onChange={(e) => setNewState(e.target.value as FabResourceState)}
              style={{ padding: "8px", borderRadius: "4px", width: "100%" }}
            >
              {STATES.map((s) => (
                <option key={s} value={s}>
                  {t(`fabExplorer.${s.charAt(0).toLowerCase() + s.slice(1)}` as never)}
                </option>
              ))}
            </select>
          </FormField>
          <div>
            <Text weight="semibold" size={300}>
              {t("fabExplorer.resources")}: {selected.length}
            </Text>
            <ul style={{ fontSize: "13px", marginTop: "8px" }}>
              {selected.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </BaseDialog>
  );
}
