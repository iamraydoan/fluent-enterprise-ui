import { http, HttpResponse } from "msw";
import { getShiftPlanDetail, getShiftPlanPage } from "../../seeds/businessData/shiftPlan";

export const shiftPlanHandlers = [
  http.get("/business-data/shift-plans", ({ request }) => {
    const params = new URL(request.url).searchParams;
    return HttpResponse.json(
      getShiftPlanPage({
        page: Number(params.get("page") ?? 1),
        limit: Number(params.get("limit") ?? 20),
        q: params.get("q") ?? undefined,
        state: params.get("state") ?? undefined,
      }),
    );
  }),
  http.get("/business-data/shift-plans/:name", ({ params }) => {
    const detail = getShiftPlanDetail(decodeURIComponent(params.name as string));
    if (!detail) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    return HttpResponse.json(detail);
  }),
];
