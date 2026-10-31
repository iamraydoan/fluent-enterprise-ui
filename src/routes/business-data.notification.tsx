import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { NotificationListPage } from "@/features/business-data/notification/NotificationListPage";

function NotificationRoute() {
  const location = useLocation();
  if (location.pathname === "/business-data/notification") return <NotificationListPage />;
  return <Outlet />;
}

export const Route = createFileRoute("/business-data/notification")({
  component: NotificationRoute,
});
