import { http, HttpResponse } from "msw";
import {
  buildDataCollectionDetail,
  correctDataCollectionInstance,
  createDataCollectionDetail,
  manageDataCollectionParameters,
  openDataCollectionInstance,
  performImmediateDataCollection,
  postDataCollectionInstance,
  queryDataCollections,
  resetDataCollectionInstance,
  setDataCollectionState,
  updateDataCollectionDetail,
  updateDataCollectionInstance,
} from "../../seeds/businessData/dataCollection";

export const dataCollectionHandlers = [
  http.get("/business-data/data-collections", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryDataCollections(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.post("/business-data/data-collections", async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(createDataCollectionDetail(body), { status: 201 });
  }),
  http.put("/business-data/data-collections/:name", async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(updateDataCollectionDetail(decodeURIComponent(params.name as string), body));
  }),
  http.patch("/business-data/data-collections/:name/state", async ({ params, request }) => {
    const body = (await request.json()) as { state: "Active" | "Terminated" };
    return HttpResponse.json(setDataCollectionState(decodeURIComponent(params.name as string), body.state));
  }),
  http.post("/business-data/data-collections/:name/parameters", async ({ params, request }) => {
    const body = (await request.json()) as { parameters: never[] };
    return HttpResponse.json(
      manageDataCollectionParameters(decodeURIComponent(params.name as string), body.parameters),
    );
  }),
  http.post("/business-data/data-collections/:name/instances/immediate", async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(
      performImmediateDataCollection(decodeURIComponent(params.name as string), body),
      { status: 201 },
    );
  }),
  http.post("/business-data/data-collections/:name/instances", async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(openDataCollectionInstance(decodeURIComponent(params.name as string), body), {
      status: 201,
    });
  }),
  http.patch("/business-data/data-collections/:name/instances/:instance", async ({ params, request }) => {
    const body = (await request.json()) as { state: string };
    return HttpResponse.json(
      updateDataCollectionInstance(
        decodeURIComponent(params.name as string),
        decodeURIComponent(params.instance as string),
        body,
      ),
    );
  }),
  http.post("/business-data/data-collections/:name/instances/:instance/post", async ({ params, request }) => {
    const body = (await request.json()) as { values: { parameter: string; value: string }[] };
    return HttpResponse.json(
      postDataCollectionInstance(
        decodeURIComponent(params.name as string),
        decodeURIComponent(params.instance as string),
        body.values,
      ),
    );
  }),
  http.post("/business-data/data-collections/:name/instances/:instance/correct", async ({ params, request }) => {
    const body = (await request.json()) as { values: { parameter: string; value: string }[] };
    return HttpResponse.json(
      correctDataCollectionInstance(
        decodeURIComponent(params.name as string),
        decodeURIComponent(params.instance as string),
        body.values,
      ),
    );
  }),
  http.post("/business-data/data-collections/:name/instances/:instance/reset", async ({ params }) => {
    return HttpResponse.json(
      resetDataCollectionInstance(
        decodeURIComponent(params.name as string),
        decodeURIComponent(params.instance as string),
      ),
    );
  }),
  http.get("/business-data/data-collections/:name", ({ params }) =>
    HttpResponse.json(buildDataCollectionDetail(decodeURIComponent(params.name as string))),
  ),
];
