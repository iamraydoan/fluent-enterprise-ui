import { useState } from "react";
import {
  Body1Strong,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Field,
  Input,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";

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
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface style={{ maxWidth: 1100, width: "92vw" }}>
        <DialogBody>
          <DialogTitle>{t(`${k}.title`)}</DialogTitle>
          <DialogContent>
            <div style={{ marginBottom: 12, color: "#0078d4" }}>
              🚩 {reasonType} / {reasonName}
            </div>
            <div style={{ display: "flex", columnGap: 16 }}>
              <div style={{ width: 320, flexShrink: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <Body1Strong>{t(`${k}.repairActions`, { count: actions.length })}</Body1Strong>
                  <div style={{ display: "flex", columnGap: 4 }}>
                    <Button size="small" appearance="subtle" onClick={addAction}>
                      +
                    </Button>
                    <Button size="small" appearance="subtle" onClick={() => removeAction(selected)}>
                      🗑
                    </Button>
                  </div>
                </div>
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
                        padding: "8px 12px",
                        cursor: "pointer",
                        backgroundColor: i === selected ? "#e3f2fd" : "transparent",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>{a.name}</div>
                      <div style={{ fontSize: 12, color: "#666" }}>{a.partReplacementMode}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", rowGap: 12 }}>
                <Body1Strong>{t(`${k}.detailsTitle`)}</Body1Strong>
                <Field label={t(`${k}.repairAction`)} required>
                  <Input value={actionName} onChange={(_, d) => setActionName(d.value)} />
                </Field>
                <Field label={t(`${k}.description`)}>
                  <Input
                    value={actionDescription}
                    onChange={(_, d) => setActionDescription(d.value)}
                  />
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
              </div>
            </div>
            <Field label={t(`${k}.comments`)}>
              <Input value={comments} onChange={(_, d) => setComments(d.value)} />
            </Field>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button appearance="primary" onClick={onClose}>
              {t(`${k}.update`)}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
