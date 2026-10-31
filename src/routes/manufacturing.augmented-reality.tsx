import { createFileRoute } from "@tanstack/react-router";
import { AugmentedRealityPage } from "@/features/manufacturing/augmented-reality/AugmentedRealityPage";

export const Route = createFileRoute("/manufacturing/augmented-reality")({
  component: AugmentedRealityPage,
});
