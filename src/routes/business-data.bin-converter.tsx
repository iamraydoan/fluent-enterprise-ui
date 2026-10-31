import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { BinConverterListPage } from "@/features/business-data/bin-converter/BinConverterListPage";

function BinConverterRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/bin-converter") return <BinConverterListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/bin-converter")({
  component: BinConverterRoute,
});
