import type { HeaderAction } from "@/components/common/ListPageHeader";
import { PlugConnected24Regular } from "@/components/icons";

export const endpointAction: HeaderAction = {
  id: "endpoint",
  icon: <PlugConnected24Regular />,
  labelKey: "actionBar.endpoint",
};
