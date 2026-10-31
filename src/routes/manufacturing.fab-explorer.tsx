import { createFileRoute } from "@tanstack/react-router";
import { FabExplorerPage } from "@/features/manufacturing/fab-explorer/FabExplorerPage";

export const Route = createFileRoute("/manufacturing/fab-explorer")({
  component: FabExplorerPage,
  validateSearch: (search: Record<string, unknown>) => ({
    level: (search.level as string) ?? "enterprises",
    enterprise: (search.enterprise as string) ?? "",
    site: (search.site as string) ?? "",
    facility: (search.facility as string) ?? "",
    area: (search.area as string) ?? "",
    step: (search.step as string) ?? "",
    resource: (search.resource as string) ?? "",
  }),
});
