import { http, HttpResponse } from "msw";
import { buildPackageDetail, queryPackages } from "../../seeds/businessData/package";

export const packageHandlers = [
  http.get("/business-data/packages", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryPackages(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/packages/:name", ({ params }) => {
    const name = decodeURIComponent(params.name as string);
    return HttpResponse.json(buildPackageDetail(name));
  }),
];
