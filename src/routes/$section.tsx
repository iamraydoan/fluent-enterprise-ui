import { createFileRoute } from "@tanstack/react-router";
import { getNavigationSection } from "@/data/navigation";
import { PlaceholderPage } from "@/features/administration/PlaceholderPage";

function SectionRoute() {
  const { section } = Route.useParams();
  const sectionDef = getNavigationSection(section);
  if (!sectionDef) {
    return <PlaceholderPage title="Page not found" body="This page does not exist." />;
  }
  return <PlaceholderPage title={sectionDef.label} body="This page is not yet implemented" />;
}

export const Route = createFileRoute("/$section")({
  component: SectionRoute,
});
