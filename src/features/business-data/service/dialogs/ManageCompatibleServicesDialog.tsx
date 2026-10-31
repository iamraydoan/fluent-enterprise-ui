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

interface ManageCompatibleServicesDialogProps {
  open: boolean;
  onClose: () => void;
  serviceName: string;
}

interface CompatibleService {
  service: string;
  description: string;
}

const INITIAL_FULFILLED: CompatibleService[] = [
  { service: "Oven Bake", description: "Baking service" },
];

const INITIAL_FULFILL: CompatibleService[] = [
  { service: "Photolithography", description: "Lithography processing" },
];

export function ManageCompatibleServicesDialog({
  open,
  onClose,
  serviceName,
}: ManageCompatibleServicesDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.service.dialogs.compatible";
  const [fulfilled, setFulfilled] = useState<CompatibleService[]>(INITIAL_FULFILLED);
  const [fulfill, setFulfill] = useState<CompatibleService[]>(INITIAL_FULFILL);
  const [tab, setTab] = useState<"fulfilled" | "fulfill">("fulfilled");
  const showFulfilled = () => {
    setTab("fulfilled");
    setSelected(0);
    setValues({});
  };
  const showFulfill = () => {
    setTab("fulfill");
    setSelected(0);
    setValues({});
  };
  const [selected, setSelected] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});

  const rows = tab === "fulfilled" ? fulfilled : fulfill;
  const setRows = tab === "fulfilled" ? setFulfilled : setFulfill;

  const addRow = () => {
    const next = [...rows, { service: "", description: "" }];
    setRows(next);
    setSelected(next.length - 1);
    setValues({});
  };

  const removeRow = (index: number) => {
    const next = rows.filter((_, i) => i !== index);
    setRows(next.length > 0 ? next : [{ service: "", description: "" }]);
    setSelected(0);
    setValues({});
  };

  const selectRow = (index: number) => {
    setSelected(index);
    setValues({});
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface style={{ maxWidth: 1000, width: "90vw" }}>
        <DialogBody>
          <DialogTitle>{t(`${k}.title`)}</DialogTitle>
          <DialogContent>
            <div style={{ marginBottom: 12, color: "#0078d4" }}>📊 {serviceName}</div>
            <div style={{ display: "flex", columnGap: 12, marginBottom: 12 }}>
              <Button
                appearance={tab === "fulfilled" ? "primary" : "secondary"}
                onClick={showFulfilled}
              >
                {t(`${k}.canBeFulfilledBy`)}
              </Button>
              <Button
                appearance={tab === "fulfill" ? "primary" : "secondary"}
                onClick={showFulfill}
              >
                {t(`${k}.canFulfill`)}
              </Button>
            </div>
            <div style={{ display: "flex", columnGap: 16 }}>
              <div style={{ width: 300, flexShrink: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <Body1Strong>{t(`${k}.services`, { count: rows.length })}</Body1Strong>
                  <div style={{ display: "flex", columnGap: 4 }}>
                    <Button size="small" appearance="subtle" onClick={addRow}>
                      +
                    </Button>
                    <Button size="small" appearance="subtle" onClick={() => removeRow(selected)}>
                      🗑
                    </Button>
                  </div>
                </div>
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
                      key={`${r.service}-${i}`}
                      onClick={() => selectRow(i)}
                      style={{
                        padding: "8px 12px",
                        cursor: "pointer",
                        backgroundColor: i === selected ? "#e3f2fd" : "transparent",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>{r.service || t(`${k}.newService`)}</div>
                      <div style={{ fontSize: 12, color: "#666" }}>{r.description}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", rowGap: 12 }}>
                <Body1Strong>{t(`${k}.detailsTitle`)}</Body1Strong>
                <Field label={t(`${k}.service`)}>
                  <Input
                    value={values.service ?? rows[selected]?.service ?? ""}
                    onChange={(_, d) => setValues({ ...values, service: d.value })}
                  />
                </Field>
                <Field label={t(`${k}.description`)}>
                  <Input
                    value={values.description ?? rows[selected]?.description ?? ""}
                    onChange={(_, d) => setValues({ ...values, description: d.value })}
                  />
                </Field>
              </div>
            </div>
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
