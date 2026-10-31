import {
  Cube24Regular,
  Navigation24Regular,
  Organization24Regular,
  QrCode20Regular,
  Target24Regular,
} from "@/components/icons";
import type { AdministrationTile } from "./types";

export const MANUFACTURING_PAGES: AdministrationTile[] = [
  {
    id: "augmented-reality",
    labelKey: "manufacturing.pages.augmentedReality",
    icon: <Cube24Regular />,
    route: "/manufacturing/augmented-reality",
  },
  {
    id: "barcode-identification",
    labelKey: "manufacturing.pages.barcodeIdentification",
    icon: <QrCode20Regular />,
    route: "/manufacturing/barcode-identification",
  },
  {
    id: "fab-explorer",
    labelKey: "manufacturing.pages.fabExplorer",
    icon: <Navigation24Regular />,
    route: "/manufacturing/fab-explorer",
  },
  {
    id: "fab-lives",
    labelKey: "manufacturing.pages.fabLives",
    icon: <Target24Regular />,
    route: "/manufacturing/fab-lives",
  },
  {
    id: "my-workgroup",
    labelKey: "manufacturing.pages.myWorkgroup",
    icon: <Organization24Regular />,
    route: "/manufacturing/my-workgroup",
  },
];
