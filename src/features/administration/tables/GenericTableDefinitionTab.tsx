import { useState } from "react";
import type { GenericTableDetail } from "@/api";
import { Card, CardGrid, Empty, KV, Panel, SidebarNavItem, HStack, VStack  } from "@/components/common";
import { Body1Strong, Caption1, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { theme } from "@/styles/theme";

const useDefStyles = makeStyles({
  layout: {
    minHeight: "400px",
  },
  nav: {
    width: "220px",
  },
  navItem: {
    padding: `10px ${theme.spacing.md}`,
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "inherit",
    fontSize: "13px",
    borderRadius: theme.radius.md,
    ":hover": { backgroundColor: theme.color.surfaceHover },
  },
  main: { flexGrow: 1, minWidth: 0 },
});

const NAV_ITEMS: TranslationKey[] = [
  "genericTables.definition.definition",
  "genericTables.definition.properties",
];

export function GenericTableDefinitionTab({ table }: { table: GenericTableDetail }) {
  const { t } = useAppTranslation();
  const styles = useDefStyles();
  const [section, setSection] = useState<TranslationKey>("genericTables.definition.definition");

  return (
    <HStack gap="12px" className={styles.layout}>
      <VStack gap="2px" className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <SidebarNavItem
            key={item}
            label={t(item)}
            active={section === item}
            onClick={() => setSection(item)}
          />
        ))}
      </VStack>
      <div className={styles.main}>
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
      </div>
    </HStack>
  );
}
