import { http, HttpResponse } from "msw";
import { getTransferRequirementDetail, getTransferRequirementPage } from "../../seeds/businessData/transferRequirement";

export const transferRequirementHandlers = [
  http.get("/business-data/transfer-requirements", ({ request }) => {
    const params = new URL(request.url).searchParams;
    return HttpResponse.json(
      getTransferRequirementPage({
        page: Number(params.get("page") ?? 1),
        limit: Number(params.get("limit") ?? 20),
        q: params.get("q") ?? undefined,
        state: params.get("state") ?? undefined,
      }),
    );
  }),
  http.get("/business-data/transfer-requirements/:name", ({ params }) => {
    const detail = getTransferRequirementDetail(decodeURIComponent(params.name as string));
    if (!detail) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    return HttpResponse.json(detail);
  }),
];
