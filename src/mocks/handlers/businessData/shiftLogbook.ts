import { http, HttpResponse } from "msw";
import { getShiftLogbookDetail, getShiftLogbookPage } from "../../seeds/businessData/shiftLogbook";

export const shiftLogbookHandlers = [
  http.get("/business-data/shift-logbooks", ({ request }) => {
    const params = new URL(request.url).searchParams;
    return HttpResponse.json(
      getShiftLogbookPage({
        page: Number(params.get("page") ?? 1),
        limit: Number(params.get("limit") ?? 20),
        q: params.get("q") ?? undefined,
        state: params.get("state") ?? undefined,
      }),
    );
  }),
  http.get("/business-data/shift-logbooks/:name", ({ params }) => {
    const detail = getShiftLogbookDetail(decodeURIComponent(params.name as string));
    if (!detail) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    return HttpResponse.json(detail);
  }),
];
