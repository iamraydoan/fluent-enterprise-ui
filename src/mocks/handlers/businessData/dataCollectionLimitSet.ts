import { http, HttpResponse } from "msw";
import { buildDataCollectionLimitSetDetail, queryDataCollectionLimitSets } from "../../seeds/businessData/dataCollectionLimitSet";

export const dataCollectionLimitSetHandlers = [
  http.get("/business-data/data-collection-limit-sets", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryDataCollectionLimitSets(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/data-collection-limit-sets/:name", ({ params }) =>
    HttpResponse.json(buildDataCollectionLimitSetDetail(decodeURIComponent(params.name as string))),
  ),
];
