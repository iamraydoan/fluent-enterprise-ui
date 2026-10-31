import { useState } from "react";
import {
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

interface ManageRecipeBodyDialogProps {
  open: boolean;
  onClose: () => void;
  recipeName: string;
}

const SOURCES = ["DownloadedFromEquipment", "EquipmentSupplier", "HumanEdited", "None"];
const FORMATS = ["Text", "Binary", "URL"];

export function ManageRecipeBodyDialog({ open, onClose, recipeName }: ManageRecipeBodyDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.recipe.dialogs.body";
  const [source, setSource] = useState("HumanEdited");
  const [format, setFormat] = useState("Text");
  const [fileName, setFileName] = useState("");
  const [body, setBody] = useState("temperature=160\nduration=8\nallergens=gluten");
  const [comments, setComments] = useState("");

  const size = new Blob([body]).size;
  const isNone = source === "None";

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface style={{ maxWidth: 1100, width: "92vw" }}>
        <DialogBody>
          <DialogTitle>{t(`${k}.title`)}</DialogTitle>
          <DialogContent>
            <div style={{ marginBottom: 12, color: "#0078d4" }}>🎛 {recipeName}</div>
            <div style={{ display: "flex", flexDirection: "column", rowGap: 12 }}>
              <Field label={t(`${k}.source`)}>
                <select value={source} onChange={(e) => setSource(e.target.value)}>
                  {SOURCES.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t(`${k}.format`)} required={!isNone}>
                <select value={format} onChange={(e) => setFormat(e.target.value)}>
                  {FORMATS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t(`${k}.fileName`)} required={!isNone}>
                <div style={{ display: "flex", columnGap: 8 }}>
                  <Input value={fileName} onChange={(_, d) => setFileName(d.value)} />
                  <Button appearance="secondary" onClick={() => {}}>
                    {t(`${k}.uploadBody`)}
                  </Button>
                </div>
              </Field>
              <Field label={t(`${k}.body`)} required={!isNone}>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={6}
                  style={{ width: "100%", fontFamily: "monospace", fontSize: 13 }}
                />
              </Field>
              <div style={{ fontSize: 12, color: "#666" }}>
                {t(`${k}.size`)}: {size} B
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
