import { createFileRoute } from "@tanstack/react-router";
import { ContainerDetailPage } from "@/features/business-data/container/ContainerDetailPage";

export const Route = createFileRoute("/business-data/container/$name")({
  component: ContainerDetailPage,
});
