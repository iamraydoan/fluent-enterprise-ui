import { http, HttpResponse } from "msw";
import type { BarcodeIdentificationSettings } from "@/api";
import {
  getBarcodeEntityInfo,
  getBarcodeIdentificationSettings,
  lookupBarcode,
  updateBarcodeIdentificationSettings,
} from "../../seeds/manufacturing/barcodeIdentification";

export const barcodeIdentificationHandlers = [
  http.get("/manufacturing/barcode-identification/lookup", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const code = params.get("code") ?? "";
    return HttpResponse.json(lookupBarcode(code));
  }),
  http.get("/manufacturing/barcode-identification/info", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const code = params.get("code") ?? "";
    return HttpResponse.json(getBarcodeEntityInfo(code));
  }),
  http.get("/manufacturing/barcode-identification/settings", () => {
    return HttpResponse.json(getBarcodeIdentificationSettings());
  }),
  http.put("/manufacturing/barcode-identification/settings", async ({ request }) => {
    const body = (await request.json()) as BarcodeIdentificationSettings;
    return HttpResponse.json(updateBarcodeIdentificationSettings(body));
  }),
];
