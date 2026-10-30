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

interface AssignEmployeesDialogProps {
  open: boolean;
  onClose: () => void;
  qualificationName: string;
}

interface EmployeeRow {
  name: string;
  number: string;
  type: string;
  team: string;
  manager: string;
}

const EMPLOYEES: EmployeeRow[] = [
  { name: "Matthew Krazovitz", number: "10225", type: "General", team: "Team A", manager: "Administrator" },
  { name: "John Doe", number: "10226", type: "General", team: "Team A", manager: "Administrator" },
  { name: "Jane Smith", number: "10227", type: "General", team: "Team B", manager: "Supervisor" },
  { name: "Bob Wilson", number: "10228", type: "General", team: "Team B", manager: "Supervisor" },
  { name: "Alice Brown", number: "10229", type: "General", team: "Team C", manager: "Manager" },
];

const PROFICIENCY_OPTIONS = ["Beginner", "Intermediate", "Advanced", "Expert"];
const REASON_OPTIONS = ["Training", "Experience", "Education", "Other"];

export function AssignEmployeesDialog({
  open,
  onClose,
  qualificationName,
}: AssignEmployeesDialogProps) {
  const { t } = useAppTranslation();
  const k = "businessData.qualification.dialogs.assign";
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<string[]>(["10225"]);
  const [search, setSearch] = useState("");
  const [qualificationDate, setQualificationDate] = useState("09/30/2026 03:31 PM");
  const [validTo, setValidTo] = useState("10/30/2026 03:31 PM");
  const [reason, setReason] = useState("Training");
  const [proficiency, setProficiency] = useState("Intermediate");
  const [remarks, setRemarks] = useState("Volunteered to take the training course");
  const [evidence, setEvidence] = useState("");
  const [comments, setComments] = useState("");

  const toggle = (number: string) => {
    setSelected((prev) =>
      prev.includes(number) ? prev.filter((n) => n !== number) : [...prev, number],
    );
  };

  const filtered = EMPLOYEES.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.number.includes(search),
  );
  const selectedEmployees = EMPLOYEES.filter((e) => selected.includes(e.number));

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface style={{ maxWidth: 1200, width: "94vw" }}>
        <DialogBody>
          <DialogTitle>{t(`${k}.title`)}</DialogTitle>
          <DialogContent>
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
              <Body1Strong>{t(`${k}.stepEmployees`)}</Body1Strong>
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
              <Body1Strong>{t(`${k}.stepQualification`)}</Body1Strong>
            </div>

            <div style={{ marginBottom: 12, color: "#0078d4" }}>🏆 {qualificationName}</div>

            {step === 1 && (
              <div style={{ display: "flex", columnGap: 16 }}>
                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: "flex", columnGap: 12, marginBottom: 12 }}>
                    <Field label={t(`${k}.search`)}>
                      <Input value={search} onChange={(_, d) => setSearch(d.value)} />
                    </Field>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    {t(`${k}.employeesCount`, { count: filtered.length })} /{" "}
                    {t(`${k}.selectedCount`, { count: selected.length })}
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHeaderCell />
                        <TableHeaderCell>{t(`${k}.employee`)}</TableHeaderCell>
                        <TableHeaderCell>{t(`${k}.employeeNumber`)}</TableHeaderCell>
                        <TableHeaderCell>{t(`${k}.type`)}</TableHeaderCell>
                        <TableHeaderCell>{t(`${k}.team`)}</TableHeaderCell>
                        <TableHeaderCell>{t(`${k}.manager`)}</TableHeaderCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((e) => (
                        <TableRow key={e.number}>
                          <TableCell>
                            <Checkbox
                              checked={selected.includes(e.number)}
                              onChange={() => toggle(e.number)}
                            />
                          </TableCell>
                          <TableCell>{e.name}</TableCell>
                          <TableCell>{e.number}</TableCell>
                          <TableCell>{e.type}</TableCell>
                          <TableCell>{e.team}</TableCell>
                          <TableCell>{e.manager}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div style={{ width: 260, flexShrink: 0 }}>
                  <Body1Strong>
                    {t(`${k}.selectedEmployees`, { count: selected.length })}
                  </Body1Strong>
                  <div
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: 4,
                      minHeight: 300,
                      marginTop: 8,
                      overflow: "auto",
                    }}
                  >
                    {selectedEmployees.map((e) => (
                      <div
                        key={e.number}
                        style={{ padding: "8px 12px", borderBottom: "1px solid #eee" }}
                      >
                        {e.name} ({e.number})
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div style={{ display: "flex", columnGap: 16 }}>
                <div style={{ width: 320, flexShrink: 0 }}>
                  <Body1Strong>{t(`${k}.employees`)}</Body1Strong>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHeaderCell>{t(`${k}.employees`)}</TableHeaderCell>
                        <TableHeaderCell>{t(`${k}.qualificationDate`)}</TableHeaderCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedEmployees.map((e) => (
                        <TableRow key={e.number}>
                          <TableCell>
                            {e.name} ({e.number})
                          </TableCell>
                          <TableCell>{qualificationDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", rowGap: 12 }}>
                  <Body1Strong>{t(`${k}.detailsTitle`)}</Body1Strong>
                  <Field label={t(`${k}.qualificationDate`)} required>
                    <Input
                      value={qualificationDate}
                      onChange={(_, d) => setQualificationDate(d.value)}
                    />
                  </Field>
                  <Field label={t(`${k}.validTo`)}>
                    <Input value={validTo} onChange={(_, d) => setValidTo(d.value)} />
                  </Field>
                  <Field label={t(`${k}.reason`)} required>
                    <select value={reason} onChange={(e) => setReason(e.target.value)}>
                      {REASON_OPTIONS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label={t(`${k}.proficiency`)} required>
                    <select value={proficiency} onChange={(e) => setProficiency(e.target.value)}>
                      {PROFICIENCY_OPTIONS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label={t(`${k}.remarks`)}>
                    <Input value={remarks} onChange={(_, d) => setRemarks(d.value)} />
                  </Field>
                  <Field label={t(`${k}.evidence`)}>
                    <Input
                      value={evidence}
                      
                      onChange={(_, d) => setEvidence(d.value)}
                    />
                  </Field>
                </div>
              </div>
            )}

            <Field label={t(`${k}.comments`)}>
              <Input value={comments} onChange={(_, d) => setComments(d.value)} />
            </Field>
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            {step === 2 && (
              <Button appearance="secondary" onClick={() => setStep(1)}>
                {t("common.back")}
              </Button>
            )}
            {step === 1 ? (
              <Button appearance="primary" onClick={() => setStep(2)} disabled={selected.length === 0}>
                {t("common.next")}
              </Button>
            ) : (
              <Button appearance="primary" onClick={onClose}>
                {t(`${k}.assign`)}
              </Button>
            )}
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
