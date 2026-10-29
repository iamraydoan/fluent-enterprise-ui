import { useNavigate } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import { useAiAgents } from "@/api";
import type { AiAgentRecord } from "@/api";
import {
  DataTableCard,
  ListPageHeader,
  RECORD_STATE_LABELS,
  RECORD_STATE_OPTIONS,
} from "@/components/common";
import {
  Add24Regular,
  ArrowSync24Regular,
  Bot20Regular,
  Search20Regular,
} from "@/components/icons";
import { useAppTranslation } from "@/i18n";
import { useTabsStore } from "@/stores/tabs-store";
import { useSharedStyles } from "@/styles/shared";

const columnHelper = createColumnHelper<AiAgentRecord>();

export function AiAgentListPage() {
  const { t } = useAppTranslation();
  const sharedStyles = useSharedStyles();
  const openRoute = useTabsStore((state) => state.openRoute);
  const navigate = useNavigate();
  const openDetail = useCallback(
    (name: string) => {
      const route = `/administration/ai-agent/${encodeURIComponent(name)}`;
      openRoute(route);
      navigate({ to: "/administration/ai-agent/$name", params: { name } });
    },
    [navigate, openRoute],
  );
  const columns = useMemo<ColumnDef<AiAgentRecord>[]>(
    () => [
      columnHelper.accessor("name", {
        header: () => t("aiAgent.columns.agent"),
        cell: (info) => (
          <a
            className={sharedStyles.tableLink}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              openDetail(info.getValue());
            }}
          >
            {info.getValue()}
          </a>
        ),
        meta: { labelKey: "aiAgent.columns.agent", locked: true, width: "25%" },
      }),
      columnHelper.accessor("description", {
        header: () => t("aiAgent.columns.description"),
        cell: (info) => info.getValue(),
        meta: { labelKey: "aiAgent.columns.description", width: "40%" },
      }),
      columnHelper.accessor("mcpServers", {
        header: () => t("aiAgent.columns.mcpServers"),
        cell: (info) => info.getValue(),
        meta: { labelKey: "aiAgent.columns.mcpServers", width: "15%" },
      }),
      columnHelper.accessor("state", {
        header: () => t("aiAgent.columns.state"),
        cell: (info) => t(RECORD_STATE_LABELS[info.getValue()] ?? "common.active"),
        meta: { labelKey: "aiAgent.columns.state", width: "20%" },
      }),
    ],
    [t, sharedStyles, openDetail],
  );
  return (
    <>
      <ListPageHeader
        icon={<Bot20Regular />}
        title={t("aiAgent.pageLabel")}
        actions={[
          { icon: <Add24Regular />, label: t("actionBar.create") },
          { icon: <ArrowSync24Regular />, label: t("actionBar.refresh") },
        ]}
      />

      <DataTableCard
        title={(count) => t("aiAgent.listTitle", { count })}
        ariaLabel={t("aiAgent.pageLabel")}
        columns={columns}
        stateOptions={RECORD_STATE_OPTIONS}
        searchIcon={<Search20Regular />}
        useListQuery={useAiAgents}
        getRowId={(row) => row.name}
        onRowClick={(row) => openDetail(row.name)}
      />
    </>
  );
}
