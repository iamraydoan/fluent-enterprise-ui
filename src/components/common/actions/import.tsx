import type { HeaderAction } from "@/components/common/ListPageHeader";
import { ArrowDownload24Regular } from "@/components/icons";

export const importAction: HeaderAction = {
  id: "import",
  icon: <ArrowDownload24Regular />,
  labelKey: "actionBar.import",
};
