import { http, HttpResponse } from "msw";
import {
  getMaintenanceActivityOrderDetail,
  queryMaintenanceActivityOrders,
} from "../../seeds/businessData/maintenanceActivityOrder";

export const maintenanceActivityOrderHandlers = [
  http.get("/maintenance-activity-orders", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryMaintenanceActivityOrders(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/maintenance-activity-orders/:name", ({ params }) => {
    const detail = getMaintenanceActivityOrderDetail(decodeURIComponent(String(params.name)));
    if (!detail) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(detail);
  }),
];
