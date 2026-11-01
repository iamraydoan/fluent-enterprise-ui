import { useState } from "react";
import { BaseDialog, DialogEntityBanner, DialogFooter, HStack, VStack } from "@/components/common";
import { Body1Strong, Button, Field, Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { theme } from "@/styles/theme";

interface ManageRepairActionsDialogProps {
  open: boolean;
  onClose: () => void;
  reasonName: string;
  reasonType: string;
}

interface RepairAction {
  name: string;
  description: string;
  partReplacementMode: string;
}

const MODES = ["Allowed", "Not Allowed", "Required"];

const INITIAL: RepairAction[] = [
  { name: "Please reinstall the component", description: "", partReplacementMode: "Not Allowed" },
  {
    name: "Replace the component",
    description: "Replace the component action",
    partReplacementMode: "Allowed",
  },
];

export function ManageRepairActionsDialog({
  open,
  onClose,
  reasonName,
  reasonType,
}: ManageRepairActionsDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.reason.dialogs.repairActions";
  const [actions, setActions] = useState<RepairAction[]>(INITIAL);
  const [selected, setSelected] = useState(1);
  const [actionName, setActionName] = useState(INITIAL[1].name);
  const [actionDescription, setActionDescription] = useState(INITIAL[1].description);
  const [actionMode, setActionMode] = useState(INITIAL[1].partReplacementMode);
  const [comments, setComments] = useState("");

  const addAction = () => {
    const next = [
      ...actions,
      { name: `New Action ${actions.length + 1}`, description: "", partReplacementMode: "Allowed" },
    ];
    setActions(next);
    setSelected(next.length - 1);
    setActionName(next[next.length - 1].name);
    setActionDescription("");
    setActionMode("Allowed");
  };

  const removeAction = (index: number) => {
    const next = actions.filter((_, i) => i !== index);
    setActions(next);
    setSelected(0);
    if (next[0]) {
      setActionName(next[0].name);
      setActionDescription(next[0].description);
      setActionMode(next[0].partReplacementMode);
    }
  };

  const selectAction = (index: number) => {
    setSelected(index);
    setActionName(actions[index].name);
    setActionDescription(actions[index].description);
    setActionMode(actions[index].partReplacementMode);
  };

  return (
    <BaseDialog
      open={open}
      title={t(`${k}.title`)}
      onClose={onClose}
      width="min(1100px, 92vw)"
      footer={
        <DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(`${k}.update`)} />
      }
    >
      <DialogEntityBanner icon="🚩" name={`${reasonType} / ${reasonName}`} />
      <HStack gap={16}>
        <div style={{ width: 320, flexShrink: 0 }}>
          <HStack align="center" justify="space-between" style={{ marginBottom: 8 }}>
            <Body1Strong>{t(`${k}.repairActions`, { count: actions.length })}</Body1Strong>
            <HStack gap={theme.spacing.xs}>
              <Button size="sm" variant="subtle" onClick={addAction}>
                +
              </Button>
              <Button size="sm" variant="subtle" onClick={() => removeAction(selected)}>
                🗑
              </Button>
            </HStack>
          </HStack>
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: 4,
              minHeight: 300,
              overflow: "auto",
            }}
          >
            {actions.map((a, i) => (
              <div
                key={`${a.name}-${i}`}
                onClick={() => selectAction(i)}
                style={{
                  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                  cursor: "pointer",
                  backgroundColor: i === selected ? theme.color.brandSubtle : "transparent",
                  borderBottom: "1px solid #eee",
                }}
              >
                <div style={{ fontWeight: 600 }}>{a.name}</div>
                <div style={{ fontSize: 12, color: theme.color.textSecondary }}>
                  {a.partReplacementMode}
                </div>
              </div>
            ))}
          </div>
        </div>
        <VStack gap={12}>
          <Body1Strong>{t(`${k}.detailsTitle`)}</Body1Strong>
          <Field label={t(`${k}.repairAction`)} required>
            <Input value={actionName} onChange={setActionName} />
          </Field>
          <Field label={t(`${k}.description`)}>
            <Input value={actionDescription} onChange={setActionDescription} />
          </Field>
          <Field label={t(`${k}.partReplacementMode`)} required>
            <select value={actionMode} onChange={(e) => setActionMode(e.target.value)}>
              {MODES.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
        </VStack>
      </HStack>
      <Field label={t(`${k}.comments`)}>
        <Input value={comments} onChange={setComments} />
      </Field>
    </BaseDialog>
  );
}
