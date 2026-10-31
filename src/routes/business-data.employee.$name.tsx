import { createFileRoute } from "@tanstack/react-router";
import { EmployeeDetailPage } from "@/features/business-data/employee/EmployeeDetailPage";

function EmployeeDetailRoute() {
  const { name } = Route.useParams();
  return <EmployeeDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/employee/$name")({
  component: EmployeeDetailRoute,
});
