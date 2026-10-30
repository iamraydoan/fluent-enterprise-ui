import { createFileRoute } from "@tanstack/react-router";
import { UIPagesPage } from "@/features/ui-pages/UIPagesPage";

export const Route = createFileRoute("/administration/uipages")({
  component: UIPagesPage,
});
