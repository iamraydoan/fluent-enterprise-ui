import { http, HttpResponse } from "msw";
import { buildReasonDetail, queryReasons } from "../../seeds/businessData/reason";

export const reasonHandlers = [
  http.get("/business-data/reasons", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryReasons(
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/reasons/:name", ({ params }) =>
    HttpResponse.json(buildReasonDetail(decodeURIComponent(params.name as string))),
  ),
];
