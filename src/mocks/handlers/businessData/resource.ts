import { http, HttpResponse } from "msw";
import { buildResourceDetail, queryResources } from "../../seeds/businessData/resource";

export const resourceHandlers = [
  http.get("/business-data/resources", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryResources(
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/resources/:name", ({ params }) =>
    HttpResponse.json(buildResourceDetail(decodeURIComponent(params.name as string))),
  ),
];
