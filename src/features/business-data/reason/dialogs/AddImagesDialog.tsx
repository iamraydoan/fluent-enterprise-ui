import { useState } from "react";
import { BaseDialog } from "@/components/common";
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

interface AddImagesDialogProps {
  open: boolean;
  onClose: () => void;
  reasonName: string;
}

const IMAGES = [
  { name: "Crack_01.jpg", scope: "Loss" },
  { name: "Scratch_02.jpg", scope: "Loss" },
  { name: "Dent_03.jpg", scope: "Loss" },
];

const ASSESSMENTS = ["Conditional", "Fail", "Pass", "Unspecified"];

export function AddImagesDialog({ open, onClose, reasonName }: AddImagesDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.reason.dialogs.addImages";
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<string[]>(["Crack_01.jpg"]);
  const [assessments, setAssessments] = useState<Record<string, string>>({
    "Crack_01.jpg": "Fail",
  });
  const [criteria, setCriteria] = useState<Record<string, string>>({});
  const [comments, setComments] = useState("");

  const toggle = (name: string) => {
    setSelected((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
  };

  const selectedImages = IMAGES.filter((i) => selected.includes(i.name));

  return (
    <BaseDialog
      open={open}
      title={t(`${k}.title`)}
      onClose={onClose}
      width="min(1100px, 92vw)"
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          {step === 2 && (
            <Button appearance="secondary" onClick={() => setStep(1)}>
              {t("common.back")}
            </Button>
          )}
          {step === 1 ? (
            <Button
              appearance="primary"
              onClick={() => setStep(2)}
              disabled={selected.length === 0}
            >
              {t("common.next")}
            </Button>
          ) : (
            <Button appearance="primary" onClick={onClose}>
              {t(`${k}.add`)}
            </Button>
          )}
        </>
      }
    >
      <div style={{ display: "flex", alignItems: "center", columnGap: 8, marginBottom: 12 }}>
        <span
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            backgroundColor: step === 1 ? "#0078d4" : "#ccc",
            color: "#fff",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
          }}
        >
          1
        </span>
        <Body1Strong>{t(`${k}.stepImages`)}</Body1Strong>
        <span style={{ width: 40, height: 1, backgroundColor: "#ccc" }} />
        <span
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            backgroundColor: step === 2 ? "#0078d4" : "#ccc",
            color: "#fff",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
          }}
        >
          2
        </span>
        <Body1Strong>{t(`${k}.stepAssessment`)}</Body1Strong>
      </div>
      <div style={{ marginBottom: 12, color: "#0078d4" }}>🚩 {reasonName}</div>

      {step === 1 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell />
              <TableHeaderCell>{t(`${k}.image`)}</TableHeaderCell>
              <TableHeaderCell>{t(`${k}.scope`)}</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {IMAGES.map((img) => (
              <TableRow key={img.name}>
                <TableCell>
                  <Checkbox
                    checked={selected.includes(img.name)}
                    onChange={() => toggle(img.name)}
                  />
                </TableCell>
                <TableCell>{img.name}</TableCell>
                <TableCell>{img.scope}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", rowGap: 16 }}>
          {selectedImages.map((img) => (
            <div key={img.name} style={{ border: "1px solid #ddd", borderRadius: 4, padding: 12 }}>
              <Body1Strong>{img.name}</Body1Strong>
              <div style={{ display: "flex", columnGap: 12, marginTop: 8 }}>
                <Field label={t(`${k}.assessment`)}>
                  <select
                    value={assessments[img.name] ?? "Unspecified"}
                    onChange={(e) => setAssessments({ ...assessments, [img.name]: e.target.value })}
                  >
                    {ASSESSMENTS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={t(`${k}.assessmentCriteria`)}>
                  <Input
                    value={criteria[img.name] ?? ""}
                    onChange={(_, d) => setCriteria({ ...criteria, [img.name]: d.value })}
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>
      )}

      <Field label={t(`${k}.comments`)}>
        <Input value={comments} onChange={(_, d) => setComments(d.value)} />
      </Field>
    </BaseDialog>
  );
}
