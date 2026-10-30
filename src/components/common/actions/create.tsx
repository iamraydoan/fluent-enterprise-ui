import type { HeaderAction } from "@/components/common/ListPageHeader";
import { Add24Regular } from "@/components/icons";

export const createAction: HeaderAction = {
  id: "create",
  icon: <Add24Regular />,
  labelKey: "actionBar.create",
};
