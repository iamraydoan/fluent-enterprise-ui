import { useState } from "react";
import type { GenericTableDetail } from "@/api";
import { Card, CardGrid, Empty, KV, Panel } from "@/components/common";
import { Body1Strong, Caption1, makeStyles, mergeClasses, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

const useDefStyles = makeStyles({
  layout: { display: "flex", columnGap: "12px", minHeight: "400px" },
  nav: {
    width: "220px",
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    rowGap: "2px",
  },
  navItem: {
    padding: "10px 12px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "inherit",
    fontSize: "13px",
    borderRadius: tokens.borderRadiusMedium,
    ":hover": { backgroundColor: tokens.colorNeutralBackground1Hover },
  },
  navActive: {
    backgroundColor: tokens.colorNeutralBackground1Selected,
    fontWeight: tokens.fontWeightSemibold,
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
    <div className={styles.layout}>
      <div className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item}
            className={mergeClasses(styles.navItem, section === item && styles.navActive)}
            onClick={() => setSection(item)}
          >
            {t(item)}
          </button>
        ))}
      </div>
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
    </div>
  );
}
