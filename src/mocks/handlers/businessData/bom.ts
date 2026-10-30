import { http, HttpResponse } from "msw";
import { buildBomDetail, queryBoms } from "../../seeds/businessData/bom";

export const bomHandlers = [
  http.get("/business-data/boms", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryBoms(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/boms/:name", ({ params }) => {
    return HttpResponse.json(buildBomDetail(decodeURIComponent(params.name as string)));
  }),
];
