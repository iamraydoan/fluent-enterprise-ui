import { http, HttpResponse } from "msw";
import { getWorkgroupDetail, getWorkgroupPage } from "../../seeds/businessData/workgroup";

export const workgroupHandlers = [
  http.get("/business-data/workgroups", ({ request }) => {
    const params = new URL(request.url).searchParams;
    return HttpResponse.json(
      getWorkgroupPage({
        page: Number(params.get("page") ?? 1),
        limit: Number(params.get("limit") ?? 20),
        q: params.get("q") ?? undefined,
        state: params.get("state") ?? undefined,
      }),
    );
  }),
  http.get("/business-data/workgroups/:name", ({ params }) => {
    const detail = getWorkgroupDetail(decodeURIComponent(params.name as string));
    if (!detail) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    return HttpResponse.json(detail);
  }),
];
