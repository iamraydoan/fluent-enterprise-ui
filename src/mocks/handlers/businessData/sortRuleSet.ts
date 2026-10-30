import { http, HttpResponse } from "msw";
import { getSortRuleSetDetail, getSortRuleSetPage } from "../../seeds/businessData/sortRuleSet";

export const sortRuleSetHandlers = [
  http.get("/business-data/sort-rule-sets", ({ request }) => {
    const params = new URL(request.url).searchParams;
    return HttpResponse.json(
      getSortRuleSetPage({
        page: Number(params.get("page") ?? 1),
        limit: Number(params.get("limit") ?? 20),
        q: params.get("q") ?? undefined,
        state: params.get("state") ?? undefined,
      }),
    );
  }),
  http.get("/business-data/sort-rule-sets/:name", ({ params }) => {
    const detail = getSortRuleSetDetail(decodeURIComponent(params.name as string));
    if (!detail) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    return HttpResponse.json(detail);
  }),
];
