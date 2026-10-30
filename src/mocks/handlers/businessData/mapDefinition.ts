import { http, HttpResponse } from "msw";
import {
  getMapDefinitionDetail,
  queryMapDefinitions,
} from "../../seeds/businessData/mapDefinition";

export const mapDefinitionHandlers = [
  http.get("/map-definitions", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryMapDefinitions(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/map-definitions/:name", ({ params }) => {
    const detail = getMapDefinitionDetail(decodeURIComponent(String(params.name)));
    if (!detail) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(detail);
  }),
];
