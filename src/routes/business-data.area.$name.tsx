import { createFileRoute } from "@tanstack/react-router";
import { AreaDetailPage } from "@/features/business-data/entities/area/AreaDetailPage";

export const Route = createFileRoute("/business-data/area/$name")({
  component: AreaDetailPage,
});
