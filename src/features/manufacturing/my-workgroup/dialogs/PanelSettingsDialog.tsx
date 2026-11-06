import { useState } from "react";
import { BaseDialog, DialogFooter, Grid, HStack, Section } from "@/components/common";
import { ArrowDown20Regular, ArrowUp20Regular, Delete20Regular } from "@/components/icons";
import { Button, Checkbox, Text, makeStyles, mergeClasses } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { theme } from "@/styles/theme";

const useDialogStyles = makeStyles({
  list: {
    border: `1px solid ${theme.color.borderSubtle}`,
    borderRadius: theme.radius.md,
    overflow: "hidden",
  },
  headerRow: {
    padding: "10px 12px",
    backgroundColor: theme.color.surfaceSecondary,
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
    fontSize: "12px",
    color: theme.color.textTertiary,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  row: {
    padding: "10px 12px",
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
    fontSize: "14px",
    cursor: "pointer",
  },
  rowSelected: { backgroundColor: theme.color.surfaceSelected },
  selectedRow: {
    padding: "10px 12px",
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
    fontSize: "14px",
  },
  dragHandle: {
    color: theme.color.textTertiary,
    cursor: "grab",
    letterSpacing: "2px",
    userSelect: "none",
  },
  comments: {
    marginTop: "16px",
    borderTop: `1px solid ${theme.color.borderSubtle}`,
    paddingTop: "12px",
  },
});

type Panel = "resources" | "steps";

const ALL_PANELS: Panel[] = ["resources", "steps"];

const DRAG_HANDLE = "⋮⋮";

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
      <Grid columns="1fr 220px" gap={16}>
        <div>
          <HStack align="center" justify="between" style={{ marginBottom: "8px" }}>
            <Text weight="semibold">
              {t("myWorkgroup.panelSettings.availableSections")} ({ALL_PANELS.length}){" "}
              <Text size={300} style={{ color: theme.color.textTertiary }}>
                / {t("myWorkgroup.panelSettings.itemsSelected", { count: selected.length })}
              </Text>
            </Text>
          </HStack>
          <div className={styles.list} role="listbox" aria-multiselectable>
            <HStack align="center" gap={10} className={styles.headerRow}>
              <Checkbox
                checked={selected.length === ALL_PANELS.length}
                onChange={() =>
                  setSelected(selected.length === ALL_PANELS.length ? [] : [...ALL_PANELS])
                }
                aria-label={t("myWorkgroup.panelSettings.sections")}
              />
              <span>{t("myWorkgroup.panelSettings.sections")}</span>
            </HStack>
            {ALL_PANELS.map((panel) => (
              <HStack
                key={panel}
                align="center"
                gap={10}
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
              </HStack>
            ))}
          </div>
        </div>
        <div>
          <HStack align="center" justify="between" style={{ marginBottom: "8px" }}>
            <Text weight="semibold">
              {t("myWorkgroup.panelSettings.selectedSections")} ({selected.length})
            </Text>
            <HStack align="center" gap={2}>
              <Button
                variant="subtle"
                icon={<Delete20Regular />}
                aria-label={t("common.remove")}
                onClick={() => setSelected([])}
              />
              <Button
                variant="subtle"
                icon={<ArrowUp20Regular />}
                aria-label={t("common.moveUp")}
                onClick={() => move(selected.length - 1, -1)}
              />
              <Button
                variant="subtle"
                icon={<ArrowDown20Regular />}
                aria-label={t("common.moveDown")}
                onClick={() => move(0, 1)}
              />
            </HStack>
          </HStack>
          <div className={styles.list}>
            {selected.map((panel) => (
              <HStack key={panel} align="center" gap={8} className={styles.selectedRow}>
                <span className={styles.dragHandle} aria-hidden>
                  {DRAG_HANDLE}
                </span>
                <span style={{ flexGrow: 1 }}>{panelLabel(panel)}</span>
                <Button
                  variant="subtle"
                  icon={<Delete20Regular />}
                  aria-label={t("common.remove")}
                  onClick={() => remove(panel)}
                />
              </HStack>
            ))}
            {selected.length === 0 && (
              <HStack align="center" gap={8} className={styles.selectedRow}>
                <Text size={300} style={{ color: theme.color.textTertiary }}>
                  {EMPTY_DASH}
                </Text>
              </HStack>
            )}
          </div>
        </div>
      </Grid>
      <Section
        title={`${t("myWorkgroup.panelSettings.comments")}:`}
        collapsible
        expanded={commentsOpen}
        onExpandedChange={setCommentsOpen}
      >
        <Text size={300} style={{ color: theme.color.textTertiary }}>
          {EMPTY_DASH}
        </Text>
      </Section>
    </BaseDialog>
  );
}
