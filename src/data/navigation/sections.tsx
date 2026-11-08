import {
  Code20Regular,
  DataBarVertical20Regular,
  Database20Regular,
  Flow20Regular,
  Server20Regular,
  Settings20Regular,
  ShieldCheckmark20Regular,
  Sparkle20Filled,
  Target20Regular,
  Toolbox20Regular,
  Window20Regular,
  Wrench20Regular,
} from "@/components/icons";
import type { NavigationSection } from "./types";

export const NAVIGATION_SECTIONS: NavigationSection[] = [
  {
    id: "ai",
    labelKey: "nav.sections.ai",
    icon: <Sparkle20Filled style={{ color: "#4F8CFF" }} />,
    route: "/ai",
  },
  {
    id: "administration",
    labelKey: "nav.sections.administration",
    icon: <Wrench20Regular />,
    route: "/administration",
  },
  { id: "low-code", labelKey: "nav.sections.lowCode", icon: <Code20Regular />, route: "/low-code" },
  {
    id: "business-data",
    labelKey: "nav.sections.businessData",
    icon: <Database20Regular />,
    route: "/business-data",
  },
  {
    id: "manufacturing",
    labelKey: "nav.sections.manufacturing",
    icon: <Settings20Regular />,
    route: "/manufacturing",
  },
  {
    id: "maintenance",
    labelKey: "nav.sections.maintenance",
    icon: <Toolbox20Regular />,
    route: "/maintenance",
  },
  {
    id: "quality",
    labelKey: "nav.sections.quality",
    icon: <ShieldCheckmark20Regular />,
    route: "/quality",
  },
  {
    id: "planning-and-logistics",
    labelKey: "nav.sections.planningAndLogistics",
    icon: <Flow20Regular />,
    route: "/planning-and-logistics",
  },
  {
    id: "business-intelligence",
    labelKey: "nav.sections.businessIntelligence",
    icon: <DataBarVertical20Regular />,
    route: "/business-intelligence",
  },
  {
    id: "automation",
    labelKey: "nav.sections.automation",
    icon: <Target20Regular />,
    route: "/automation",
  },
  {
    id: "data-platform",
    labelKey: "nav.sections.dataPlatform",
    icon: <Server20Regular />,
    route: "/data-platform",
  },
  { id: "apps", labelKey: "nav.sections.apps", icon: <Window20Regular />, route: "/apps" },
  {
    id: "settings",
    labelKey: "nav.sections.settings",
    icon: <Settings20Regular />,
    route: "/settings",
  },
];

export function getNavigationSection(sectionId: string) {
  return NAVIGATION_SECTIONS.find((section) => section.id === sectionId);
}
