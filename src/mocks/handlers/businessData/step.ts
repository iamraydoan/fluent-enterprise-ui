import { http, HttpResponse } from "msw";
import { getStepDetail, getStepPage } from "../../seeds/businessData/step";

export const stepHandlers = [
  http.get("/business-data/steps", ({ request }) => {
    const params = new URL(request.url).searchParams;
    return HttpResponse.json(
      getStepPage({
        page: Number(params.get("page") ?? 1),
        limit: Number(params.get("limit") ?? 20),
        q: params.get("q") ?? undefined,
        state: params.get("state") ?? undefined,
      }),
    );
  }),
  http.get("/business-data/steps/:name", ({ params }) => {
    const detail = getStepDetail(decodeURIComponent(params.name as string));
    if (!detail) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    return HttpResponse.json(detail);
  }),
];
