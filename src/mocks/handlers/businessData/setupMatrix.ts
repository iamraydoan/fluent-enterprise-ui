import { http, HttpResponse } from "msw";
import { buildSetupMatrixDetail, querySetupMatrices } from "../../seeds/businessData/setupMatrix";

export const setupMatrixHandlers = [
  http.get("/business-data/setup-matrices", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      querySetupMatrices(
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/setup-matrices/:name", ({ params }) =>
    HttpResponse.json(buildSetupMatrixDetail(decodeURIComponent(params.name as string))),
  ),
];
