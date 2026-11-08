import { createFileRoute } from "@tanstack/react-router";
import { ThemeSettingsPage } from "@/features/settings/ThemeSettingsPage";

export const Route = createFileRoute("/settings")({
  component: ThemeSettingsPage,
});
