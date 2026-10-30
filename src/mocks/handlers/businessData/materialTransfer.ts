import { http, HttpResponse } from "msw";
import {
  buildMaterialTransferDetail,
  queryMaterialTransfers,
} from "../../seeds/businessData/materialTransfer";

export const materialTransferHandlers = [
  http.get("/business-data/material-transfers", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryMaterialTransfers(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/material-transfers/:name", ({ params }) => {
    const name = decodeURIComponent(params.name as string);
    return HttpResponse.json(buildMaterialTransferDetail(name));
  }),
];
