import { createFileRoute } from "@tanstack/react-router";
import { DataCollectionDetailPage } from "@/features/business-data/data-collection/DataCollectionDetailPage";

export const Route = createFileRoute("/business-data/data-collection/$name")({
  component: DataCollectionDetailPage,
});
