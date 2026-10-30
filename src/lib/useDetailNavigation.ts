import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";

type DetailRoute =
  | "/administration/ai-agent/$name"
  | "/administration/ai-mcp-server/$name"
  | "/administration/configuration/$path"
  | "/administration/entity-types/$name"
  | "/administration/queries/$name"
  | "/administration/tables/$name"
  | "/business-data/area/$name"
  | "/business-data/batch/$name"
  | "/business-data/bom/$name"
  | "/business-data/bin-converter/$name"
  | "/business-data/business-partner/$name"
  | "/business-data/calendar/$name"
  | "/business-data/certification/$name"
  | "/business-data/change-set/$name"
  | "/business-data/chart/$name"
  | "/business-data/checklist/$name"
  | "/business-data/container/$name"
  | "/business-data/data-collection/$name"
  | "/business-data/data-collection-limit-set/$name"
  | "/business-data/data-silo/$name"
  | "/business-data/document/$name"
  | "/business-data/employee/$name"
  | "/business-data/enterprise/$name"
  | "/business-data/experiment-definition/$name"
  | "/business-data/facility/$name"
  | "/business-data/flow/$name"
  | "/business-data/inspection-plan/$name"
  | "/business-data/kpi/$name"
  | "/business-data/maintenance-activity-order/$name"
  | "/business-data/maintenance-plan/$name"
  | "/business-data/map/$name"
  | "/business-data/map-definition/$name"
  | "/business-data/material/$name"
  | "/business-data/material-transfer/$name"
  | "/business-data/notification/$name"
  | "/business-data/package/$name"
  | "/business-data/parameter/$name"
  | "/business-data/product/$name"
  | "/business-data/production-order/$name"
  | "/business-data/protocol/$name"
  | "/business-data/periodic-inventory/$name"
  | "/business-data/pick-list/$name"
  | "/business-data/plan/$name"
  | "/business-data/printable-document/$name"
  | "/business-data/product-group/$name"
  | "/business-data/qualification/$name"
  | "/business-data/qualification-check/$name"
  | "/business-data/reason/$name"
  | "/business-data/recipe/$name"
  | "/business-data/resource/$name"
  | "/business-data/resource-job/$name"
  | "/business-data/sampling-pattern/$name"
  | "/business-data/sampling-plan/$name"
  | "/business-data/schedule/$name"
  | "/business-data/schedule-scenario/$name"
  | "/business-data/send-ahead-run/$name"
  | "/business-data/service/$name"
  | "/business-data/setup-matrix/$name";

export function useDetailNavigation(detailRoute: DetailRoute, openRoute: (route: string) => void) {
  const navigate = useNavigate();
  return useCallback(
    (value: string) => {
      const base = detailRoute.replace(/\/\$[^/]+$/, "");
      openRoute(`${base}/${encodeURIComponent(value)}`);
      if (detailRoute === "/administration/configuration/$path") {
        navigate({ to: detailRoute, params: { path: value } });
      } else {
        navigate({ to: detailRoute, params: { name: value } });
      }
    },
    [navigate, openRoute, detailRoute],
  );
}
