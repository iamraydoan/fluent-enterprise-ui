import { createFileRoute } from "@tanstack/react-router";
import { BinConverterDetailPage } from "@/features/business-data/bin-converter/BinConverterDetailPage";

export const Route = createFileRoute("/business-data/bin-converter/$name")({
  component: BinConverterDetailPage,
});
