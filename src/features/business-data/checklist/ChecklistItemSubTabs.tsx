import { Tab, TabList } from "@/components/ui";
import { useAppTranslation } from "@/i18n";

const SUB_TABS = ["generalData", "instructions", "bom", "condition"] as const;

interface ChecklistItemSubTabsProps {
  selected: string;
  itemCount: number;
  onSelect: (value: string) => void;
}

export function ChecklistItemSubTabs({ selected, itemCount, onSelect }: ChecklistItemSubTabsProps) {
  const { t } = useAppTranslation();
  return (
    <TabList
      selectedValue={selected}
      onTabSelect={onSelect}
      aria-label={t("businessData.checklist.detail.itemsTitle", { count: itemCount })}
    >
      {SUB_TABS.map((v) => (
        <Tab key={v} value={v}>
          {t(`businessData.checklist.detail.subTabs.${v}`)}
        </Tab>
      ))}
    </TabList>
  );
}
