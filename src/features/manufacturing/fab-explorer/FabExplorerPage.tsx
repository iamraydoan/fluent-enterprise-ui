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
import { SitesView } from "./views/SitesView";

export interface FabNavigation {
  level: FabLevel;
  enterprise: string;
  site: string;
  facility: string;
  area: string;
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
  };

  const go = (patch: Partial<FabNavigation>) => {
    navigate({
      search: {
        level: patch.level ?? nav.level,
        enterprise: patch.enterprise ?? nav.enterprise,
        site: patch.site ?? nav.site,
        facility: patch.facility ?? nav.facility,
        area: patch.area ?? nav.area,
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
            onSelectStep={() => go({ level: FAB_LEVELS.area, area: nav.area })}
            onSelectResource={() => go({ level: FAB_LEVELS.area, area: nav.area })}
          />
        );
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
