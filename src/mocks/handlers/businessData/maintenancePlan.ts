import { http, HttpResponse } from "msw";
import {
  getMaintenancePlanDetail,
  queryMaintenancePlans,
} from "../../seeds/businessData/maintenancePlan";

export const maintenancePlanHandlers = [
  http.get("/maintenance-plans", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryMaintenancePlans(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/maintenance-plans/:name", ({ params }) => {
    const detail = getMaintenancePlanDetail(decodeURIComponent(String(params.name)));
    if (!detail) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(detail);
  }),
];
