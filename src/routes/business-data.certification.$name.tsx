import { createFileRoute } from "@tanstack/react-router";
import { CertificationDetailPage } from "@/features/business-data/entities/certification/CertificationDetailPage";

export const Route = createFileRoute("/business-data/certification/$name")({
  component: CertificationDetailPage,
});
