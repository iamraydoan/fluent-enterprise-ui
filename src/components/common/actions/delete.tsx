import type { HeaderAction } from "@/components/common/ListPageHeader";
import { Delete20Regular } from "@/components/icons";

export const deleteAction: HeaderAction = {
  id: "delete",
  icon: <Delete20Regular />,
  labelKey: "actionBar.delete",
};
