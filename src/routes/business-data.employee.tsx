import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { EmployeeListPage } from "@/features/business-data/entities/employee/EmployeeListPage";

function EmployeeRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/employee") return <EmployeeListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/employee")({
  component: EmployeeRoute,
});
