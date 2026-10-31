import { createFileRoute } from "@tanstack/react-router";
import { ChangeSetDetailPage } from "@/features/business-data/change-set/ChangeSetDetailPage";

export const Route = createFileRoute("/business-data/change-set/$name")({
  component: ChangeSetDetailPage,
});
