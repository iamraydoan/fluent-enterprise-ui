import { http, HttpResponse } from "msw";
import { buildProductDetail, queryProducts } from "../../seeds/businessData/product";

export const productHandlers = [
  http.get("/business-data/products", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryProducts(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/products/:name", ({ params }) => {
    const name = decodeURIComponent(params.name as string);
    return HttpResponse.json(buildProductDetail(name));
  }),
];
