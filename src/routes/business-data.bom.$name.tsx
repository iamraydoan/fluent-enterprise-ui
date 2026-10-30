import { createFileRoute } from "@tanstack/react-router";
import { BomDetailPage } from "@/features/business-data/entities/bom/BomDetailPage";

export const Route = createFileRoute("/business-data/bom/$name")({
  component: BomDetailPage,
});
