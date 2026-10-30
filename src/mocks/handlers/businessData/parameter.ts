import { http, HttpResponse } from "msw";
import { buildParameterDetail, queryParameters } from "../../seeds/businessData/parameter";

export const parameterHandlers = [
  http.get("/business-data/parameters", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryParameters(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/parameters/:name", ({ params }) => {
    const name = decodeURIComponent(params.name as string);
    return HttpResponse.json(buildParameterDetail(name));
  }),
];
