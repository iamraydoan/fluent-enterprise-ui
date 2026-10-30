import { http, HttpResponse } from "msw";
import { buildChecklistDetail, queryChecklists } from "../../seeds/businessData/checklist";

export const checklistHandlers = [
  http.get("/business-data/checklists", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryChecklists(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/checklists/:name", ({ params }) =>
    HttpResponse.json(buildChecklistDetail(decodeURIComponent(params.name as string))),
  ),
];
