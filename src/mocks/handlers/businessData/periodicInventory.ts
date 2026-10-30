import { http, HttpResponse } from "msw";
import {
  buildPeriodicInventoryDetail,
  queryPeriodicInventorys,
} from "../../seeds/businessData/periodicInventory";

export const periodicInventoryHandlers = [
  http.get("/business-data/periodic-inventorys", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryPeriodicInventorys(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/periodic-inventorys/:name", ({ params }) => {
    const name = decodeURIComponent(params.name as string);
    return HttpResponse.json(buildPeriodicInventoryDetail(name));
  }),
];
