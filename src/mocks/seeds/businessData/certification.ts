import type { CertificationDetail, CertificationRecord, Page } from "@/api";

const RECORDS: CertificationRecord[] = [
  { name: "Cookie Baking", description: "Cookie Baking", type: "General", state: "Active" },
  {
    name: "Mixing Machine Operator",
    description: "Operator certification",
    type: "Technical",
    state: "Active",
  },
];

export function queryCertifications(
  page: number,
  limit: number,
  q?: string,
  state?: string,
): Page<CertificationRecord> {
  let rows = RECORDS;
  if (q) {
    const n = q.toLowerCase();
    rows = rows.filter(
      (r) => r.name.toLowerCase().includes(n) || r.description.toLowerCase().includes(n),
    );
  }
  if (state && state !== "" && state !== "all")
    rows = rows.filter((r) => r.state.toLowerCase() === state.toLowerCase());
  const total = rows.length;
  const start = (page - 1) * limit;
  return { data: rows.slice(start, start + limit), meta: { total, page, limit } };
}

const CERTIFICATION_OVERLAYS: Record<string, Partial<CertificationDetail>> = {};

export interface CertificationUpsertInput extends Partial<CertificationDetail> {
  name: string;
}

export function buildCertificationDetail(name: string): CertificationDetail {
  const r = RECORDS.find((x) => x.name === name) ?? {
    name,
    description: name,
    type: "General",
    state: "Active",
  };
  const overlay = CERTIFICATION_OVERLAYS[r.name] ?? {};
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
    ...overlay,
  };
}

export function createCertificationDetail(input: CertificationUpsertInput): CertificationDetail {
  const record = {
    name: input.name,
    description: input.description ?? "",
    type: input.type ?? "General",
    state: "Active",
  };
  RECORDS.push(record);
  const overlay: Partial<CertificationDetail> = { ...input };
  delete overlay.name;
  delete overlay.description;
  delete overlay.type;
  delete overlay.state;
  CERTIFICATION_OVERLAYS[input.name] = overlay;
  return buildCertificationDetail(input.name);
}

export function updateCertificationDetail(
  name: string,
  input: Partial<CertificationDetail>,
): CertificationDetail | undefined {
  const record = RECORDS.find((x) => x.name === name);
  if (!record) return undefined;
  if (input.description !== undefined) record.description = input.description;
  if (input.type !== undefined) record.type = input.type;
  CERTIFICATION_OVERLAYS[name] = { ...CERTIFICATION_OVERLAYS[name], ...input };
  return buildCertificationDetail(name);
}
