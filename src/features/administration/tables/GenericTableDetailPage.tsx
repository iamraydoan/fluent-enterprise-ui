import { useState } from "react";
import { useGenericTable } from "@/api";
import { Empty, Panel, RecordPage } from "@/components/common";
import { Table24Regular } from "@/components/icons";
import { Body1Strong, Caption1, Tab, TabList, Text } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { GenericTableDataTab } from "./GenericTableDataTab";
import { GenericTableDefinitionTab } from "./GenericTableDefinitionTab";

interface GenericTableDetailPageProps {
  name: string;
}

export function GenericTableDetailPage({ name }: GenericTableDetailPageProps) {
  const { t } = useAppTranslation();
  const { data, isLoading } = useGenericTable(name);
  const [tab, setTab] = useState("data");

  if (isLoading || data === undefined) {
    return null;
  }

  return (
    <RecordPage
      tabs={
        <TabList selectedValue={tab} onTabSelect={setTab} aria-label={t("genericTables.pageLabel")}>
          <Tab value="data">{t("genericTables.tabs.data")}</Tab>
          <Tab value="definition">{t("genericTables.tabs.definition")}</Tab>
          <Tab value="history">{t("genericTables.tabs.history")}</Tab>
        </TabList>
      }
      title={
        <>
          <Table24Regular />
          <Text weight="semibold" size={400}>
            {data.name}
          </Text>
          <Text size={300}>({data.state})</Text>
        </>
      }
    >
      {tab === "data" && <GenericTableDataTab table={data} />}
      {tab === "definition" && <GenericTableDefinitionTab table={data} />}
      {tab === "history" && (
        <Panel>
          <Empty>
            <Body1Strong>{t("genericTables.history.empty")}</Body1Strong>
            <Caption1>{t("genericTables.history.emptyBody")}</Caption1>
          </Empty>
        </Panel>
      )}
    </RecordPage>
  );
}
