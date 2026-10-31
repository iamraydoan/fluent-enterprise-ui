import { useState } from "react";
import { BaseDialog, DialogFooter } from "@/components/common";
import { Checkbox, Text, makeStyles, mergeClasses, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

const useLayoutStyles = makeStyles({
  option: {
    display: "block",
    width: "100%",
    textAlign: "left",
    padding: "12px 16px",
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderBottom: "none",
    backgroundColor: tokens.colorNeutralBackground1,
    cursor: "pointer",
    fontSize: "13px",
    ":first-of-type": { borderTopLeftRadius: "8px", borderTopRightRadius: "8px" },
    ":last-of-type": {
      borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
      borderBottomLeftRadius: "8px",
      borderBottomRightRadius: "8px",
    },
  },
  optionSelected: {
    backgroundColor: tokens.colorNeutralBackground1Selected,
    fontWeight: tokens.fontWeightSemibold,
  },
  hint: { fontSize: "13px", color: tokens.colorNeutralForeground2, marginBottom: "12px" },
  sectionRow: {
    display: "flex",
    alignItems: "center",
    columnGap: "8px",
    padding: "8px 12px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: "16px" },
  colTitle: { fontWeight: tokens.fontWeightSemibold, fontSize: "13px", marginBottom: "8px" },
  colBox: {
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: "8px",
    maxHeight: "320px",
    overflow: "auto",
  },
});

export function SaveLayoutDialog({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (scope: "mine" | "all") => void;
}) {
  const { t } = useAppTranslation();
  const styles = useLayoutStyles();
  const [scope, setScope] = useState<"mine" | "all">("mine");
  return (
    <BaseDialog
      open={open}
      title={t("manufacturing.fabExplorer.dialogs.saveLayout.title")}
      onClose={onClose}
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={() => onConfirm(scope)}
          confirmLabel={t("manufacturing.fabExplorer.layout.save")}
        />
      }
    >
      <div className={styles.hint}>
        {t("manufacturing.fabExplorer.dialogs.saveLayout.selectOption")}
      </div>
      <button
        className={mergeClasses(styles.option, scope === "mine" && styles.optionSelected)}
        onClick={() => setScope("mine")}
      >
        {t("manufacturing.fabExplorer.dialogs.saveLayout.saveAsMyDefault")}
      </button>
      <button
        className={mergeClasses(styles.option, scope === "all" && styles.optionSelected)}
        onClick={() => setScope("all")}
      >
        {t("manufacturing.fabExplorer.dialogs.saveLayout.saveAsDefaultForAllUsers")}
      </button>
    </BaseDialog>
  );
}

export function ResetLayoutDialog({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (scope: "mine" | "allUsers" | "application") => void;
}) {
  const { t } = useAppTranslation();
  const styles = useLayoutStyles();
  const [scope, setScope] = useState<"mine" | "allUsers" | "application">("mine");
  const options: Array<{ value: "mine" | "allUsers" | "application"; labelKey: TranslationKey }> = [
    { value: "mine", labelKey: "manufacturing.fabExplorer.dialogs.resetLayout.resetToMyDefault" },
    {
      value: "allUsers",
      labelKey: "manufacturing.fabExplorer.dialogs.resetLayout.resetToAllUsersDefault",
    },
    {
      value: "application",
      labelKey: "manufacturing.fabExplorer.dialogs.resetLayout.resetToApplicationDefault",
    },
  ];
  return (
    <BaseDialog
      open={open}
      title={t("manufacturing.fabExplorer.dialogs.resetLayout.title")}
      onClose={onClose}
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={() => onConfirm(scope)}
          confirmLabel={t("manufacturing.fabExplorer.layout.reset")}
        />
      }
    >
      <div className={styles.hint}>
        {t("manufacturing.fabExplorer.dialogs.saveLayout.selectOption")}
      </div>
      {options.map((opt) => (
        <button
          key={opt.value}
          className={mergeClasses(styles.option, scope === opt.value && styles.optionSelected)}
          onClick={() => setScope(opt.value)}
        >
          {t(opt.labelKey)}
        </button>
      ))}
    </BaseDialog>
  );
}

export interface PanelSection {
  id: string;
  label: string;
  count?: string | number;
}

export function PanelSettingsDialog({
  open,
  sections,
  selected,
  onClose,
  onConfirm,
}: {
  open: boolean;
  sections: PanelSection[];
  selected: string[];
  onClose: () => void;
  onConfirm: (selected: string[]) => void;
}) {
  const { t } = useAppTranslation();
  const styles = useLayoutStyles();
  const [current, setCurrent] = useState<string[]>(selected);
  const toggle = (id: string) =>
    setCurrent((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  return (
    <BaseDialog
      open={open}
      title={t("manufacturing.fabExplorer.dialogs.panelSettings.title")}
      size="lg"
      onClose={onClose}
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={() => onConfirm(current)}
          confirmLabel={t("manufacturing.fabExplorer.dialogs.panelSettings.update")}
        />
      }
    >
      <div className={styles.twoCol}>
        <div>
          <div className={styles.colTitle}>
            {t("manufacturing.fabExplorer.dialogs.panelSettings.availableSections")} (
            {sections.length})
          </div>
          <div className={styles.colBox}>
            {sections.map((s) => (
              <div key={s.id} className={styles.sectionRow}>
                <Checkbox checked={current.includes(s.id)} onChange={() => toggle(s.id)} />
                <Text size={300}>
                  {s.label}
                  {s.count !== undefined ? ` (${s.count})` : ""}
                </Text>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className={styles.colTitle}>
            {t("manufacturing.fabExplorer.dialogs.panelSettings.selectedSections")} (
            {current.length})
          </div>
          <div className={styles.colBox}>
            {current.map((id) => {
              const s = sections.find((sec) => sec.id === id);
              return (
                <div key={id} className={styles.sectionRow}>
                  <Text size={300}>{s?.label ?? id}</Text>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </BaseDialog>
  );
}
