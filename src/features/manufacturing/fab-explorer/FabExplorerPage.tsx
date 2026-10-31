import { useNavigate, useSearch } from "@tanstack/react-router";
import { ListPage } from "@/components/common";
import { Box24Regular } from "@/components/icons";
import { useAppTranslation } from "@/i18n";
import { FAB_LEVELS } from "./fabLevels";
import type { FabLevel } from "./fabLevels";
import { AreaView } from "./views/AreaView";
import { EnterprisesView } from "./views/EnterprisesView";
import { FacilitiesView } from "./views/FacilitiesView";
import { FacilityView } from "./views/FacilityView";
import { ResourceView } from "./views/ResourceView";
import { SitesView } from "./views/SitesView";
import { StepView } from "./views/StepView";

export interface FabNavigation {
  level: FabLevel;
  enterprise: string;
  site: string;
  facility: string;
  area: string;
  step: string;
  resource: string;
}

export function FabExplorerPage() {
  const { t } = useAppTranslation();
  const search = useSearch({ from: "/manufacturing/fab-explorer" });
  const navigate = useNavigate({ from: "/manufacturing/fab-explorer" });

  const nav: FabNavigation = {
    level: (search.level as FabLevel) ?? FAB_LEVELS.enterprises,
    enterprise: (search.enterprise as string) ?? "",
    site: (search.site as string) ?? "",
    facility: (search.facility as string) ?? "",
    area: (search.area as string) ?? "",
    step: (search.step as string) ?? "",
    resource: (search.resource as string) ?? "",
  };

  const go = (patch: Partial<FabNavigation>) => {
    navigate({
      search: {
        level: patch.level ?? nav.level,
        enterprise: patch.enterprise ?? nav.enterprise,
        site: patch.site ?? nav.site,
        facility: patch.facility ?? nav.facility,
        area: patch.area ?? nav.area,
        step: patch.step ?? nav.step,
        resource: patch.resource ?? nav.resource,
      },
    });
  };

  const getTitle = (): string => {
    switch (nav.level) {
      case FAB_LEVELS.sites:
        return nav.enterprise || t("fabExplorer.pageTitle");
      case FAB_LEVELS.facilities:
        return nav.site || nav.enterprise || t("fabExplorer.pageTitle");
      case FAB_LEVELS.facility:
        return nav.facility || t("fabExplorer.pageTitle");
      case FAB_LEVELS.area:
        return nav.area || t("fabExplorer.pageTitle");
      case FAB_LEVELS.step:
        return nav.step || t("fabExplorer.pageTitle");
      case FAB_LEVELS.resource:
        return nav.resource || t("fabExplorer.pageTitle");
      default:
        return t("fabExplorer.pageTitle");
    }
  };

  const renderView = () => {
    const common = { nav, go };
    switch (nav.level) {
      case FAB_LEVELS.sites:
        return <SitesView {...common} />;
      case FAB_LEVELS.facilities:
        return <FacilitiesView {...common} />;
      case FAB_LEVELS.facility:
        return <FacilityView {...common} />;
      case FAB_LEVELS.area:
        return (
          <AreaView
            {...common}
            onSelectStep={(stepName) => go({ level: FAB_LEVELS.step, step: stepName })}
            onSelectResource={(resourceName) =>
              go({ level: FAB_LEVELS.resource, resource: resourceName })
            }
          />
        );
      case FAB_LEVELS.step:
        return <StepView name={nav.step} onBack={() => go({ level: FAB_LEVELS.area })} />;
      case FAB_LEVELS.resource:
        return <ResourceView name={nav.resource} onBack={() => go({ level: FAB_LEVELS.area })} />;
      default:
        return <EnterprisesView {...common} />;
    }
  };

  return (
    <ListPage
      header={{
        icon: <Box24Regular />,
        title: getTitle(),
        actions: [],
      }}
    >
      {renderView()}
    </ListPage>
  );
}
