import { http, HttpResponse } from "msw";
import { getSiteDetail, getSitePage } from "../../seeds/businessData/site";

export const siteHandlers = [
  http.get("/business-data/sites", ({ request }) => {
    const params = new URL(request.url).searchParams;
    return HttpResponse.json(
      getSitePage({
        page: Number(params.get("page") ?? 1),
        limit: Number(params.get("limit") ?? 20),
        q: params.get("q") ?? undefined,
        state: params.get("state") ?? undefined,
      }),
    );
  }),
  http.get("/business-data/sites/:name", ({ params }) => {
    const detail = getSiteDetail(decodeURIComponent(params.name as string));
    if (!detail) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    return HttpResponse.json(detail);
  }),
];
