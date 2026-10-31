import { useState } from "react";
import { useConfiguration } from "@/api";
import { Card, CardGrid, DetailShell, KV } from "@/components/common";
import type { DetailTab } from "@/components/common";
import {
  Checkmark20Filled,
  Dismiss20Filled,
  Wrench20Regular,
  Wrench24Regular,
} from "@/components/icons";
import { makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { formatDateTime } from "@/lib/formatDate";
import { entryName, maskedValue } from "./data";

const useDetailStyles = makeStyles({
  tile: {
    width: "72px",
    height: "72px",
    flexShrink: 0,
    backgroundColor: "#C9DCEA",
    color: "#0F6C93",
    display: "grid",
    placeItems: "center",
    fontSize: "44px",
  },
});

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "detailShell.tabs.details" },
  { value: "references", labelKey: "detailShell.tabs.references" },
  { value: "history", labelKey: "detailShell.tabs.history" },
];

const SECTIONS: TranslationKey[] = [
  "configuration.sections.generalData",
  "configuration.sections.information",
];

interface ConfigurationDetailPageProps {
  path: string;
}

export function ConfigurationDetailPage({ path }: ConfigurationDetailPageProps) {
  const { t } = useAppTranslation();
  const detailStyles = useDetailStyles();
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<string>("configuration.sections.generalData");
  const { data, isLoading } = useConfiguration(path);

  if (isLoading || data === undefined) {
    return null;
  }

  const generalData = (
    <Card title={t("configuration.sections.generalData")}>
      <div style={{ display: "flex", columnGap: 18, alignItems: "flex-start" }}>
        <div className={detailStyles.tile}>
          <Wrench24Regular />
        </div>
        <div style={{ flexGrow: 1, minWidth: 0 }}>
          <KV
            rows={[
              [t("configuration.fields.path"), data.path],
              [t("configuration.fields.name"), entryName(data.path)],
              [t("configuration.fields.description"), data.description],
              [t("configuration.fields.type"), data.type],
              [t("configuration.fields.referenceName"), data.referenceName],
              [t("configuration.fields.value"), maskedValue(data)],
              [
                t("configuration.fields.confidential"),
                <span
                  key="confidential"
                  style={{ display: "inline-flex", alignItems: "center", columnGap: 6 }}
                >
                  {data.confidential ? <Checkmark20Filled /> : <Dismiss20Filled />}
                  {data.confidential ? t("common.yes") : t("common.no")}
                </span>,
              ],
            ]}
          />
        </div>
      </div>
    </Card>
  );

  const information = (
    <Card title={t("configuration.sections.information")}>
      <KV
        rows={[
          [t("configuration.fields.createdBy"), data.createdBy],
          [t("configuration.fields.createdOn"), formatDateTime(data.createdOn)],
          [t("configuration.fields.modifiedBy"), data.modifiedBy],
          [t("configuration.fields.modifiedOn"), formatDateTime(data.modifiedOn)],
        ]}
      />
    </Card>
  );

  return (
    <DetailShell
      title={entryName(data.path)}
      icon={<Wrench20Regular />}
      topTabs={TOP_TABS}
      top={top}
      onTop={setTop}
      leftItems={SECTIONS}
      left={left}
      onLeft={setLeft}
      onEdit={() => undefined}
      onAskAi={() => undefined}
      showState={false}
    >
      <CardGrid>
        {left === "configuration.sections.information" ? information : generalData}
      </CardGrid>
    </DetailShell>
  );
}
