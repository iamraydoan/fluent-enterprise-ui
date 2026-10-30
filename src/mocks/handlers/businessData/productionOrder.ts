import { http, HttpResponse } from "msw";
import {
  buildProductionOrderDetail,
  queryProductionOrders,
} from "../../seeds/businessData/productionOrder";

export const productionOrderHandlers = [
  http.get("/business-data/production-orders", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryProductionOrders(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/production-orders/:name", ({ params }) => {
    const name = decodeURIComponent(params.name as string);
    return HttpResponse.json(buildProductionOrderDetail(name));
  }),
];
