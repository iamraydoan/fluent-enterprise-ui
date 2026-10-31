import { createFileRoute } from "@tanstack/react-router";
import { SendAheadRunDetailPage } from "@/features/business-data/send-ahead-run/SendAheadRunDetailPage";

function SendAheadRunDetailRoute() {
  const { name } = Route.useParams();
  return <SendAheadRunDetailPage name={name} />;
}

export const Route = createFileRoute("/business-data/send-ahead-run/$name")({
  component: SendAheadRunDetailRoute,
});
