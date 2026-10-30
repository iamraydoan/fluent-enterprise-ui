import { http, HttpResponse } from "msw";
import { buildSendAheadRunDetail, querySendAheadRuns } from "../../seeds/businessData/sendAheadRun";

export const sendAheadRunHandlers = [
  http.get("/business-data/send-ahead-runs", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      querySendAheadRuns(
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/send-ahead-runs/:name", ({ params }) =>
    HttpResponse.json(buildSendAheadRunDetail(decodeURIComponent(params.name as string))),
  ),
];
