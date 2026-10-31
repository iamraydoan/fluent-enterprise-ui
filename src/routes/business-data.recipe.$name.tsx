import { createFileRoute } from "@tanstack/react-router";
import { RecipeDetailPage } from "@/features/business-data/recipe/RecipeDetailPage";

function RecipeDetailRoute() {
  const { name } = Route.useParams();
  return <RecipeDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/recipe/$name")({
  component: RecipeDetailRoute,
});
