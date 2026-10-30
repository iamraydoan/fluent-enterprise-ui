import type { HeaderAction } from "@/components/common/ListPageHeader";
import { Code20Regular } from "@/components/icons";

export const generateAction: HeaderAction = {
  id: "generate",
  icon: <Code20Regular />,
  labelKey: "actionBar.generate",
};
