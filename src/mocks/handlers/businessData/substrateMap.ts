import { http, HttpResponse } from "msw";
import { getSubstrateMapDetail, getSubstrateMapPage } from "../../seeds/businessData/substrateMap";

export const substrateMapHandlers = [
  http.get("/business-data/substrate-maps", ({ request }) => {
    const params = new URL(request.url).searchParams;
    return HttpResponse.json(
      getSubstrateMapPage({
        page: Number(params.get("page") ?? 1),
        limit: Number(params.get("limit") ?? 20),
        q: params.get("q") ?? undefined,
        state: params.get("state") ?? undefined,
      }),
    );
  }),
  http.get("/business-data/substrate-maps/:name", ({ params }) => {
    const detail = getSubstrateMapDetail(decodeURIComponent(params.name as string));
    if (!detail) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    return HttpResponse.json(detail);
  }),
];
