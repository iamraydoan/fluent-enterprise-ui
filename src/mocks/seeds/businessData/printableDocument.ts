import type { PrintableDocumentDetail, PrintableDocumentRecord, Page } from "@/api";
import { filterByQuery, filterByState, paginate } from "../../mockUtils";

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
  const rows = filterByState(filterByQuery(RECORDS, q, ["name"]), state);
  return paginate(rows, page, limit);
}

export function buildPrintableDocumentDetail(name: string): PrintableDocumentDetail {
  const record = RECORDS.find((r) => r.name === name) ?? RECORDS[0];
  return { ...record };
}
