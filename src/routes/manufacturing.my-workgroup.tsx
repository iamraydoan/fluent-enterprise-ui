import { createFileRoute } from "@tanstack/react-router";
import { MyWorkgroupPage } from "@/features/manufacturing/my-workgroup/MyWorkgroupPage";

export const Route = createFileRoute("/manufacturing/my-workgroup")({
  component: MyWorkgroupPage,
});
