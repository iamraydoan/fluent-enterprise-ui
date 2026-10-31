import { http, HttpResponse } from "msw";
import { getFabLiveDetail, getFabLivePage } from "../seeds/manufacturing";

export const fabLiveHandlers = [
  http.get("/manufacturing/fab-lives", ({ request }) => {
    const params = new URL(request.url).searchParams;
    return HttpResponse.json(
      getFabLivePage({
        page: Number(params.get("page") ?? 1),
        limit: Number(params.get("limit") ?? 20),
        q: params.get("q") ?? undefined,
        state: params.get("state") ?? undefined,
      }),
    );
  }),
  http.get("/manufacturing/fab-lives/:name", ({ params }) => {
    const detail = getFabLiveDetail(decodeURIComponent(params.name as string));
    if (!detail) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    return HttpResponse.json(detail);
  }),
];
