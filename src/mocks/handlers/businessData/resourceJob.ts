import { http, HttpResponse } from "msw";
import { buildResourceJobDetail, queryResourceJobs } from "../../seeds/businessData/resourceJob";

export const resourceJobHandlers = [
  http.get("/business-data/resource-jobs", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryResourceJobs(
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/resource-jobs/:name", ({ params }) =>
    HttpResponse.json(buildResourceJobDetail(decodeURIComponent(params.name as string))),
  ),
];
