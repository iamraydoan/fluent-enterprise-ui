import { http, HttpResponse } from "msw";
import { buildProductGroupDetail, queryProductGroups } from "../../seeds/businessData/productGroup";

export const productGroupHandlers = [
  http.get("/business-data/product-groups", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryProductGroups(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/product-groups/:name", ({ params }) => {
    const name = decodeURIComponent(params.name as string);
    return HttpResponse.json(buildProductGroupDetail(name));
  }),
];
