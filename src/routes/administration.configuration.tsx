import { createFileRoute } from "@tanstack/react-router";
import { ConfigurationListPage } from "@/features/configuration/ConfigurationListPage";

export const Route = createFileRoute("/administration/configuration")({
  component: ConfigurationListPage,
});
