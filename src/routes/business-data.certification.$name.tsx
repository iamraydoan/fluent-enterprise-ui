import { createFileRoute } from "@tanstack/react-router";
import { CertificationDetailPage } from "@/features/business-data/certification/CertificationDetailPage";

export const Route = createFileRoute("/business-data/certification/$name")({
  component: CertificationDetailPage,
});
