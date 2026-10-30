import { http, HttpResponse } from "msw";
import { buildContainerDetail, queryContainers } from "../../seeds/businessData/container";

export const containerHandlers = [
  http.get("/business-data/containers", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryContainers(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/containers/:name", ({ params }) =>
    HttpResponse.json(buildContainerDetail(decodeURIComponent(params.name as string))),
  ),
];
