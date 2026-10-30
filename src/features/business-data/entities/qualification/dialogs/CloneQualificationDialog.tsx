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
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface style={{ maxWidth: 1000, width: "92vw" }}>
        <DialogBody>
          <DialogTitle>{t(`${k}.title`)}</DialogTitle>
          <DialogContent>
            <div style={{ display: "flex", columnGap: 16 }}>
              <div style={{ width: 280, flexShrink: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <Body1Strong>
                    {t(`${k}.clones`, { count: clones.length })}
                  </Body1Strong>
                  <div style={{ display: "flex", columnGap: 4 }}>
                    <Button size="small" appearance="subtle" onClick={addClone}>
                      +
                    </Button>
                    <Button
                      size="small"
                      appearance="subtle"
                      onClick={() => removeClone(selected)}
                    >
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
                  {clones.map((name, i) => (
                    <div
                      key={`${name}-${i}`}
                      onClick={() => selectClone(i)}
                      style={{
                        padding: "8px 12px",
                        cursor: "pointer",
                        backgroundColor: i === selected ? "#e3f2fd" : "transparent",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {name}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", rowGap: 12 }}>
                <Field label={t(`${k}.name`)}>
                  <Input value={cloneName} onChange={(_, d) => setCloneName(d.value)} />
                </Field>
                <Field label={t(`${k}.type`)}>
                  <Input value={cloneType} onChange={(_, d) => setCloneType(d.value)} />
                </Field>
                <Field label={t(`${k}.description`)}>
                  <Input
                    value={cloneDescription}
                    onChange={(_, d) => setCloneDescription(d.value)}
                  />
                </Field>
                <Field label={t(`${k}.ownerRole`)}>
                  <Input
                    value={cloneOwnerRole}
                    onChange={(_, d) => setCloneOwnerRole(d.value)}
                  />
                </Field>
                <div style={{ fontSize: 12, color: "#666" }}>
                  {t(`${k}.source`, { name: sourceName })}
                </div>
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
              {t(`${k}.clone`)}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
