import { useState } from "react";
import { BaseDialog, DialogFooter, HStack, VStack } from "@/components/common";
import { Body1Strong, Button, Field, Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { theme } from "@/styles/theme";

interface CloneQualificationCheckDialogProps {
  open: boolean;
  onClose: () => void;
  sourceName: string;
  sourceInstanceType: string;
}

export function CloneQualificationCheckDialog({
  open,
  onClose,
  sourceName,
  sourceInstanceType,
}: CloneQualificationCheckDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.qualificationCheck.dialogs.clone";
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
          <HStack align="center" justify="space-between" style={{marginBottom: 8}}>
            <Body1Strong>{t(`${k}.clones`, { count: clones.length })}</Body1Strong>
            <HStack gap={4}>
              <Button size="sm" variant="subtle" onClick={addClone}>
                +
              </Button>
              <Button size="sm" variant="subtle" onClick={() => removeClone(selected)}>
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
            {clones.map((name, i) => (
              <div
                key={`${name}-${i}`}
                onClick={() => selectClone(i)}
                style={{
                  padding: "8px 12px",
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
        <VStack gap={12}>
          <Field label={t(`${k}.name`)}>
            <Input value={cloneName} onChange={setCloneName} />
          </Field>
          <Field label={t(`${k}.instanceType`)}>
            <Input value={sourceInstanceType} readOnly onChange={() => {}} />
          </Field>
          <div style={{ fontSize: 12, color: theme.color.textSecondary }}>
            {t(`${k}.source`, { name: sourceName })}
          </div>
        </VStack>
      </HStack>
      <Field label={t(`${k}.comments`)}>
        <Input value={comments} onChange={setComments} />
      </Field>
    </BaseDialog>
  );
}
