import { http, HttpResponse } from "msw";
import { buildBatchDetail, queryBatches } from "../../seeds/businessData/batch";

export const batchHandlers = [
  http.get("/business-data/batches", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryBatches(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/batches/:name", ({ params }) => {
    const name = decodeURIComponent(params.name as string);
    return HttpResponse.json(buildBatchDetail(name));
  }),
];
