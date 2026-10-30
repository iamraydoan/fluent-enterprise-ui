import { http, HttpResponse } from "msw";
import {
  buildCertificationDetail,
  createCertificationDetail,
  queryCertifications,
  updateCertificationDetail,
} from "../../seeds/businessData/certification";
import type { CertificationUpsertInput } from "../../seeds/businessData/certification";

export const certificationHandlers = [
  http.get("/business-data/certifications", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryCertifications(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/certifications/:name", ({ params }) =>
    HttpResponse.json(buildCertificationDetail(decodeURIComponent(params.name as string))),
  ),
  http.post("/business-data/certifications", async ({ request }) => {
    const input = (await request.json()) as CertificationUpsertInput;
    if (!input.name) {
      return HttpResponse.json({ message: "Name is required" }, { status: 400 });
    }
    return HttpResponse.json(createCertificationDetail(input), { status: 201 });
  }),
  http.put("/business-data/certifications/:name", async ({ params, request }) => {
    const name = decodeURIComponent(params.name as string);
    const input = (await request.json()) as Partial<CertificationUpsertInput>;
    const updated = updateCertificationDetail(name, input);
    if (!updated) {
      return HttpResponse.json({ message: "Certification not found" }, { status: 404 });
    }
    return HttpResponse.json(updated);
  }),
  http.patch("/business-data/certifications/:name/state", async ({ params, request }) => {
    const name = decodeURIComponent(params.name as string);
    const body = (await request.json()) as { state?: string };
    const updated = updateCertificationDetail(name, body.state ? { state: body.state } : {});
    if (!updated) {
      return HttpResponse.json({ message: "Certification not found" }, { status: 404 });
    }
    return HttpResponse.json(updated);
  }),
];
