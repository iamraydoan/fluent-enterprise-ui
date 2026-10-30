import { http, HttpResponse } from "msw";
import { getFacilityDetail, queryFacilities } from "../../seeds/businessData/facility";

export const facilityHandlers = [
  http.get("/facilities", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryFacilities(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/facilities/:name", ({ params }) => {
    const detail = getFacilityDetail(decodeURIComponent(String(params.name)));
    if (!detail) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(detail);
  }),
];
