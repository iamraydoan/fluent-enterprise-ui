import { http, HttpResponse } from "msw";
import { buildAreaDetail, queryAreas } from "../../seeds/businessData/area";

export const areaHandlers = [
  http.get("/business-data/areas", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryAreas(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/areas/:name", ({ params }) => {
    const name = decodeURIComponent(params.name as string);
    return HttpResponse.json(buildAreaDetail(name));
  }),
];
