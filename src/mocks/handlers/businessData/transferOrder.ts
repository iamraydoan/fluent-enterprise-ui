import { http, HttpResponse } from "msw";
import { getTransferOrderDetail, getTransferOrderPage } from "../../seeds/businessData/transferOrder";

export const transferOrderHandlers = [
  http.get("/business-data/transfer-orders", ({ request }) => {
    const params = new URL(request.url).searchParams;
    return HttpResponse.json(
      getTransferOrderPage({
        page: Number(params.get("page") ?? 1),
        limit: Number(params.get("limit") ?? 20),
        q: params.get("q") ?? undefined,
        state: params.get("state") ?? undefined,
      }),
    );
  }),
  http.get("/business-data/transfer-orders/:name", ({ params }) => {
    const detail = getTransferOrderDetail(decodeURIComponent(params.name as string));
    if (!detail) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    return HttpResponse.json(detail);
  }),
];
