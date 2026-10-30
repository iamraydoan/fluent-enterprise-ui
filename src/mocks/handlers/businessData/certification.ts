import { http, HttpResponse } from "msw";
import { buildCertificationDetail, queryCertifications } from "../../seeds/businessData/certification";

export const certificationHandlers = [
  http.get("/business-data/certifications", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryCertifications(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/certifications/:name", ({ params }) =>
    HttpResponse.json(buildCertificationDetail(decodeURIComponent(params.name as string))),
  ),
];
