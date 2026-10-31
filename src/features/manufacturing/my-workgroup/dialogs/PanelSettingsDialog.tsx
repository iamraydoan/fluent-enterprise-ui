import { useState } from "react";
import { BaseDialog, DialogFooter } from "@/components/common";
import { ArrowDown20Regular, ArrowUp20Regular, Delete20Regular } from "@/components/icons";
import { Button, Checkbox, Text, makeStyles, mergeClasses, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";

const useDialogStyles = makeStyles({
  columns: { display: "grid", gridTemplateColumns: "1fr 220px", gap: "16px" },
  columnTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
  list: {
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    overflow: "hidden",
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    columnGap: "10px",
    padding: "10px 12px",
    backgroundColor: tokens.colorNeutralBackground2,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    fontSize: "12px",
    color: tokens.colorNeutralForeground3,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  row: {
    display: "flex",
    alignItems: "center",
    columnGap: "10px",
    padding: "10px 12px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    fontSize: "14px",
    cursor: "pointer",
  },
  rowSelected: { backgroundColor: tokens.colorNeutralBackground1Selected },
  selectedRow: {
    display: "flex",
    alignItems: "center",
    columnGap: "8px",
    padding: "10px 12px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    fontSize: "14px",
  },
  dragHandle: {
    color: tokens.colorNeutralForeground3,
    cursor: "grab",
    letterSpacing: "2px",
    userSelect: "none",
  },
  toolbar: { display: "flex", alignItems: "center", columnGap: "2px" },
  comments: {
    marginTop: "16px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    paddingTop: "12px",
  },
  commentsHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "14px",
    padding: "4px 0",
  },
});

type Panel = "resources" | "steps";

const ALL_PANELS: Panel[] = ["resources", "steps"];

const DRAG_HANDLE = "⋮⋮";

const EXPAND_ICON = "▾";
const COLLAPSE_ICON = "▴";
const EMPTY_DASH = "—";

interface PanelSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  visiblePanels: Panel[];
  onApply: (panels: Panel[]) => void;
}

export function PanelSettingsDialog({
  open,
  onClose,
  visiblePanels,
  onApply,
}: PanelSettingsDialogProps) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const [selected, setSelected] = useState<Panel[]>(visiblePanels);
  const [commentsOpen, setCommentsOpen] = useState(false);

  const toggle = (panel: Panel) => {
    setSelected((prev) =>
      prev.includes(panel) ? prev.filter((p) => p !== panel) : [...prev, panel],
    );
  };

  const move = (index: number, direction: -1 | 1) => {
    setSelected((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const remove = (panel: Panel) => {
    setSelected((prev) => prev.filter((p) => p !== panel));
  };

  const panelLabel = (panel: Panel) =>
    panel === "resources" ? t("myWorkgroup.resources") : t("myWorkgroup.steps");

  return (
    <BaseDialog
      open={open}
      title={t("myWorkgroup.panelSettings.title")}
      size="lg"
      onClose={onClose}
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={() => {
            onApply(selected);
            onClose();
          }}
          confirmLabel={t("myWorkgroup.panelSettings.update")}
        />
      }
    >
      <div className={styles.columns}>
        <div>
          <div className={styles.columnTitle}>
            <Text weight="semibold">
              {t("myWorkgroup.panelSettings.availableSections")} ({ALL_PANELS.length}){" "}
              <Text size={300} style={{ color: tokens.colorNeutralForeground3 }}>
                / {t("myWorkgroup.panelSettings.itemsSelected", { count: selected.length })}
              </Text>
            </Text>
          </div>
          <div className={styles.list} role="listbox" aria-multiselectable>
            <div className={styles.headerRow}>
              <Checkbox
                checked={selected.length === ALL_PANELS.length}
                onChange={() =>
                  setSelected(selected.length === ALL_PANELS.length ? [] : [...ALL_PANELS])
                }
                aria-label={t("myWorkgroup.panelSettings.sections")}
              />
              <span>{t("myWorkgroup.panelSettings.sections")}</span>
            </div>
            {ALL_PANELS.map((panel) => (
              <div
                key={panel}
                className={mergeClasses(styles.row, selected.includes(panel) && styles.rowSelected)}
                onClick={() => toggle(panel)}
                role="option"
                aria-selected={selected.includes(panel)}
              >
                <Checkbox
                  checked={selected.includes(panel)}
                  onChange={() => toggle(panel)}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={panelLabel(panel)}
                />
                <span>{panelLabel(panel)}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className={styles.columnTitle}>
            <Text weight="semibold">
              {t("myWorkgroup.panelSettings.selectedSections")} ({selected.length})
            </Text>
            <span className={styles.toolbar}>
              <Button
                appearance="subtle"
                icon={<Delete20Regular />}
                aria-label={t("common.remove")}
                onClick={() => setSelected([])}
              />
              <Button
                appearance="subtle"
                icon={<ArrowUp20Regular />}
                aria-label={t("common.moveUp")}
                onClick={() => move(selected.length - 1, -1)}
              />
              <Button
                appearance="subtle"
                icon={<ArrowDown20Regular />}
                aria-label={t("common.moveDown")}
                onClick={() => move(0, 1)}
              />
            </span>
          </div>
          <div className={styles.list}>
            {selected.map((panel) => (
              <div key={panel} className={styles.selectedRow}>
                <span className={styles.dragHandle} aria-hidden>
                  {DRAG_HANDLE}
                </span>
                <span style={{ flexGrow: 1 }}>{panelLabel(panel)}</span>
                <Button
                  appearance="subtle"
                  icon={<Delete20Regular />}
                  aria-label={t("common.remove")}
                  onClick={() => remove(panel)}
                />
              </div>
            ))}
            {selected.length === 0 && (
              <div className={styles.selectedRow}>
                <Text size={300} style={{ color: tokens.colorNeutralForeground3 }}>
                  {EMPTY_DASH}
                </Text>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.comments}>
        <button className={styles.commentsHeader} onClick={() => setCommentsOpen((v) => !v)}>
          <span>{t("myWorkgroup.panelSettings.comments")}:</span>
          <span>{commentsOpen ? COLLAPSE_ICON : EXPAND_ICON}</span>
        </button>
        {commentsOpen && (
          <Text size={300} style={{ color: tokens.colorNeutralForeground3 }}>
            {EMPTY_DASH}
          </Text>
        )}
      </div>
    </BaseDialog>
  );
}
