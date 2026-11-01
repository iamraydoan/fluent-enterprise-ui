import { useState } from "react";
import { useGenericTable } from "@/api";
import { Empty, Panel, HStack, VStack  } from "@/components/common";
import { Table24Regular } from "@/components/icons";
import { Body1Strong, Caption1, makeStyles, Tab, TabList, Text } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { cardSurface } from "@/styles/shared";
import { theme } from "@/styles/theme";
import { GenericTableDataTab } from "./GenericTableDataTab";
import { GenericTableDefinitionTab } from "./GenericTableDefinitionTab";

const useDetailStyles = makeStyles({
  page: {
    height: "100%",
    minHeight: 0,
  },
  tabBar: {
    padding: "0 16px",
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
    backgroundColor: theme.color.surface,
  },
  titleStrip: {
    padding: "10px 16px",
    backgroundColor: theme.color.surface,
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
  },
  content: {
    flexGrow: 1,
    minHeight: 0,
    overflow: "auto",
    padding: "12px",
    ...cardSurface,
    margin: "12px",
  },
});

interface GenericTableDetailPageProps {
  name: string;
}

export function GenericTableDetailPage({ name }: GenericTableDetailPageProps) {
  const { t } = useAppTranslation();
  const styles = useDetailStyles();
  const { data, isLoading } = useGenericTable(name);
  const [tab, setTab] = useState("data");

  if (isLoading || data === undefined) {
    return null;
  }

  return (
    <VStack className={styles.page}>
      <HStack gap="4px" align="center" className={styles.tabBar}>
        <TabList selectedValue={tab} onTabSelect={setTab} aria-label={t("genericTables.pageLabel")}>
          <Tab value="data">{t("genericTables.tabs.data")}</Tab>
          <Tab value="definition">{t("genericTables.tabs.definition")}</Tab>
          <Tab value="history">{t("genericTables.tabs.history")}</Tab>
        </TabList>
      </HStack>
      <HStack gap="8px" align="center" className={styles.titleStrip}>
        <Table24Regular />
        <Text weight="semibold" size={400}>
          {data.name}
        </Text>
        <Text size={300}>({data.state})</Text>
      </HStack>
      <div className={styles.content}>
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
      </div>
    </VStack>
  );
}
