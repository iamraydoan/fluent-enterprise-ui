import { http, HttpResponse } from "msw";
import {
  applyContainerOperation,
  buildContainerDetail,
  createContainerDetail,
  queryContainers,
  setContainerState,
  updateContainerDetail,
} from "../../seeds/businessData/container";

export const containerHandlers = [
  http.get("/business-data/containers", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryContainers(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.post("/business-data/containers", async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(createContainerDetail(body), { status: 201 });
  }),
  http.put("/business-data/containers/:name", async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(updateContainerDetail(decodeURIComponent(params.name as string), body));
  }),
  http.patch("/business-data/containers/:name/state", async ({ params, request }) => {
    const body = (await request.json()) as { state: "Active" | "Terminated" };
    return HttpResponse.json(setContainerState(decodeURIComponent(params.name as string), body.state));
  }),
  http.post("/business-data/containers/:name/operations", async ({ params, request }) => {
    const body = (await request.json()) as { operation: string } & Record<string, unknown>;
    return HttpResponse.json(
      applyContainerOperation(decodeURIComponent(params.name as string), body.operation, body),
    );
  }),
  http.get("/business-data/containers/:name", ({ params }) =>
    HttpResponse.json(buildContainerDetail(decodeURIComponent(params.name as string))),
  ),
];
