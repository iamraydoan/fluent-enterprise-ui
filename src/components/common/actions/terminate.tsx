import type { HeaderAction } from "@/components/common/ListPageHeader";
import { Prohibited24Regular } from "@/components/icons";

export const terminateAction: HeaderAction = {
  id: "terminate",
  icon: <Prohibited24Regular />,
  labelKey: "actionBar.terminate",
};
