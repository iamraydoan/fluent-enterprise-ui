import { useState } from "react";
import { BaseDialog, DialogFooter, HStack } from "@/components/common";
import { Body1Strong, Button, Field, Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { theme } from "@/styles/theme";

interface CloneSamplingPatternDialogProps {
  open: boolean;
  onClose: () => void;
  sourceName: string;
}

export function CloneSamplingPatternDialog({
  open,
  onClose,
  sourceName,
}: CloneSamplingPatternDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.samplingPattern.dialogs.clone";
  const [clones, setClones] = useState<string[]>(["Clone 1"]);
  const [selected, setSelected] = useState(0);
  const [cloneName, setCloneName] = useState("Clone 1");
  const [comments, setComments] = useState("");

  const addClone = () => {
    const next = `Clone ${clones.length + 1}`;
    setClones([...clones, next]);
    setSelected(clones.length);
    setCloneName(next);
  };

  const removeClone = (index: number) => {
    const next = clones.filter((_, i) => i !== index);
    setClones(next.length > 0 ? next : ["Clone 1"]);
    setSelected(0);
    setCloneName(next[0] ?? "Clone 1");
  };

  const selectClone = (index: number) => {
    setSelected(index);
    setCloneName(clones[index]);
  };

  return (
    <BaseDialog
      open={open}
      title={t(`${k}.title`)}
      onClose={onClose}
      width="min(1000px, 92vw)"
      footer={
        <DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(`${k}.clone`)} />
      }
    >
      <HStack gap={16}>
        <div style={{ width: 280, flexShrink: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: theme.spacing.sm,
            }}
          >
            <Body1Strong>{t(`${k}.clones`, { count: clones.length })}</Body1Strong>
            <div style={{ display: "flex", columnGap: theme.spacing.xs }}>
              <Button size="sm" variant="subtle" onClick={addClone}>
                +
              </Button>
              <Button size="sm" variant="subtle" onClick={() => removeClone(selected)}>
                🗑
              </Button>
            </div>
          </div>
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: 4,
              minHeight: 240,
              overflow: "auto",
            }}
          >
            {clones.map((name, i) => (
              <div
                key={`${name}-${i}`}
                onClick={() => selectClone(i)}
                style={{
                  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                  cursor: "pointer",
                  backgroundColor: i === selected ? theme.color.brandSubtle : "transparent",
                  borderBottom: "1px solid #eee",
                }}
              >
                {name}
              </div>
            ))}
          </div>
        </div>
        <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", rowGap: theme.spacing.md }}>
          <Field label={t(`${k}.name`)}>
            <Input value={cloneName} onChange={setCloneName} />
          </Field>
          <div style={{ fontSize: 12, color: theme.color.textSecondary }}>
            {t(`${k}.source`, { name: sourceName })}
          </div>
        </div>
      </HStack>
      <Field label={t(`${k}.comments`)}>
        <Input value={comments} onChange={setComments} />
      </Field>
    </BaseDialog>
  );
}
