import { http, HttpResponse } from "msw";
import {
  getExperimentDefinitionDetail,
  queryExperimentDefinitions,
} from "../../seeds/businessData/experimentDefinition";

export const experimentDefinitionHandlers = [
  http.get("/experiment-definitions", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryExperimentDefinitions(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/experiment-definitions/:name", ({ params }) => {
    const detail = getExperimentDefinitionDetail(decodeURIComponent(String(params.name)));
    if (!detail) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(detail);
  }),
];
