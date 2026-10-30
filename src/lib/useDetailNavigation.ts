import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";

type DetailRoute =
  | "/administration/ai-agent/$name"
  | "/administration/ai-mcp-server/$name"
  | "/administration/configuration/$path"
  | "/administration/entity-types/$name"
  | "/administration/queries/$name"
  | "/administration/tables/$name"
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
  | "/business-data/product-group/$name";

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
