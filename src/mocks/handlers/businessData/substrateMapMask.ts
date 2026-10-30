import { http, HttpResponse } from "msw";
import {
  getSubstrateMapMaskDetail,
  getSubstrateMapMaskPage,
} from "../../seeds/businessData/substrateMapMask";

export const substrateMapMaskHandlers = [
  http.get("/business-data/substrate-map-masks", ({ request }) => {
    const params = new URL(request.url).searchParams;
    return HttpResponse.json(
      getSubstrateMapMaskPage({
        page: Number(params.get("page") ?? 1),
        limit: Number(params.get("limit") ?? 20),
        q: params.get("q") ?? undefined,
        state: params.get("state") ?? undefined,
      }),
    );
  }),
  http.get("/business-data/substrate-map-masks/:name", ({ params }) => {
    const detail = getSubstrateMapMaskDetail(decodeURIComponent(params.name as string));
    if (!detail) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    return HttpResponse.json(detail);
  }),
];
