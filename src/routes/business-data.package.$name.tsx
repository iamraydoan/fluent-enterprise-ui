import { createFileRoute } from "@tanstack/react-router";
import { PackageDetailPage } from "@/features/business-data/package/PackageDetailPage";

function PackageDetailRoute() {
  const { name } = Route.useParams();
  return <PackageDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/package/$name")({
  component: PackageDetailRoute,
});
