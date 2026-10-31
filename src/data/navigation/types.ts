import type { ReactElement } from "react";
import type { TranslationKey } from "@/i18n";

export interface NavigationSection {
  id: string;
  labelKey: TranslationKey;
  icon: ReactElement;
  route: string;
}

export interface AdministrationTile {
  id: string;
  labelKey: TranslationKey;
  icon: ReactElement;
  route: string;
}

export interface BreadcrumbItem {
  labelKey: TranslationKey | null;
  label: string | null;
  route: string;
}

export interface RouteTabInfo {
  id: string;
  route: string;
  titleKey: TranslationKey | null;
  title: string | null;
  parentRoute: string | null;
}

