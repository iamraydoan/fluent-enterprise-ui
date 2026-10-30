import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";

type DetailRoute =
  | "/administration/ai-agent/$name"
  | "/administration/ai-mcp-server/$name"
  | "/administration/configuration/$path"
  | "/administration/entity-types/$name"
  | "/administration/queries/$name"
  | "/administration/tables/$name"
  | "/business-data/shift-definition/$name"
  | "/business-data/shift-logbook/$name"
  | "/business-data/shift-plan/$name"
  | "/business-data/site/$name"
  | "/business-data/sort-rule-set/$name"
  | "/business-data/step/$name";

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
