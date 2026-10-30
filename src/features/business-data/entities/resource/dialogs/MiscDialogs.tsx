import { useState } from "react";
import {
  Body1Strong,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
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
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface style={{ maxWidth: 1000, width: "92vw" }}>
        <DialogBody>
          <DialogTitle>{t(`${k}.title`)}</DialogTitle>
          <DialogContent>
            <div style={{ display: "flex", columnGap: 16 }}>
              <div style={{ width: 280, flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Body1Strong>{t(`${k}.clones`, { count: clones.length })}</Body1Strong>
                  <div style={{ display: "flex", columnGap: 4 }}>
                    <Button size="small" appearance="subtle" onClick={addClone}>+</Button>
                    <Button size="small" appearance="subtle" onClick={() => removeClone(selected)}>🗑</Button>
                  </div>
                </div>
                <div style={{ border: "1px solid #ddd", borderRadius: 4, minHeight: 240, overflow: "auto" }}>
                  {clones.map((name, i) => (
                    <div
                      key={`${name}-${i}`}
                      onClick={() => selectClone(i)}
                      style={{
                        padding: "8px 12px", cursor: "pointer",
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
                <div style={{ fontSize: 12, color: "#666" }}>{t(`${k}.source`, { name: resourceName })}</div>
              </div>
            </div>
            <Field label={t(`${k}.comments`)}>
              <Input value={comments} onChange={(_, d) => setComments(d.value)} />
            </Field>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>{t("common.cancel")}</Button>
            <Button appearance="primary" onClick={onClose}>{t(`${k}.clone`)}</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

export function SetResourceRecipeDialog({ open, onClose, resourceName }: MiscDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.resource.dialogs.setRecipe";
  const [recipe, setRecipe] = useState("");
  const [comment, setComment] = useState("");

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface style={{ maxWidth: 800, width: "88vw" }}>
        <DialogBody>
          <DialogTitle>{t(`${k}.title`)}</DialogTitle>
          <DialogContent>
            <div style={{ marginBottom: 12, color: "#0078d4" }}>🔧 {resourceName}</div>
            <Field label={t(`${k}.recipe`)} required>
              <Input value={recipe} onChange={(_, d) => setRecipe(d.value)} />
            </Field>
            <Field label={t(`${k}.comment`)}>
              <Input value={comment} onChange={(_, d) => setComment(d.value)} />
            </Field>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>{t("common.cancel")}</Button>
            <Button appearance="primary" onClick={onClose}>{t(`${k}.set`)}</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

export function ResourceOEEConfigurationDialog({ open, onClose, resourceName }: MiscDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.resource.dialogs.oee";
  const [idealCycleTime, setIdealCycleTime] = useState("");
  const [oeeEnabled, setOeeEnabled] = useState(true);

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface style={{ maxWidth: 800, width: "88vw" }}>
        <DialogBody>
          <DialogTitle>{t(`${k}.title`)}</DialogTitle>
          <DialogContent>
            <div style={{ marginBottom: 12, color: "#0078d4" }}>🔧 {resourceName}</div>
            <div style={{ display: "flex", flexDirection: "column", rowGap: 12 }}>
              <Field label={t(`${k}.idealCycleTime`)}>
                <Input value={idealCycleTime} onChange={(_, d) => setIdealCycleTime(d.value)} />
              </Field>
              <Field label={t(`${k}.oeeEnabled`)}>
                <Checkbox checked={oeeEnabled} onChange={(_, d) => setOeeEnabled(d.checked === true)} />
              </Field>
            </div>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>{t("common.cancel")}</Button>
            <Button appearance="primary" onClick={onClose}>{t(`${k}.save`)}</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
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
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface style={{ maxWidth: 1000, width: "92vw" }}>
        <DialogBody>
          <DialogTitle>{t(titleKey)}</DialogTitle>
          <DialogContent>
            <div style={{ marginBottom: 12, color: "#0078d4" }}>🔧 {resourceName}</div>
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
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>{t("common.close")}</Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
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
      columns={[t("businessData.resource.dialogs.view.dashboard"), t("businessData.resource.dialogs.view.description")]}
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
      columns={[t("businessData.resource.dialogs.view.document"), t("businessData.resource.dialogs.view.type")]}
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
      columns={[t("businessData.resource.dialogs.view.report"), t("businessData.resource.dialogs.view.description")]}
      rows={REPORT_ROWS}
    />
  );
}
