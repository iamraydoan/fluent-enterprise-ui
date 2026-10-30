import { http, HttpResponse } from "msw";
import {
  buildAreaDetail,
  createAreaDetail,
  queryAreas,
  setAreaState,
  updateAreaDetail,
} from "../../seeds/businessData/area";

export const areaHandlers = [
  http.get("/business-data/areas", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryAreas(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/areas/:name", ({ params }) => {
    const name = decodeURIComponent(params.name as string);
    return HttpResponse.json(buildAreaDetail(name));
  }),
  http.post("/business-data/areas", async ({ request }) => {
    const input = (await request.json()) as Record<string, unknown>;
    if (typeof input.name !== "string" || input.name === "") {
      return HttpResponse.json({ message: "Name is required" }, { status: 400 });
    }
    return HttpResponse.json(
      createAreaDetail(input as unknown as Parameters<typeof createAreaDetail>[0]),
      { status: 201 },
    );
  }),
  http.put("/business-data/areas/:name", async ({ params, request }) => {
    const name = decodeURIComponent(params.name as string);
    const input = (await request.json()) as Record<string, unknown>;
    const updated = updateAreaDetail(name, input);
    if (!updated) {
      return HttpResponse.json({ message: "Area not found" }, { status: 404 });
    }
    return HttpResponse.json(updated);
  }),
  http.patch("/business-data/areas/:name/state", async ({ params, request }) => {
    const name = decodeURIComponent(params.name as string);
    const body = (await request.json()) as { state?: string };
    if (body.state !== "Active" && body.state !== "Terminated") {
      return HttpResponse.json({ message: "Invalid state" }, { status: 400 });
    }
    const updated = setAreaState(name, body.state);
    if (!updated) {
      return HttpResponse.json({ message: "Area not found" }, { status: 404 });
    }
    return HttpResponse.json(updated);
  }),
];
