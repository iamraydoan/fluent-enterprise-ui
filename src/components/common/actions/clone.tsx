import type { HeaderAction } from "@/components/common/ListPageHeader";
import { Copy24Regular } from "@/components/icons";

export const cloneAction: HeaderAction = {
  id: "clone",
  icon: <Copy24Regular />,
  labelKey: "actionBar.clone",
};
