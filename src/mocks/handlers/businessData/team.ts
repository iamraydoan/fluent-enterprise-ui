import { http, HttpResponse } from "msw";
import { getTeamDetail, getTeamPage } from "../../seeds/businessData/team";

export const teamHandlers = [
  http.get("/business-data/teams", ({ request }) => {
    const params = new URL(request.url).searchParams;
    return HttpResponse.json(
      getTeamPage({
        page: Number(params.get("page") ?? 1),
        limit: Number(params.get("limit") ?? 20),
        q: params.get("q") ?? undefined,
        state: params.get("state") ?? undefined,
      }),
    );
  }),
  http.get("/business-data/teams/:name", ({ params }) => {
    const detail = getTeamDetail(decodeURIComponent(params.name as string));
    if (!detail) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    return HttpResponse.json(detail);
  }),
];
