import { useState } from "react";
import { BaseDialog, DialogFooter, HStack, VStack } from "@/components/common";
import { Body1Strong, Button, Field, Input } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { theme } from "@/styles/theme";

interface CloneQualificationDialogProps {
  open: boolean;
  onClose: () => void;
  sourceName: string;
  sourceType: string;
  sourceOwnerRole: string;
}

export function CloneQualificationDialog({
  open,
  onClose,
  sourceName,
  sourceType,
  sourceOwnerRole,
}: CloneQualificationDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.qualification.dialogs.clone";
  const [clones, setClones] = useState<string[]>(["Clone 1"]);
  const [selected, setSelected] = useState(0);
  const [cloneName, setCloneName] = useState("Clone 1");
  const [cloneType, setCloneType] = useState(sourceType);
  const [cloneDescription, setCloneDescription] = useState("");
  const [cloneOwnerRole, setCloneOwnerRole] = useState(sourceOwnerRole);
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
          <HStack align="center" justify="space-between" style={{ marginBottom: 8 }}>
            <Body1Strong>{t(`${k}.clones`, { count: clones.length })}</Body1Strong>
            <HStack gap={theme.spacing.xs}>
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
        <VStack gap={12}>
          <Field label={t(`${k}.name`)}>
            <Input value={cloneName} onChange={setCloneName} />
          </Field>
          <Field label={t(`${k}.type`)}>
            <Input value={cloneType} onChange={setCloneType} />
          </Field>
          <Field label={t(`${k}.description`)}>
            <Input value={cloneDescription} onChange={setCloneDescription} />
          </Field>
          <Field label={t(`${k}.ownerRole`)}>
            <Input value={cloneOwnerRole} onChange={setCloneOwnerRole} />
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
