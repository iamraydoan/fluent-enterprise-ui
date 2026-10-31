import { createFileRoute } from "@tanstack/react-router";
import { CalendarDetailPage } from "@/features/business-data/calendar/CalendarDetailPage";

export const Route = createFileRoute("/business-data/calendar/$name")({
  component: CalendarDetailPage,
});
