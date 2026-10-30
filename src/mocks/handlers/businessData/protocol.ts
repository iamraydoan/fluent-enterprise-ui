import { http, HttpResponse } from "msw";
import { buildProtocolDetail, queryProtocols } from "../../seeds/businessData/protocol";

export const protocolHandlers = [
  http.get("/business-data/protocols", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryProtocols(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/protocols/:name", ({ params }) => {
    const name = decodeURIComponent(params.name as string);
    return HttpResponse.json(buildProtocolDetail(name));
  }),
];
