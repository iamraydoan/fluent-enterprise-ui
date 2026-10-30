import { useMemo } from "react";
import { RecordState, useApps } from "@/api";
import type { AppRecord } from "@/api";
import { ListPage, RECORD_STATE_LABELS, SimpleTableCard } from "@/components/common";
import type { DataColumn } from "@/components/common";
import { Add24Regular, ArrowSync24Regular, Window20Regular } from "@/components/icons";
import { Badge } from "@/components/ui";
import { useAppTranslation } from "@/i18n";

const STATE_COLORS: Record<RecordState, "success" | "informative" | "danger"> = {
  [RecordState.Active]: "success",
  [RecordState.Draft]: "informative",
  [RecordState.Terminated]: "danger",
};

export function AppsListPage() {
  const { t } = useAppTranslation();
  const columns = useMemo<DataColumn<AppRecord>[]>(
    () => [
      { key: "name", labelKey: "apps.columns.app" },
      { key: "description", labelKey: "apps.columns.description" },
      {
        key: "type",
        labelKey: "apps.columns.type",
        render: (row) => t(row.type === "System" ? "apps.types.system" : "apps.types.userDefined"),
      },
      {
        key: "state",
        labelKey: "apps.columns.state",
        render: (row) => (
          <Badge appearance="tint" shape="rounded" size="small" color={STATE_COLORS[row.state]}>
            {t(RECORD_STATE_LABELS[row.state])}
          </Badge>
        ),
      },
    ],
    [t],
  );
  return (
    <ListPage
      header={{
        icon: <Window20Regular />,
        title: t("apps.pageLabel"),
        actions: [
          { icon: <Add24Regular />, label: t("actionBar.create") },
          { icon: <ArrowSync24Regular />, label: t("actionBar.refresh") },
        ],
      }}
    >
      <SimpleTableCard
        title={(count) => t("apps.listTitle", { count })}
        ariaLabel={t("apps.pageLabel")}
        columns={columns}
        useListQuery={useApps}
        getRowId={(row) => row.name}
      />
    </ListPage>
  );
}
