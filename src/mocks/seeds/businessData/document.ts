import type { DocumentDetail, DocumentRecord, Page } from "@/api";
import { RecordState } from "@/api";

const DOCUMENTS: DocumentRecord[] = [
  {
    name: "Industrial Waste Management",
    description: "",
    type: "Generic",
    author: "Administrator",
    creationDate: Date.UTC(2026, 8, 21, 15, 1),
    state: RecordState.Active,
  },
  {
    name: "Safety Procedure v3",
    description: "Safety procedures",
    type: "Generic",
    author: "Administrator",
    creationDate: Date.UTC(2026, 7, 10, 9, 30),
    state: RecordState.Active,
  },
  {
    name: "Old Specification",
    description: "Deprecated spec",
    type: "Generic",
    author: "admin",
    creationDate: Date.UTC(2025, 5, 1, 12, 0),
    state: RecordState.Terminated,
  },
];

const DETAILS: Record<string, DocumentDetail> = {
  "Industrial Waste Management": {
    name: "Industrial Waste Management",
    description: "",
    type: "Generic",
    author: "Administrator",
    creationDate: Date.UTC(2026, 8, 21, 15, 1),
    state: RecordState.Active,
    dataGroup: "",
    source: "Internal",
    file: "Industrial_Waste_Management.pdf",
    changeDescription: "",
    requireSignature: true,
    expirationDays: "",
    folder: "\\Documents",
    ownerRole: "",
    group: "",
    link: "https://dev-120-mes.apps.rhos.cm-mes.dev/Entity/Document/Industrial Waste Management",
    versionLink:
      "https://dev-120-mes.apps.rhos.cm-mes.dev/Entity/Document/Industrial Waste Management | v.1",
    keywords: "",
    distributionNewVersion: "",
    distributionNewEffectiveVersion: "",
    tracking: [{ employee: "Administrator", readAndUnderstoodDate: Date.UTC(2026, 8, 21, 18, 15) }],
  },
};

export function queryDocuments(
  page: number,
  limit: number,
  q?: string,
  state?: string,
): Page<DocumentRecord> {
  let rows = DOCUMENTS;
  if (q !== undefined && q !== "") {
    const needle = q.toLowerCase();
    rows = rows.filter(
      (row) =>
        row.name.toLowerCase().includes(needle) || row.description.toLowerCase().includes(needle),
    );
  }
  if (state !== undefined && state !== "") {
    const needle = state.toLowerCase();
    rows = rows.filter((row) => row.state.toLowerCase() === needle);
  }
  const total = rows.length;
  const start = (page - 1) * limit;
  return { data: rows.slice(start, start + limit), meta: { total, page, limit } };
}

export function getDocumentDetail(name: string): DocumentDetail | undefined {
  return DETAILS[name];
}
