import type { TranslationKey } from "@/i18n";

export interface DetailMoreAction {
  id: string;
  labelKey: TranslationKey;
}

export const workgroupMoreActions: DetailMoreAction[] = [
  { id: "clone", labelKey: "businessData.workgroup.clone.menuLabel" },
  { id: "terminate", labelKey: "businessData.workgroup.terminate.menuLabel" },
  { id: "unterminate", labelKey: "businessData.workgroup.unterminate.menuLabel" },
  { id: "manageUserWorkgroups", labelKey: "businessData.workgroup.manageUserWorkgroups.menuLabel" },
  { id: "manageRoleWorkspaces", labelKey: "businessData.workgroup.manageRoleWorkspaces.menuLabel" },
];
