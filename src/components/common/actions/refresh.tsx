import type { HeaderAction } from "@/components/common/ListPageHeader";
import { ArrowSync24Regular } from "@/components/icons";

export const refreshAction: HeaderAction = {
  id: "refresh",
  icon: <ArrowSync24Regular />,
  labelKey: "actionBar.refresh",
};
