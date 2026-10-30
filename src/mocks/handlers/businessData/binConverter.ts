import { http, HttpResponse } from "msw";
import { buildBinConverterDetail, queryBinConverters } from "../../seeds/businessData/binConverter";

export const binConverterHandlers = [
  http.get("/business-data/bin-converters", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryBinConverters(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/bin-converters/:name", ({ params }) =>
    HttpResponse.json(buildBinConverterDetail(decodeURIComponent(params.name as string))),
  ),
];
