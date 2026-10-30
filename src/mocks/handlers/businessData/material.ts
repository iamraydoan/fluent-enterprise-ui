import { http, HttpResponse } from "msw";
import { buildMaterialDetail, queryMaterials } from "../../seeds/businessData/material";

export const materialHandlers = [
  http.get("/business-data/materials", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryMaterials(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/materials/:name", ({ params }) => {
    const name = decodeURIComponent(params.name as string);
    return HttpResponse.json(buildMaterialDetail(name));
  }),
];
