import { http, HttpResponse } from "msw";
import {
  buildShiftDefinitionDetail,
  queryShiftDefinitions,
} from "../../seeds/businessData/shiftDefinition";

export const shiftDefinitionHandlers = [
  http.get("/business-data/shift-definitions", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryShiftDefinitions(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/shift-definitions/:name", ({ params }) => {
    const name = decodeURIComponent(params.name as string);
    const detail = buildShiftDefinitionDetail(name);
    if (!detail) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    return HttpResponse.json(detail);
  }),
];
