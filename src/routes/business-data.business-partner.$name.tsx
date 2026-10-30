import { createFileRoute } from "@tanstack/react-router";
import { BusinessPartnerDetailPage } from "@/features/business-data/entities/business-partner/BusinessPartnerDetailPage";

export const Route = createFileRoute("/business-data/business-partner/$name")({
  component: BusinessPartnerDetailPage,
});
