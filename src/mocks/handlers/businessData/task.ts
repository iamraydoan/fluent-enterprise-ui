import { http, HttpResponse } from "msw";
import { getTaskDetail, getTaskPage } from "../../seeds/businessData/task";

export const taskHandlers = [
  http.get("/business-data/tasks", ({ request }) => {
    const params = new URL(request.url).searchParams;
    return HttpResponse.json(
      getTaskPage({
        page: Number(params.get("page") ?? 1),
        limit: Number(params.get("limit") ?? 20),
        q: params.get("q") ?? undefined,
        state: params.get("state") ?? undefined,
      }),
    );
  }),
  http.get("/business-data/tasks/:name", ({ params }) => {
    const detail = getTaskDetail(decodeURIComponent(params.name as string));
    if (!detail) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    return HttpResponse.json(detail);
  }),
];
