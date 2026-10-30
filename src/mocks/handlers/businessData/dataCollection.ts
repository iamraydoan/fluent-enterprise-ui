import { http, HttpResponse } from "msw";
import { buildDataCollectionDetail, queryDataCollections } from "../../seeds/businessData/dataCollection";

export const dataCollectionHandlers = [
  http.get("/business-data/data-collections", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryDataCollections(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/data-collections/:name", ({ params }) =>
    HttpResponse.json(buildDataCollectionDetail(decodeURIComponent(params.name as string))),
  ),
];
