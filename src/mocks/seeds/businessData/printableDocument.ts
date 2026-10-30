import type { PrintableDocumentDetail, PrintableDocumentRecord, Page } from "@/api";

const RECORDS: PrintableDocumentRecord[] = [
  {
    name: "Label-Carton",
    description: "Carton label template",
    documentType: "Label",
    state: "Active",
    version: "3.0",
  },
  {
    name: "Slip-Packing",
    description: "Packing slip",
    documentType: "Report",
    state: "Active",
    version: "1.2",
  },
];

export function queryPrintableDocuments(
  page: number,
  limit: number,
  q?: string,
  state?: string,
): Page<PrintableDocumentRecord> {
  let rows = RECORDS;
  if (q !== undefined && q !== "") {
    const needle = q.toLowerCase();
    rows = rows.filter((r) => r.name.toLowerCase().includes(needle));
  }
  if (state !== undefined && state !== "" && state !== "all") {
    rows = rows.filter(
      (r) => (r as unknown as Record<string, string>).state?.toLowerCase() === state.toLowerCase(),
    );
  }
  const total = rows.length;
  const start = (page - 1) * limit;
  return { data: rows.slice(start, start + limit), meta: { total, page, limit } };
}

export function buildPrintableDocumentDetail(name: string): PrintableDocumentDetail {
  const record = RECORDS.find((r) => r.name === name) ?? RECORDS[0];
  return { ...record };
}
