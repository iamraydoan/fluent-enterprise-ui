import { createFileRoute } from "@tanstack/react-router";
import { BatchDetailPage } from "@/features/business-data/entities/batch/BatchDetailPage";

export const Route = createFileRoute("/business-data/batch/$name")({
  component: BatchDetailPage,
});
