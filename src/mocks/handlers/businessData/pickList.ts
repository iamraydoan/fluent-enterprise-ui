import { http, HttpResponse } from "msw";
import { buildPickListDetail, queryPickLists } from "../../seeds/businessData/pickList";

export const pickListHandlers = [
  http.get("/business-data/pick-lists", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryPickLists(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/pick-lists/:name", ({ params }) => {
    const name = decodeURIComponent(params.name as string);
    return HttpResponse.json(buildPickListDetail(name));
  }),
];
