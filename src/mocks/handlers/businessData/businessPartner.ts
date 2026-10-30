import { http, HttpResponse } from "msw";
import {
  buildBusinessPartnerDetail,
  createBusinessPartnerDetail,
  queryBusinessPartners,
  updateBusinessPartnerDetail,
} from "../../seeds/businessData/businessPartner";
import type { BusinessPartnerUpsertInput } from "../../seeds/businessData/businessPartner";

export const businessPartnerHandlers = [
  http.get("/business-data/business-partners", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryBusinessPartners(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/business-partners/:name", ({ params }) =>
    HttpResponse.json(buildBusinessPartnerDetail(decodeURIComponent(params.name as string))),
  ),
  http.post("/business-data/business-partners", async ({ request }) => {
    const input = (await request.json()) as BusinessPartnerUpsertInput;
    if (!input.name) {
      return HttpResponse.json({ message: "Name is required" }, { status: 400 });
    }
    return HttpResponse.json(createBusinessPartnerDetail(input), { status: 201 });
  }),
  http.put("/business-data/business-partners/:name", async ({ params, request }) => {
    const name = decodeURIComponent(params.name as string);
    const input = (await request.json()) as Partial<BusinessPartnerUpsertInput>;
    const updated = updateBusinessPartnerDetail(name, input);
    if (!updated) {
      return HttpResponse.json({ message: "Business Partner not found" }, { status: 404 });
    }
    return HttpResponse.json(updated);
  }),
  http.patch("/business-data/business-partners/:name/state", async ({ params, request }) => {
    const name = decodeURIComponent(params.name as string);
    const body = (await request.json()) as { state?: string };
    const updated = updateBusinessPartnerDetail(name, body.state ? { state: body.state } : {});
    if (!updated) {
      return HttpResponse.json({ message: "Business Partner not found" }, { status: 404 });
    }
    return HttpResponse.json(updated);
  }),
];
