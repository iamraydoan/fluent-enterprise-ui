import { http, HttpResponse } from "msw";
import {
  addLogicalChart,
  buildChartDetail,
  createChartDetail,
  postDataPoint,
  queryCharts,
  recalculateCenterlines,
  removeLogicalChart,
  setChartEnabled,
  setChartLimits,
  setChartState,
  setDataPointStatus,
  updateChartDetail,
  updateChartRules,
  updateDataPoint,
  updateLogicalChart,
} from "../../seeds/businessData/chart";

async function readBody<T>(request: Request): Promise<T> {
  return (await request.json()) as T;
}

export const chartHandlers = [
  http.get("/business-data/charts", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryCharts(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/charts/:name", ({ params }) =>
    HttpResponse.json(buildChartDetail(decodeURIComponent(params.name as string))),
  ),
  http.post("/business-data/charts", async ({ request }) => {
    const body = await readBody<{ name?: string } & Record<string, unknown>>(request);
    return HttpResponse.json(createChartDetail(body), { status: 201 });
  }),
  http.put("/business-data/charts/:name", async ({ params, request }) => {
    const body = await readBody<Record<string, unknown>>(request);
    return HttpResponse.json(updateChartDetail(decodeURIComponent(params.name as string), body));
  }),
  http.patch("/business-data/charts/:name/state", async ({ params, request }) => {
    const body = await readBody<{ state: string }>(request);
    return HttpResponse.json(setChartState(decodeURIComponent(params.name as string), body.state));
  }),
  http.patch("/business-data/charts/:name/enabled", async ({ params, request }) => {
    const body = await readBody<{ enabled: boolean }>(request);
    return HttpResponse.json(
      setChartEnabled(decodeURIComponent(params.name as string), body.enabled),
    );
  }),
  http.put("/business-data/charts/:name/rules", async ({ params, request }) => {
    const body = await readBody<{ rules: never[] }>(request);
    return HttpResponse.json(
      updateChartRules(decodeURIComponent(params.name as string), body.rules),
    );
  }),
  http.put("/business-data/charts/:name/limits", async ({ params, request }) => {
    const body = await readBody<{
      chartLimits: Record<string, unknown>;
      logicalChartLimits: { name: string; limits: Record<string, unknown> }[];
    }>(request);
    return HttpResponse.json(
      setChartLimits(
        decodeURIComponent(params.name as string),
        body.chartLimits,
        body.logicalChartLimits,
      ),
    );
  }),
  http.post("/business-data/charts/:name/logical-charts", async ({ params, request }) => {
    const body = await readBody<Record<string, unknown>>(request);
    return HttpResponse.json(addLogicalChart(decodeURIComponent(params.name as string), body), {
      status: 201,
    });
  }),
  http.put("/business-data/charts/:name/logical-charts/:lc", async ({ params, request }) => {
    const body = await readBody<Record<string, unknown>>(request);
    return HttpResponse.json(
      updateLogicalChart(
        decodeURIComponent(params.name as string),
        decodeURIComponent(params.lc as string),
        body,
      ),
    );
  }),
  http.delete("/business-data/charts/:name/logical-charts/:lc", ({ params }) =>
    HttpResponse.json(
      removeLogicalChart(
        decodeURIComponent(params.name as string),
        decodeURIComponent(params.lc as string),
      ),
    ),
  ),
  http.post(
    "/business-data/charts/:name/logical-charts/:lc/recalculate",
    async ({ params, request }) => {
      const body = await readBody<{ points: number }>(request);
      return HttpResponse.json(
        recalculateCenterlines(
          decodeURIComponent(params.name as string),
          decodeURIComponent(params.lc as string),
          Number(body.points),
        ),
      );
    },
  ),
  http.post("/business-data/charts/:name/data-points", async ({ params, request }) => {
    const body = await readBody<Record<string, unknown>>(request);
    return HttpResponse.json(postDataPoint(decodeURIComponent(params.name as string), body), {
      status: 201,
    });
  }),
  http.put(
    "/business-data/charts/:name/logical-charts/:lc/data-points/:dp",
    async ({ params, request }) => {
      const body = await readBody<Record<string, unknown>>(request);
      return HttpResponse.json(
        updateDataPoint(
          decodeURIComponent(params.name as string),
          decodeURIComponent(params.lc as string),
          decodeURIComponent(params.dp as string),
          body,
        ),
      );
    },
  ),
  http.patch(
    "/business-data/charts/:name/logical-charts/:lc/data-points/:dp/status",
    async ({ params, request }) => {
      const body = await readBody<{ status: "Active" | "Excluded" | "Edited" | "Removed" }>(
        request,
      );
      return HttpResponse.json(
        setDataPointStatus(
          decodeURIComponent(params.name as string),
          decodeURIComponent(params.lc as string),
          decodeURIComponent(params.dp as string),
          body.status,
        ),
      );
    },
  ),
  http.post(
    "/business-data/charts/:name/logical-charts/:lc/data-points/:dp/protocol",
    ({ params }) => HttpResponse.json(buildChartDetail(decodeURIComponent(params.name as string))),
  ),
];
