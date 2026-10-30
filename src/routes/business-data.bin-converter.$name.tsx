import { createFileRoute } from "@tanstack/react-router";
import { BinConverterDetailPage } from "@/features/business-data/entities/bin-converter/BinConverterDetailPage";

export const Route = createFileRoute("/business-data/bin-converter/$name")({
  component: BinConverterDetailPage,
});
