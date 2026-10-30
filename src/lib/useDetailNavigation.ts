import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";

type DetailRoute = "/administration/ai-agent/$name" | "/administration/ai-mcp-server/$name";

export function useDetailNavigation(detailRoute: DetailRoute, openRoute: (route: string) => void) {
  const navigate = useNavigate();
  return useCallback(
    (name: string) => {
      openRoute(`${detailRoute.replace("/$name", "")}/${encodeURIComponent(name)}`);
      navigate({ to: detailRoute, params: { name } });
    },
    [navigate, openRoute, detailRoute],
  );
}
