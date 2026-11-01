import { useState } from "react";
import { BaseDialog, DialogFooter, OptionItem, Grid, HStack  } from "@/components/common";
import { Checkbox, Text, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { theme } from "@/styles/theme";

const useLayoutStyles = makeStyles({
  option: {
    display: "block",
    width: "100%",
    textAlign: "left",
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    border: `1px solid ${theme.color.border}`,
    borderBottom: "none",
    backgroundColor: theme.color.surface,
    cursor: "pointer",
    fontSize: "13px",
    ":first-of-type": { borderTopLeftRadius: "8px", borderTopRightRadius: "8px" },
    ":last-of-type": {
      borderBottom: `1px solid ${theme.color.border}`,
      borderBottomLeftRadius: "8px",
      borderBottomRightRadius: "8px",
    },
  },
  hint: { fontSize: "13px", color: theme.color.textSecondary, marginBottom: theme.spacing.md },
  sectionRow: {
    padding: "8px 12px",
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
  },
  
  colTitle: { fontWeight: theme.font.weightSemibold, fontSize: "13px", marginBottom: theme.spacing.sm },
  colBox: {
    border: `1px solid ${theme.color.border}`,
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
      <OptionItem
        title={t("manufacturing.fabExplorer.dialogs.saveLayout.saveAsMyDefault")}
        selected={scope === "mine"}
        onClick={() => setScope("mine")}
      />
      <OptionItem
        title={t("manufacturing.fabExplorer.dialogs.saveLayout.saveAsDefaultForAllUsers")}
        selected={scope === "all"}
        onClick={() => setScope("all")}
      />
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
        <OptionItem
          key={opt.value}
          title={t(opt.labelKey)}
          selected={scope === opt.value}
          onClick={() => setScope(opt.value)}
        />
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
      <Grid columns="1fr 1fr" gap="16px">
        <div>
          <div className={styles.colTitle}>
            {t("manufacturing.fabExplorer.dialogs.panelSettings.availableSections")} (
            {sections.length})
          </div>
          <div className={styles.colBox}>
            {sections.map((s) => (
              <HStack gap="8px" align="center" key={s.id} className={styles.sectionRow}>
                <Checkbox checked={current.includes(s.id)} onChange={() => toggle(s.id)} />
                <Text size={300}>
                  {s.label}
                  {s.count !== undefined ? ` (${s.count})` : ""}
                </Text>
              </HStack>
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
                <HStack gap="8px" align="center" key={id} className={styles.sectionRow}>
                  <Text size={300}>{s?.label ?? id}</Text>
                </HStack>
              );
            })}
          </div>
        </div>
      </Grid>
    </BaseDialog>
  );
}
