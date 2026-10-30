import { http, HttpResponse } from "msw";
import {
  buildBatchDetail,
  createBatchDetail,
  queryBatches,
  updateBatchDetail,
} from "../../seeds/businessData/batch";
import type { BatchUpsertInput } from "../../seeds/businessData/batch";

export const batchHandlers = [
  http.get("/business-data/batches", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryBatches(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/batches/:name", ({ params }) => {
    const name = decodeURIComponent(params.name as string);
    return HttpResponse.json(buildBatchDetail(name));
  }),
  http.post("/business-data/batches", async ({ request }) => {
    const input = (await request.json()) as BatchUpsertInput;
    if (!input.name) {
      return HttpResponse.json({ message: "Name is required" }, { status: 400 });
    }
    return HttpResponse.json(createBatchDetail(input), { status: 201 });
  }),
  http.put("/business-data/batches/:name", async ({ params, request }) => {
    const name = decodeURIComponent(params.name as string);
    const input = (await request.json()) as Partial<BatchUpsertInput>;
    const updated = updateBatchDetail(name, input);
    if (!updated) {
      return HttpResponse.json({ message: "Batch not found" }, { status: 404 });
    }
    return HttpResponse.json(updated);
  }),
  http.patch("/business-data/batches/:name/state", async ({ params, request }) => {
    const name = decodeURIComponent(params.name as string);
    const body = (await request.json()) as { state?: string; systemState?: string };
    const updated = updateBatchDetail(name, {
      ...(body.state ? { state: body.state } : {}),
      ...(body.systemState ? { systemState: body.systemState } : {}),
    });
    if (!updated) {
      return HttpResponse.json({ message: "Batch not found" }, { status: 404 });
    }
    return HttpResponse.json(updated);
  }),
];
