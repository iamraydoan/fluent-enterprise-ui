import { createFileRoute } from "@tanstack/react-router";
import { getNavigationSection } from "@/data/navigation";
import { PlaceholderPage } from "@/features/administration/PlaceholderPage";
import { useAppTranslation } from "@/i18n";

function SectionRoute() {
  const { section } = Route.useParams();
  const { t } = useAppTranslation();
  const sectionDef = getNavigationSection(section);
  if (!sectionDef) {
    return (
      <PlaceholderPage
        title={t("placeholder.notFoundTitle")}
        body={t("placeholder.notFoundBody")}
      />
    );
  }
  return <PlaceholderPage title={t(sectionDef.labelKey)} icon={sectionDef.icon} />;
}

export const Route = createFileRoute("/$section")({
  component: SectionRoute,
});
