import { createFileRoute } from "@tanstack/react-router";
import { AppsListPage } from "@/features/administration/apps/AppsListPage";

export const Route = createFileRoute("/administration/apps")({
  component: AppsListPage,
});
