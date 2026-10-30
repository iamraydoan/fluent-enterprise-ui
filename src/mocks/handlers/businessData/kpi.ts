import { http, HttpResponse } from "msw";
import { getKpiDetail, queryKpis } from "../../seeds/businessData/kpi";

export const kpiHandlers = [
  http.get("/kpis", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryKpis(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/kpis/:name", ({ params }) => {
    const detail = getKpiDetail(decodeURIComponent(String(params.name)));
    if (!detail) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(detail);
  }),
];
