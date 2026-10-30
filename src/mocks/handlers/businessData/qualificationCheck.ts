import { http, HttpResponse } from "msw";
import {
  buildQualificationCheckDetail,
  queryQualificationChecks,
} from "../../seeds/businessData/qualificationCheck";

export const qualificationCheckHandlers = [
  http.get("/business-data/qualification-checks", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryQualificationChecks(
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/qualification-checks/:name", ({ params }) =>
    HttpResponse.json(
      buildQualificationCheckDetail(decodeURIComponent(params.name as string)),
    ),
  ),
];
