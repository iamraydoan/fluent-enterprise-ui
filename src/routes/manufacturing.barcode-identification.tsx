import { createFileRoute } from "@tanstack/react-router";
import { BarcodeIdentificationPage } from "@/features/manufacturing/barcode-identification/BarcodeIdentificationPage";

export const Route = createFileRoute("/manufacturing/barcode-identification")({
  component: BarcodeIdentificationPage,
});
