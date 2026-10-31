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

const ACT0: TranslationKey = "businessData.resource.dialogs.setup.begin";
const ACT1: TranslationKey = "businessData.resource.dialogs.setup.cancel";
const ACT2: TranslationKey = "businessData.resource.dialogs.setup.complete";
const ACT3: TranslationKey = "businessData.resource.dialogs.setup.perform";
const ACT4: TranslationKey = "businessData.resource.dialogs.setup.reset";

interface SetupDialogProps {
  open: boolean;
  onClose: () => void;
  resourceName: string;
  titleKey: TranslationKey;
  actionKey: TranslationKey;
  isLine?: boolean;
}

function SetupDialogBase({
  open,
  onClose,
  resourceName,
  titleKey,
  actionKey,
  isLine,
}: SetupDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.resource.dialogs.setup";
  const [selected, setSelected] = useState<string[]>(isLine ? ["Sub-Resource-1"] : []);
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");

  const rows = isLine
    ? [
        { name: "Sub-Resource-1", setup: "Oven Setup A" },
        { name: "Sub-Resource-2", setup: "Oven Setup B" },
      ]
    : [{ name: "Material-001", setup: "Oven Setup A" }];

  const toggle = (name: string) => {
    setSelected((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface style={{ maxWidth: 1000, width: "92vw" }}>
        <DialogBody>
          <DialogTitle>{t(titleKey)}</DialogTitle>
          <DialogContent>
            <div style={{ marginBottom: 12, color: "#0078d4" }}>🔧 {resourceName}</div>
            <Body1Strong>{t(isLine ? `${k}.subResources` : `${k}.materials`)}</Body1Strong>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell />
                  <TableHeaderCell>{t(`${k}.name`)}</TableHeaderCell>
                  <TableHeaderCell>{t(`${k}.setup`)}</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.name}>
                    <TableCell>
                      <Checkbox
                        checked={selected.includes(r.name)}
                        onChange={() => toggle(r.name)}
                      />
                    </TableCell>
                    <TableCell>{r.name}</TableCell>
                    <TableCell>{r.setup}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Field label={t(`${k}.reason`)}>
              <Input value={reason} onChange={(_, d) => setReason(d.value)} />
            </Field>
            <Field label={t(`${k}.comment`)}>
              <Input value={comment} onChange={(_, d) => setComment(d.value)} />
            </Field>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button appearance="primary" onClick={onClose} disabled={selected.length === 0}>
              {t(actionKey)}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

export function BeginSetupDialog(p: Omit<SetupDialogProps, "titleKey" | "actionKey">) {
  return (
    <SetupDialogBase
      {...p}
      titleKey="businessData.resource.dialogs.setup.beginTitle"
      actionKey={ACT0}
    />
  );
}
export function PerformSetupDialog(p: Omit<SetupDialogProps, "titleKey" | "actionKey">) {
  return (
    <SetupDialogBase
      {...p}
      titleKey="businessData.resource.dialogs.setup.performTitle"
      actionKey={ACT3}
    />
  );
}
export function CompleteSetupDialog(p: Omit<SetupDialogProps, "titleKey" | "actionKey">) {
  return (
    <SetupDialogBase
      {...p}
      titleKey="businessData.resource.dialogs.setup.completeTitle"
      actionKey={ACT2}
    />
  );
}
export function CancelSetupDialog(p: Omit<SetupDialogProps, "titleKey" | "actionKey">) {
  return (
    <SetupDialogBase
      {...p}
      titleKey="businessData.resource.dialogs.setup.cancelTitle"
      actionKey={ACT1}
    />
  );
}
export function ResetSetupDialog(p: Omit<SetupDialogProps, "titleKey" | "actionKey">) {
  return (
    <SetupDialogBase
      {...p}
      titleKey="businessData.resource.dialogs.setup.resetTitle"
      actionKey={ACT4}
    />
  );
}
export function BeginLineSetupDialog(p: Omit<SetupDialogProps, "titleKey" | "actionKey">) {
  return (
    <SetupDialogBase
      {...p}
      isLine
      titleKey="businessData.resource.dialogs.setup.beginLineTitle"
      actionKey={ACT0}
    />
  );
}
export function PerformLineSetupDialog(p: Omit<SetupDialogProps, "titleKey" | "actionKey">) {
  return (
    <SetupDialogBase
      {...p}
      isLine
      titleKey="businessData.resource.dialogs.setup.performLineTitle"
      actionKey={ACT3}
    />
  );
}
export function CompleteLineSetupDialog(p: Omit<SetupDialogProps, "titleKey" | "actionKey">) {
  return (
    <SetupDialogBase
      {...p}
      isLine
      titleKey="businessData.resource.dialogs.setup.completeLineTitle"
      actionKey={ACT2}
    />
  );
}
export function CancelLineSetupDialog(p: Omit<SetupDialogProps, "titleKey" | "actionKey">) {
  return (
    <SetupDialogBase
      {...p}
      isLine
      titleKey="businessData.resource.dialogs.setup.cancelLineTitle"
      actionKey={ACT1}
    />
  );
}
export function ResetLineSetupDialog(p: Omit<SetupDialogProps, "titleKey" | "actionKey">) {
  return (
    <SetupDialogBase
      {...p}
      isLine
      titleKey="businessData.resource.dialogs.setup.resetLineTitle"
      actionKey={ACT4}
    />
  );
}
export function BeginPreSetupDialog(p: Omit<SetupDialogProps, "titleKey" | "actionKey">) {
  return (
    <SetupDialogBase
      {...p}
      titleKey="businessData.resource.dialogs.setup.beginPreTitle"
      actionKey={ACT0}
    />
  );
}
export function PerformPreSetupDialog(p: Omit<SetupDialogProps, "titleKey" | "actionKey">) {
  return (
    <SetupDialogBase
      {...p}
      titleKey="businessData.resource.dialogs.setup.performPreTitle"
      actionKey={ACT3}
    />
  );
}

const VIEW_SETUP_ROWS: string[][] = [["Oven Setup A", "Ready", "Yes"]];
const VIEW_LINE_SETUP_ROWS: string[][] = [["Sub-Resource-1", "Oven Setup A", "No"]];

export function ViewSetupDialog({
  open,
  onClose,
  resourceName,
}: {
  open: boolean;
  onClose: () => void;
  resourceName: string;
}) {
  const { t } = useAppTranslation();
  const k = "businessData.resource.dialogs.setup";

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface style={{ maxWidth: 900, width: "90vw" }}>
        <DialogBody>
          <DialogTitle>{t(`${k}.viewTitle`)}</DialogTitle>
          <DialogContent>
            <div style={{ marginBottom: 12, color: "#0078d4" }}>🔧 {resourceName}</div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>{t(`${k}.setup`)}</TableHeaderCell>
                  <TableHeaderCell>{t(`${k}.state`)}</TableHeaderCell>
                  <TableHeaderCell>{t(`${k}.currentSetup`)}</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {VIEW_SETUP_ROWS.map((row, i) => (
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
            <Button appearance="secondary" onClick={onClose}>
              {t("common.close")}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

export function ViewLineSetupDialog({
  open,
  onClose,
  resourceName,
}: {
  open: boolean;
  onClose: () => void;
  resourceName: string;
}) {
  const { t } = useAppTranslation();
  const k = "businessData.resource.dialogs.setup";

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface style={{ maxWidth: 900, width: "90vw" }}>
        <DialogBody>
          <DialogTitle>{t(`${k}.viewLineTitle`)}</DialogTitle>
          <DialogContent>
            <div style={{ marginBottom: 12, color: "#0078d4" }}>🔧 {resourceName}</div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>{t(`${k}.subResource`)}</TableHeaderCell>
                  <TableHeaderCell>{t(`${k}.currentSetup`)}</TableHeaderCell>
                  <TableHeaderCell>{t(`${k}.inSetup`)}</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {VIEW_LINE_SETUP_ROWS.map((row, i) => (
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
            <Button appearance="secondary" onClick={onClose}>
              {t("common.close")}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
