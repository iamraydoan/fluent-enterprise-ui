import { createFileRoute } from "@tanstack/react-router";
import { ChecklistDetailPage } from "@/features/business-data/checklist/ChecklistDetailPage";

export const Route = createFileRoute("/business-data/checklist/$name")({
  component: ChecklistDetailPage,
});
