import type { HeaderAction } from "@/components/common/ListPageHeader";
import { Flash24Regular } from "@/components/icons";

export const executeAction: HeaderAction = {
  id: "execute",
  icon: <Flash24Regular />,
  labelKey: "actionBar.execute",
};
