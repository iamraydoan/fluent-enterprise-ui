import { http, HttpResponse } from "msw";
import { getDocumentDetail, queryDocuments } from "../../seeds/businessData/document";

export const documentHandlers = [
  http.get("/documents", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryDocuments(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/documents/:name", ({ params }) => {
    const detail = getDocumentDetail(decodeURIComponent(String(params.name)));
    if (!detail) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(detail);
  }),
];
