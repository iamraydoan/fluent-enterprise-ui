import { createFileRoute } from "@tanstack/react-router";
import { EntityTypesListPage } from "@/features/entity-types/EntityTypesListPage";

export const Route = createFileRoute("/administration/entity-types")({
  component: EntityTypesListPage,
});
