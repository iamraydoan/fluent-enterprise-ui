import { http, HttpResponse } from "msw";
import {
  buildBomDetail,
  createBomDetail,
  queryBoms,
  updateBomDetail,
} from "../../seeds/businessData/bom";
import type { BomUpsertInput } from "../../seeds/businessData/bom";

export const bomHandlers = [
  http.get("/business-data/boms", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryBoms(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/boms/:name", ({ params }) => {
    return HttpResponse.json(buildBomDetail(decodeURIComponent(params.name as string)));
  }),
  http.post("/business-data/boms", async ({ request }) => {
    const input = (await request.json()) as BomUpsertInput;
    if (!input.name) {
      return HttpResponse.json({ message: "Name is required" }, { status: 400 });
    }
    return HttpResponse.json(createBomDetail(input), { status: 201 });
  }),
  http.put("/business-data/boms/:name", async ({ params, request }) => {
    const name = decodeURIComponent(params.name as string);
    const input = (await request.json()) as Partial<BomUpsertInput>;
    const updated = updateBomDetail(name, input);
    if (!updated) {
      return HttpResponse.json({ message: "BOM not found" }, { status: 404 });
    }
    return HttpResponse.json(updated);
  }),
  http.patch("/business-data/boms/:name/state", async ({ params, request }) => {
    const name = decodeURIComponent(params.name as string);
    const body = (await request.json()) as { state?: string };
    const updated = updateBomDetail(name, body.state ? { state: body.state } : {});
    if (!updated) {
      return HttpResponse.json({ message: "BOM not found" }, { status: 404 });
    }
    return HttpResponse.json(updated);
  }),
];
