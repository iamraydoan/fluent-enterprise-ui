import { http, HttpResponse } from "msw";
import { buildChartDetail, queryCharts } from "../../seeds/businessData/chart";

export const chartHandlers = [
  http.get("/business-data/charts", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryCharts(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/charts/:name", ({ params }) =>
    HttpResponse.json(buildChartDetail(decodeURIComponent(params.name as string))),
  ),
];
