import { http, HttpResponse } from "msw";
import { buildServiceDetail, queryServices } from "../../seeds/businessData/service";

export const serviceHandlers = [
  http.get("/business-data/services", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryServices(
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/services/:name", ({ params }) =>
    HttpResponse.json(buildServiceDetail(decodeURIComponent(params.name as string))),
  ),
];
