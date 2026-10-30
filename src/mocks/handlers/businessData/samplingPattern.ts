import { http, HttpResponse } from "msw";
import {
  buildSamplingPatternDetail,
  querySamplingPatterns,
} from "../../seeds/businessData/samplingPattern";

export const samplingPatternHandlers = [
  http.get("/business-data/sampling-patterns", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      querySamplingPatterns(
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/sampling-patterns/:name", ({ params }) =>
    HttpResponse.json(buildSamplingPatternDetail(decodeURIComponent(params.name as string))),
  ),
];
