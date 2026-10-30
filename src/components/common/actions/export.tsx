import type { HeaderAction } from "@/components/common/ListPageHeader";
import { ArrowExportUp24Regular } from "@/components/icons";

export const exportAction: HeaderAction = {
  id: "export",
  icon: <ArrowExportUp24Regular style={{ transform: "rotate(180deg)" }} />,
  labelKey: "actionBar.export",
};
