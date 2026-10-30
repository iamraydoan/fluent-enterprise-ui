import { http, HttpResponse } from "msw";
import {
  buildChecklistDetail,
  createChecklistDetail,
  openChecklistInstance,
  openMaterialDeviation,
  performChecklistInstance,
  queryChecklists,
  setChecklistState,
  updateChecklistDetail,
  updateChecklistInstance,
} from "../../seeds/businessData/checklist";

async function readBody<T>(request: Request): Promise<T> {
  return (await request.json()) as T;
}

export const checklistHandlers = [
  http.get("/business-data/checklists", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryChecklists(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/checklists/:name", ({ params }) =>
    HttpResponse.json(buildChecklistDetail(decodeURIComponent(params.name as string))),
  ),
  http.post("/business-data/checklists", async ({ request }) => {
    const body = await readBody<Record<string, unknown>>(request);
    return HttpResponse.json(createChecklistDetail(body), { status: 201 });
  }),
  http.put("/business-data/checklists/:name", async ({ params, request }) => {
    const body = await readBody<Record<string, unknown>>(request);
    return HttpResponse.json(
      updateChecklistDetail(decodeURIComponent(params.name as string), body),
    );
  }),
  http.patch("/business-data/checklists/:name/state", async ({ params, request }) => {
    const body = await readBody<{ state: string }>(request);
    return HttpResponse.json(
      setChecklistState(decodeURIComponent(params.name as string), body.state),
    );
  }),
  http.post("/business-data/checklists/:name/instances", async ({ params, request }) => {
    const body = await readBody<{ name?: string; material?: string }>(request);
    return HttpResponse.json(
      openChecklistInstance(decodeURIComponent(params.name as string), body),
      {
        status: 201,
      },
    );
  }),
  http.patch("/business-data/checklists/:name/instances/:instance", async ({ params, request }) => {
    const body = await readBody<Record<string, unknown>>(request);
    return HttpResponse.json(
      updateChecklistInstance(
        decodeURIComponent(params.name as string),
        decodeURIComponent(params.instance as string),
        body,
      ),
    );
  }),
  http.post(
    "/business-data/checklists/:name/instances/:instance/perform",
    async ({ params, request }) => {
      const body = await readBody<{
        items: { name: string; state: "Not Started" | "Started" | "Completed" | "Skipped" }[];
        close?: boolean;
      }>(request);
      return HttpResponse.json(
        performChecklistInstance(
          decodeURIComponent(params.name as string),
          decodeURIComponent(params.instance as string),
          body.items,
          body.close,
        ),
      );
    },
  ),
  http.post(
    "/business-data/checklists/:name/instances/:instance/deviations",
    async ({ params, request }) => {
      const body = await readBody<{ itemName: string; deviationType: string }>(request);
      return HttpResponse.json(
        openMaterialDeviation(
          decodeURIComponent(params.name as string),
          decodeURIComponent(params.instance as string),
          body,
        ),
        { status: 201 },
      );
    },
  ),
];
