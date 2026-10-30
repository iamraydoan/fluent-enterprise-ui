import { http, HttpResponse } from "msw";
import { buildSamplingPlanDetail, querySamplingPlans } from "../../seeds/businessData/samplingPlan";

export const samplingPlanHandlers = [
  http.get("/business-data/sampling-plans", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      querySamplingPlans(
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/sampling-plans/:name", ({ params }) =>
    HttpResponse.json(buildSamplingPlanDetail(decodeURIComponent(params.name as string))),
  ),
];
