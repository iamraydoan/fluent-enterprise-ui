import { http, HttpResponse } from "msw";
import type {
  CopyDataCollectionLimitSetsInput,
  DataCollectionLimitSetUpsertInput,
  ManageLimitSetParametersInput,
} from "@/api";
import {
  buildDataCollectionLimitSetDetail,
  copyDataCollectionLimitSets,
  createDataCollectionLimitSet,
  manageDataCollectionLimitSetParameters,
  queryDataCollectionLimitSets,
  setDataCollectionLimitSetState,
  updateDataCollectionLimitSet,
} from "../../seeds/businessData/dataCollectionLimitSet";

export const dataCollectionLimitSetHandlers = [
  http.get("/business-data/data-collection-limit-sets", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryDataCollectionLimitSets(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.post("/business-data/data-collection-limit-sets/copy", async ({ request }) => {
    const input = (await request.json()) as CopyDataCollectionLimitSetsInput;
    return HttpResponse.json(copyDataCollectionLimitSets(input), { status: 201 });
  }),
  http.get("/business-data/data-collection-limit-sets/:name", ({ params }) =>
    HttpResponse.json(buildDataCollectionLimitSetDetail(decodeURIComponent(params.name as string))),
  ),
  http.post("/business-data/data-collection-limit-sets", async ({ request }) => {
    const input = (await request.json()) as DataCollectionLimitSetUpsertInput;
    return HttpResponse.json(createDataCollectionLimitSet(input), { status: 201 });
  }),
  http.put("/business-data/data-collection-limit-sets/:name", async ({ params, request }) => {
    const input = (await request.json()) as DataCollectionLimitSetUpsertInput;
    return HttpResponse.json(
      updateDataCollectionLimitSet(decodeURIComponent(params.name as string), input),
    );
  }),
  http.patch(
    "/business-data/data-collection-limit-sets/:name/state",
    async ({ params, request }) => {
      const body = (await request.json()) as { state: string };
      return HttpResponse.json(
        setDataCollectionLimitSetState(decodeURIComponent(params.name as string), body.state),
      );
    },
  ),
  http.post(
    "/business-data/data-collection-limit-sets/:name/parameters",
    async ({ params, request }) => {
      const input = (await request.json()) as ManageLimitSetParametersInput;
      return HttpResponse.json(
        manageDataCollectionLimitSetParameters(decodeURIComponent(params.name as string), input),
      );
    },
  ),
];
