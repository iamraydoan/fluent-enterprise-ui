import { http, HttpResponse } from "msw";
import {
  buildChangeSetDetail,
  createChangeSetDetail,
  queryChangeSets,
  updateChangeSetDetail,
} from "../../seeds/businessData/changeSet";
import type { ChangeSetUpsertInput } from "../../seeds/businessData/changeSet";

export const changeSetHandlers = [
  http.get("/business-data/change-sets", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryChangeSets(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/change-sets/:name", ({ params }) =>
    HttpResponse.json(buildChangeSetDetail(decodeURIComponent(params.name as string))),
  ),
  http.post("/business-data/change-sets", async ({ request }) => {
    const input = (await request.json()) as ChangeSetUpsertInput;
    if (!input.name) {
      return HttpResponse.json({ message: "Name is required" }, { status: 400 });
    }
    return HttpResponse.json(createChangeSetDetail(input), { status: 201 });
  }),
  http.put("/business-data/change-sets/:name", async ({ params, request }) => {
    const name = decodeURIComponent(params.name as string);
    const input = (await request.json()) as Partial<ChangeSetUpsertInput>;
    const updated = updateChangeSetDetail(name, input);
    if (!updated) {
      return HttpResponse.json({ message: "Change Set not found" }, { status: 404 });
    }
    return HttpResponse.json(updated);
  }),
  http.patch("/business-data/change-sets/:name/state", async ({ params, request }) => {
    const name = decodeURIComponent(params.name as string);
    const body = (await request.json()) as { state?: string; systemState?: string };
    const updated = updateChangeSetDetail(name, {
      ...(body.state ? { state: body.state } : {}),
      ...(body.systemState ? { systemState: body.systemState } : {}),
    });
    if (!updated) {
      return HttpResponse.json({ message: "Change Set not found" }, { status: 404 });
    }
    return HttpResponse.json(updated);
  }),
];
