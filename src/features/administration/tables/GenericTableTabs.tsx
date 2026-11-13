import { Tab, TabList } from "@/components/ui";
import { useAppTranslation } from "@/i18n";

interface GenericTableTabsProps {
  selected: string;
  onSelect: (value: string) => void;
}

export function GenericTableTabs({ selected, onSelect }: GenericTableTabsProps) {
  const { t } = useAppTranslation();
  return (
    <TabList
      selectedValue={selected}
      onTabSelect={onSelect}
      aria-label={t("genericTables.pageLabel")}
    >
      <Tab value="data">{t("genericTables.tabs.data")}</Tab>
      <Tab value="definition">{t("genericTables.tabs.definition")}</Tab>
      <Tab value="history">{t("genericTables.tabs.history")}</Tab>
    </TabList>
  );
}
