import { useState } from "react";
import { BaseDialog, DialogEntityBanner, DialogFooter, HStack, VStack } from "@/components/common";
import { Body1Strong, Button, Field, Input, Switch } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { theme } from "@/styles/theme";

interface ManageServiceResourcesDialogProps {
  open: boolean;
  onClose: () => void;
  serviceName: string;
}

interface ServiceResource {
  resource: string;
  enabled: boolean;
}

const INITIAL: ServiceResource[] = [{ resource: "Litho Tool 1", enabled: true }];

export function ManageServiceResourcesDialog({
  open,
  onClose,
  serviceName,
}: ManageServiceResourcesDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.service.dialogs.resources";
  const [rows, setRows] = useState<ServiceResource[]>(INITIAL);
  const [selected, setSelected] = useState(0);
  const [resource, setResource] = useState(INITIAL[0].resource);
  const [enabled, setEnabled] = useState(INITIAL[0].enabled);

  const addRow = () => {
    const next = [...rows, { resource: "", enabled: true }];
    setRows(next);
    setSelected(next.length - 1);
    setResource("");
    setEnabled(true);
  };

  const removeRow = (index: number) => {
    const next = rows.filter((_, i) => i !== index);
    setRows(next.length > 0 ? next : [{ resource: "", enabled: true }]);
    setSelected(0);
  };

  const selectRow = (index: number) => {
    setSelected(index);
    setResource(rows[index].resource);
    setEnabled(rows[index].enabled);
  };

  return (
    <BaseDialog
      open={open}
      title={t(`${k}.title`)}
      onClose={onClose}
      width="min(1000px, 90vw)"
      footer={
        <DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(`${k}.update`)} />
      }
    >
      <DialogEntityBanner icon="📊" name={serviceName} />
      <HStack gap={16}>
        <div style={{ width: 300, flexShrink: 0 }}>
          <HStack align="center" justify="between" style={{ marginBottom: theme.spacing.sm }}>
            <Body1Strong>{t(`${k}.resources`, { count: rows.length })}</Body1Strong>
            <HStack gap={theme.spacing.xs}>
              <Button size="sm" variant="subtle" onClick={addRow}>
                +
              </Button>
              <Button size="sm" variant="subtle" onClick={() => removeRow(selected)}>
                🗑
              </Button>
            </HStack>
          </HStack>
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: 4,
              minHeight: 280,
              overflow: "auto",
            }}
          >
            {rows.map((r, i) => (
              <div
                key={`${r.resource}-${i}`}
                onClick={() => selectRow(i)}
                style={{
                  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                  cursor: "pointer",
                  backgroundColor: i === selected ? theme.color.brandSubtle : "transparent",
                  borderBottom: "1px solid #eee",
                }}
              >
                <div style={{ fontWeight: 600 }}>{r.resource || t(`${k}.newResource`)}</div>
                <div style={{ fontSize: 12, color: theme.color.textSecondary }}>
                  {r.enabled ? t(`${k}.enabled`) : t(`${k}.disabled`)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <VStack grow gap={theme.spacing.md}>
          <Body1Strong>{t(`${k}.detailsTitle`)}</Body1Strong>
          <Field label={t(`${k}.resource`)}>
            <Input value={resource} onChange={setResource} />
          </Field>
          <Field label={t(`${k}.enabledInResource`)}>
            <Switch checked={enabled} onChange={setEnabled} />
          </Field>
        </VStack>
      </HStack>
    </BaseDialog>
  );
}
