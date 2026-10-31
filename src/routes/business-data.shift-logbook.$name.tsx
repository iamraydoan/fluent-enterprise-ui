import { createFileRoute } from "@tanstack/react-router";
import { ShiftLogbookDetailPage } from "@/features/business-data/shift-logbook/ShiftLogbookDetailPage";

function ShiftLogbookDetailRoute() {
  const { name } = Route.useParams();
  return <ShiftLogbookDetailPage name={decodeURIComponent(name)} />;
}

export const Route = createFileRoute("/business-data/shift-logbook/$name")({
  component: ShiftLogbookDetailRoute,
});
