import { useState } from "react";
import { BaseDialog, DialogEntityBanner, HStack, VStack, WizardSteps } from "@/components/common";
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
import { theme } from "@/styles/theme";

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
          <Button variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          {step === 2 && (
            <Button variant="secondary" onClick={() => setStep(1)}>
              {t("common.back")}
            </Button>
          )}
          {step === 1 ? (
            <Button
              variant="primary"
              onClick={() => setStep(2)}
              disabled={selected.length === 0}
            >
              {t("common.next")}
            </Button>
          ) : (
            <Button variant="primary" onClick={onClose}>
              {t(`${k}.add`)}
            </Button>
          )}
        </>
      }
    >
            <WizardSteps steps={[t(`${k}.stepImages`), t(`${k}.stepAssessment`)]} current={step} />
      <DialogEntityBanner icon="🚩" name={reasonName} />

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
        <VStack gap={16}>
          {selectedImages.map((img) => (
            <div key={img.name} style={{ border: "1px solid #ddd", borderRadius: 4, padding: theme.spacing.md }}>
              <Body1Strong>{img.name}</Body1Strong>
              <HStack gap={12} style={{marginTop: 8}}>
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
                    onChange={(value) => setCriteria({ ...criteria, [img.name]: value })}
                  />
                </Field>
              </HStack>
            </div>
          ))}
        </VStack>
      )}

      <Field label={t(`${k}.comments`)}>
        <Input value={comments} onChange={setComments} />
      </Field>
    </BaseDialog>
  );
}
