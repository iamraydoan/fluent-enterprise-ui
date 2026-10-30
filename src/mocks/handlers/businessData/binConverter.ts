import { http, HttpResponse } from "msw";
import {
  buildBinConverterDetail,
  createBinConverterDetail,
  queryBinConverters,
  updateBinConverterDetail,
} from "../../seeds/businessData/binConverter";
import type { BinConverterUpsertInput } from "../../seeds/businessData/binConverter";

export const binConverterHandlers = [
  http.get("/business-data/bin-converters", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryBinConverters(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/bin-converters/:name", ({ params }) =>
    HttpResponse.json(buildBinConverterDetail(decodeURIComponent(params.name as string))),
  ),
  http.post("/business-data/bin-converters", async ({ request }) => {
    const input = (await request.json()) as BinConverterUpsertInput;
    if (!input.name) {
      return HttpResponse.json({ message: "Name is required" }, { status: 400 });
    }
    return HttpResponse.json(createBinConverterDetail(input), { status: 201 });
  }),
  http.put("/business-data/bin-converters/:name", async ({ params, request }) => {
    const name = decodeURIComponent(params.name as string);
    const input = (await request.json()) as Partial<BinConverterUpsertInput>;
    const updated = updateBinConverterDetail(name, input);
    if (!updated) {
      return HttpResponse.json({ message: "Bin Converter not found" }, { status: 404 });
    }
    return HttpResponse.json(updated);
  }),
  http.patch("/business-data/bin-converters/:name/state", async ({ params, request }) => {
    const name = decodeURIComponent(params.name as string);
    const body = (await request.json()) as { state?: string };
    const updated = updateBinConverterDetail(name, body.state ? { state: body.state } : {});
    if (!updated) {
      return HttpResponse.json({ message: "Bin Converter not found" }, { status: 404 });
    }
    return HttpResponse.json(updated);
  }),
];
