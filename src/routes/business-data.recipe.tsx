import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { RecipeListPage } from "@/features/business-data/entities/recipe/RecipeListPage";

function RecipeRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/recipe") return <RecipeListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/recipe")({
  component: RecipeRoute,
});
