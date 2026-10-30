import { createFileRoute } from "@tanstack/react-router";
import { ChartDetailPage } from "@/features/business-data/entities/chart/ChartDetailPage";

export const Route = createFileRoute("/business-data/chart/$name")({
  component: ChartDetailPage,
});
