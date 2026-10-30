import type { CertificationDetail, CertificationRecord } from "@/api";
import type { Page } from "@/api";

const RECORDS: CertificationRecord[] = [
  { name: "Cookie Baking", description: "Cookie Baking", type: "General", state: "Active" },
  { name: "Mixing Machine Operator", description: "Operator certification", type: "Technical", state: "Active" },
];

export function queryCertifications(page: number, limit: number, q?: string, state?: string): Page<CertificationRecord> {
  let rows = RECORDS;
  if (q) {
    const n = q.toLowerCase();
    rows = rows.filter((r) => r.name.toLowerCase().includes(n) || r.description.toLowerCase().includes(n));
  }
  if (state && state !== "" && state !== "all") rows = rows.filter((r) => r.state.toLowerCase() === state.toLowerCase());
  const total = rows.length;
  const start = (page - 1) * limit;
  return { data: rows.slice(start, start + limit), meta: { total, page, limit } };
}

export function buildCertificationDetail(name: string): CertificationDetail {
  const r = RECORDS.find((x) => x.name === name) ?? { name, description: name, type: "General", state: "Active" };
  return {
    ...r,
    universalState: r.state,
    dataGroup: "",
    validFor: "12 Months",
    allowOverride: false,
    ownerRole: "Administrators",
    sendNotificationOnChanges: false,
    sendNotificationWhenRequired: false,
    trainingMaximumDuration: "",
    traineeByDefault: false,
    allowManualGrants: true,
    allowSelfGranting: false,
    allowGrantingByManager: true,
    employees: [{ name: "John Doe", state: "Active", expirationDate: "2027-10-30" }],
    qualifications: [{ qualification: "Baking Basics", proficiency: "Level 3", required: true }],
  };
}
