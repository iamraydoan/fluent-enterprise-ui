import { createFileRoute } from "@tanstack/react-router";
import { EntityTypesPage } from "@/features/entity-types/EntityTypesPage";

export const Route = createFileRoute("/administration/entity-types")({
  component: EntityTypesPage,
});
