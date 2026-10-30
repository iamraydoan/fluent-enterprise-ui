import { createFileRoute } from "@tanstack/react-router";
import { DataCollectionLimitSetDetailPage } from "@/features/business-data/entities/data-collection-limit-set/DataCollectionLimitSetDetailPage";

export const Route = createFileRoute("/business-data/data-collection-limit-set/$name")({
  component: DataCollectionLimitSetDetailPage,
});
