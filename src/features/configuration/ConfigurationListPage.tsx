import { useMemo } from "react";
import { useConfigurations } from "@/api";
import type { ConfigurationRecord } from "@/api";
import { ListPage, SimpleTableCard } from "@/components/common";
import type { DataColumn } from "@/components/common";
import { Add24Regular, ArrowSync24Regular, Wrench20Regular } from "@/components/icons";
import { useAppTranslation } from "@/i18n";

export function ConfigurationListPage() {
  const { t } = useAppTranslation();
  const columns = useMemo<DataColumn<ConfigurationRecord>[]>(
    () => [
      { key: "setting", labelKey: "configuration.columns.setting" },
      { key: "value", labelKey: "configuration.columns.value" },
      { key: "scope", labelKey: "configuration.columns.scope" },
      { key: "modified", labelKey: "configuration.columns.modified" },
    ],
    [],
  );
  return (
    <ListPage
      header={{
        icon: <Wrench20Regular />,
        title: t("configuration.pageLabel"),
        actions: [
          { icon: <Add24Regular />, label: t("actionBar.create") },
          { icon: <ArrowSync24Regular />, label: t("actionBar.refresh") },
        ],
      }}
    >
      <SimpleTableCard
        title={(count) => t("configuration.listTitle", { count })}
        ariaLabel={t("configuration.pageLabel")}
        columns={columns}
        useListQuery={useConfigurations}
        getRowId={(row) => row.setting}
      />
    </ListPage>
  );
}
