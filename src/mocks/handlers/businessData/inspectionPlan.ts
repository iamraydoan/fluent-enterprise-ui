import { http, HttpResponse } from "msw";
import {
  getInspectionPlanDetail,
  queryInspectionPlans,
} from "../../seeds/businessData/inspectionPlan";

export const inspectionPlanHandlers = [
  http.get("/inspection-plans", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryInspectionPlans(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/inspection-plans/:name", ({ params }) => {
    const detail = getInspectionPlanDetail(decodeURIComponent(String(params.name)));
    if (!detail) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(detail);
  }),
];
