import { http, HttpResponse } from "msw";
import { buildPlanDetail, queryPlans } from "../../seeds/businessData/plan";

export const planHandlers = [
  http.get("/business-data/plans", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryPlans(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/plans/:name", ({ params }) => {
    const name = decodeURIComponent(params.name as string);
    return HttpResponse.json(buildPlanDetail(name));
  }),
];
