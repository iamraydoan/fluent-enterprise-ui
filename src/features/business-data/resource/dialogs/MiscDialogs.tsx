import { useState } from "react";
import { BaseDialog, DialogEntityBanner, DialogFooter, HStack, VStack } from "@/components/common";
import {
  Body1Strong,
  Button,
  Checkbox,
  Field,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { theme } from "@/styles/theme";

interface MiscDialogProps {
  open: boolean;
  onClose: () => void;
  resourceName: string;
}

export function CloneResourceDialog({ open, onClose, resourceName }: MiscDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.resource.dialogs.clone";
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
              marginBottom: 8,
            }}
          >
            <Body1Strong>{t(`${k}.clones`, { count: clones.length })}</Body1Strong>
            <div style={{ display: "flex", columnGap: 4 }}>
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
        <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", rowGap: 12 }}>
          <Field label={t(`${k}.name`)}>
            <Input value={cloneName} onChange={setCloneName} />
          </Field>
          <div style={{ fontSize: 12, color: theme.color.textSecondary }}>
            {t(`${k}.source`, { name: resourceName })}
          </div>
        </div>
      </HStack>
      <Field label={t(`${k}.comments`)}>
        <Input value={comments} onChange={setComments} />
      </Field>
    </BaseDialog>
  );
}

export function SetResourceRecipeDialog({ open, onClose, resourceName }: MiscDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.resource.dialogs.setRecipe";
  const [recipe, setRecipe] = useState("");
  const [comment, setComment] = useState("");

  return (
    <BaseDialog
      open={open}
      title={t(`${k}.title`)}
      onClose={onClose}
      width="min(800px, 88vw)"
      footer={<DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(`${k}.set`)} />}
    >
      <DialogEntityBanner icon="🔧" name={resourceName} />
      <Field label={t(`${k}.recipe`)} required>
        <Input value={recipe} onChange={setRecipe} />
      </Field>
      <Field label={t(`${k}.comment`)}>
        <Input value={comment} onChange={setComment} />
      </Field>
    </BaseDialog>
  );
}

export function ResourceOEEConfigurationDialog({ open, onClose, resourceName }: MiscDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.resource.dialogs.oee";
  const [idealCycleTime, setIdealCycleTime] = useState("");
  const [oeeEnabled, setOeeEnabled] = useState(true);

  return (
    <BaseDialog
      open={open}
      title={t(`${k}.title`)}
      onClose={onClose}
      width="min(800px, 88vw)"
      footer={<DialogFooter onCancel={onClose} onConfirm={onClose} confirmLabel={t(`${k}.save`)} />}
    >
      <DialogEntityBanner icon="🔧" name={resourceName} />
      <VStack gap={12}>
        <Field label={t(`${k}.idealCycleTime`)}>
          <Input value={idealCycleTime} onChange={setIdealCycleTime} />
        </Field>
        <Field label={t(`${k}.oeeEnabled`)}>
          <Checkbox checked={oeeEnabled} onChange={setOeeEnabled} />
        </Field>
      </VStack>
    </BaseDialog>
  );
}

function ViewDialogBase({
  open,
  onClose,
  resourceName,
  titleKey,
  columns,
  rows,
}: MiscDialogProps & { titleKey: TranslationKey; columns: string[]; rows: string[][] }) {
  const { t } = useAppTranslation();

  return (
    <BaseDialog
      open={open}
      title={t(titleKey)}
      onClose={onClose}
      width="min(1000px, 92vw)"
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onClose}
          confirmLabel={t("common.close")}
          confirmVariant="secondary"
          hideCancel
        />
      }
    >
      <DialogEntityBanner icon="🔧" name={resourceName} />
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((c) => (
              <TableHeaderCell key={c}>{c}</TableHeaderCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i}>
              {row.map((cell, j) => (
                <TableCell key={j}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </BaseDialog>
  );
}

const DASHBOARD_ROWS: string[][] = [["OEE Dashboard", "Overall Equipment Efficiency"]];
const DOCUMENT_ROWS: string[][] = [["Oven Manual.pdf", "PDF"]];
const REPORT_ROWS: string[][] = [["Production Report", "Daily production summary"]];

export function ViewResourceDashboardsDialog(p: MiscDialogProps) {
  const { t } = useAppTranslation();
  return (
    <ViewDialogBase
      {...p}
      titleKey="businessData.resource.dialogs.view.dashboardsTitle"
      columns={[
        t("businessData.resource.dialogs.view.dashboard"),
        t("businessData.resource.dialogs.view.description"),
      ]}
      rows={DASHBOARD_ROWS}
    />
  );
}

export function ViewResourceDocumentsDialog(p: MiscDialogProps) {
  const { t } = useAppTranslation();
  return (
    <ViewDialogBase
      {...p}
      titleKey="businessData.resource.dialogs.view.documentsTitle"
      columns={[
        t("businessData.resource.dialogs.view.document"),
        t("businessData.resource.dialogs.view.type"),
      ]}
      rows={DOCUMENT_ROWS}
    />
  );
}

export function ViewResourceReportsDialog(p: MiscDialogProps) {
  const { t } = useAppTranslation();
  return (
    <ViewDialogBase
      {...p}
      titleKey="businessData.resource.dialogs.view.reportsTitle"
      columns={[
        t("businessData.resource.dialogs.view.report"),
        t("businessData.resource.dialogs.view.description"),
      ]}
      rows={REPORT_ROWS}
    />
  );
}
