import { http, HttpResponse } from "msw";
import { getDataSiloDetail, queryDataSilos } from "../../seeds/businessData/dataSilo";

export const dataSiloHandlers = [
  http.get("/data-silos", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryDataSilos(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/data-silos/:name", ({ params }) => {
    const detail = getDataSiloDetail(decodeURIComponent(String(params.name)));
    if (!detail) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(detail);
  }),
];
