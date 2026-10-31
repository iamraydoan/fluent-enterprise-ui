import { createFileRoute } from "@tanstack/react-router";
import { NotificationDetailPage } from "@/features/business-data/notification/NotificationDetailPage";

function NotificationDetailRoute() {
  const { name } = Route.useParams();
  return <NotificationDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/notification/$name")({
  component: NotificationDetailRoute,
});
