import type { HeaderAction } from "@/components/common/ListPageHeader";
import { ArrowDownload24Regular } from "@/components/icons";

export const downloadLbosAction: HeaderAction = {
  id: "download-lbos",
  icon: <ArrowDownload24Regular />,
  labelKey: "actionBar.downloadLbos",
};
