import { http, HttpResponse } from "msw";
import { buildChangeSetDetail, queryChangeSets } from "../../seeds/businessData/changeSet";

export const changeSetHandlers = [
  http.get("/business-data/change-sets", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryChangeSets(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/change-sets/:name", ({ params }) =>
    HttpResponse.json(buildChangeSetDetail(decodeURIComponent(params.name as string))),
  ),
];
