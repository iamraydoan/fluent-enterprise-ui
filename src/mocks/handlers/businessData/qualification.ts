import { http, HttpResponse } from "msw";
import {
  buildQualificationDetail,
  queryQualifications,
} from "../../seeds/businessData/qualification";

export const qualificationHandlers = [
  http.get("/business-data/qualifications", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryQualifications(
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/qualifications/:name", ({ params }) =>
    HttpResponse.json(buildQualificationDetail(decodeURIComponent(params.name as string))),
  ),
];
