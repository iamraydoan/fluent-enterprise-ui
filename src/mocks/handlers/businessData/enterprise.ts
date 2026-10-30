import { http, HttpResponse } from "msw";
import { getEnterpriseDetail, queryEnterprises } from "../../seeds/businessData/enterprise";

export const enterpriseHandlers = [
  http.get("/enterprises", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryEnterprises(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/enterprises/:name", ({ params }) => {
    const detail = getEnterpriseDetail(decodeURIComponent(String(params.name)));
    if (!detail) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(detail);
  }),
];
