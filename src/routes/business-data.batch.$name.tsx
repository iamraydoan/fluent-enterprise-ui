import { createFileRoute } from "@tanstack/react-router";
import { BatchDetailPage } from "@/features/business-data/batch/BatchDetailPage";

export const Route = createFileRoute("/business-data/batch/$name")({
  component: BatchDetailPage,
});
