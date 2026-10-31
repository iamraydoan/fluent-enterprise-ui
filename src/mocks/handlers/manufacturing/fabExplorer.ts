import { http, HttpResponse } from "msw";
import {
  buildResourceDetail,
  buildStepSummary,
  queryDispatchList,
  queryResourceMaterials,
  queryStepMaterials,
  queryStepResources,
} from "../../seeds/manufacturing/fabExplorer";

function num(value: string | null, fallback: number): number {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function opt(value: string | null): string | undefined {
  return value === null || value === "" ? undefined : value;
}

export const fabExplorerHandlers = [
  http.get("/manufacturing/fab-explorer/steps/:name", ({ params }) => {
    const name = decodeURIComponent(params.name as string);
    return HttpResponse.json(buildStepSummary(name));
  }),
  http.get("/manufacturing/fab-explorer/steps/:name/materials", ({ params, request }) => {
    const name = decodeURIComponent(params.name as string);
    const search = new URL(request.url).searchParams;
    return HttpResponse.json(
      queryStepMaterials(
        name,
        num(search.get("page"), 1),
        num(search.get("limit"), 25),
        opt(search.get("q")),
        opt(search.get("state")),
        opt(search.get("product")),
        opt(search.get("flow")),
      ),
    );
  }),
  http.get("/manufacturing/fab-explorer/steps/:name/resources", ({ params, request }) => {
    const name = decodeURIComponent(params.name as string);
    const search = new URL(request.url).searchParams;
    return HttpResponse.json(
      queryStepResources(
        name,
        num(search.get("page"), 1),
        num(search.get("limit"), 100),
        opt(search.get("q")),
        opt(search.get("processingType")),
        opt(search.get("systemState")),
        opt(search.get("state")),
      ),
    );
  }),
  http.get("/manufacturing/fab-explorer/resources/:name", ({ params }) => {
    const name = decodeURIComponent(params.name as string);
    return HttpResponse.json(buildResourceDetail(name));
  }),
  http.get("/manufacturing/fab-explorer/resources/:name/materials", ({ params, request }) => {
    const name = decodeURIComponent(params.name as string);
    const search = new URL(request.url).searchParams;
    return HttpResponse.json(
      queryResourceMaterials(
        name,
        num(search.get("page"), 1),
        num(search.get("limit"), 25),
        opt(search.get("q")),
        opt(search.get("state")),
      ),
    );
  }),
  http.get("/manufacturing/fab-explorer/resources/:name/dispatch-list", ({ params, request }) => {
    const name = decodeURIComponent(params.name as string);
    const search = new URL(request.url).searchParams;
    return HttpResponse.json(
      queryDispatchList(
        name,
        num(search.get("page"), 1),
        num(search.get("limit"), 25),
        opt(search.get("q")),
      ),
    );
  }),
  http.post("/manufacturing/fab-explorer/operations/:operation", () => {
    return HttpResponse.json({ ok: true });
  }),
];
