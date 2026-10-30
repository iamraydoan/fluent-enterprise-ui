import { http, HttpResponse } from "msw";
import {
  buildPrintableDocumentDetail,
  queryPrintableDocuments,
} from "../../seeds/businessData/printableDocument";

export const printableDocumentHandlers = [
  http.get("/business-data/printable-documents", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryPrintableDocuments(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/printable-documents/:name", ({ params }) => {
    const name = decodeURIComponent(params.name as string);
    return HttpResponse.json(buildPrintableDocumentDetail(name));
  }),
];
