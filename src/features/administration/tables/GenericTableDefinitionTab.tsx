import { useState } from "react";
import type { GenericTableDetail } from "@/api";
import {
  Card,
  CardGrid,
  Empty,
  KV,
  Panel,
  SidebarNavItem,
  Split,
  VStack,
} from "@/components/common";
import { Body1Strong, Caption1 } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

const NAV_ITEMS: TranslationKey[] = [
  "genericTables.definition.definition",
  "genericTables.definition.properties",
];

export function GenericTableDefinitionTab({ table }: { table: GenericTableDetail }) {
  const { t } = useAppTranslation();
  const [section, setSection] = useState<TranslationKey>("genericTables.definition.definition");

  return (
    <Split
      sidebarWidth="220px"
      sidebar={
        <VStack gap="xs">
          {NAV_ITEMS.map((item) => (
            <SidebarNavItem
              key={item}
              label={t(item)}
              active={section === item}
              onClick={() => setSection(item)}
            />
          ))}
        </VStack>
      }
    >
      {section === "genericTables.definition.definition" ? (
        <CardGrid>
          <Card title={t("genericTables.definition.generalData")}>
            <KV
              rows={[
                [t("genericTables.definition.name"), table.name],
                [t("genericTables.definition.description"), table.description],
                [t("genericTables.definition.dataGroup"), table.dataGroup],
                [
                  t("genericTables.definition.isSystem"),
                  table.isSystem ? t("common.yes") : t("common.no"),
                ],
                [
                  t("genericTables.definition.enableHistory"),
                  table.enableHistory ? t("common.yes") : t("common.no"),
                ],
                [t("genericTables.definition.historyDays"), String(table.historyDaysDefault)],
                [t("genericTables.definition.state"), table.state],
                [t("genericTables.definition.localizedKey"), table.localizedMessageKey],
              ]}
            />
          </Card>
          <Card title={t("genericTables.definition.columns", { count: table.columns.length })}>
            <KV
              rows={table.columns.map((column) => [
                column.name,
                `${column.dataType}${column.isKey ? ` (${t("genericTables.definition.key")})` : ""}`,
              ])}
            />
          </Card>
        </CardGrid>
      ) : (
        <Panel>
          <Empty>
            <Body1Strong>{t("genericTables.definition.propertiesEmpty")}</Body1Strong>
            <Caption1>{t("genericTables.definition.propertiesEmptyBody")}</Caption1>
          </Empty>
        </Panel>
      )}
    </Split>
  );
}
