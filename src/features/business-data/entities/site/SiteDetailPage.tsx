import { useState } from "react";
import { useSiteDetail } from "@/api";
import { DetailShell, Empty, KV, Panel } from "@/components/common";
import type { DetailTab } from "@/components/common";
import { Globe24Regular } from "@/components/icons";
import { Body1Strong } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { formatOptional } from "./siteHelpers";
import { siteMoreActions } from "./siteMoreActions";

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "businessData.site.tabs.details" },
  { value: "references", labelKey: "businessData.site.tabs.references" },
  { value: "history", labelKey: "businessData.site.tabs.history" },
];

const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.site.sections.details",
  "businessData.site.sections.facilities",
  "businessData.site.sections.attributes",
  "businessData.site.sections.attachments",
];

export function SiteDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const sharedStyles = useSharedStyles();
  const { data, isLoading } = useSiteDetail(name);
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<TranslationKey>("businessData.site.sections.details");
  const handleLeft = (value: string) => setLeft(value as TranslationKey);

  if (isLoading || data === undefined) {
    return (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.site.notFound")}</Body1Strong>
        </Empty>
      </Panel>
    );
  }

  let content;
  if (top !== "details") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.site.emptySection")}</Body1Strong>
        </Empty>
      </Panel>
    );
  } else if (left === "businessData.site.sections.facilities") {
    content = (
      <Panel>
        <Body1Strong>
          {t("businessData.site.sections.facilities")} ({data.facilities.length})
        </Body1Strong>
        <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", rowGap: "8px" }}>
          {data.facilities.map((facility) => (
            <div key={facility} className={sharedStyles.contentCard} style={{ padding: "12px" }}>
              <Body1Strong>{facility}</Body1Strong>
            </div>
          ))}
        </div>
      </Panel>
    );
  } else if (
    left === "businessData.site.sections.attributes" ||
    left === "businessData.site.sections.attachments"
  ) {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.site.emptySection")}</Body1Strong>
        </Empty>
      </Panel>
    );
  } else {
    content = (
      <>
        <div className={sharedStyles.contentCard} style={{ padding: "16px", marginBottom: "12px" }}>
          <Body1Strong>{t("businessData.site.sections.details")}</Body1Strong>
          <KV
            rows={[
              [t("businessData.site.detail.name"), data.name],
              [t("businessData.site.detail.description"), data.description],
              [t("businessData.site.detail.enterprise"), data.enterprise],
              [
                t("businessData.site.detail.state"),
                t(`common.${data.state.toLowerCase()}` as TranslationKey),
              ],
              [t("businessData.site.detail.dataGroup"), data.dataGroup],
            ]}
          />
        </div>
        <div className={sharedStyles.contentCard} style={{ padding: "16px" }}>
          <Body1Strong>{t("businessData.site.detail.remoteShipping")}</Body1Strong>
          <KV
            rows={[
              [
                t("businessData.site.detail.isRemote"),
                data.isRemote ? t("common.yes") : t("common.no"),
              ],
              [t("businessData.site.detail.remoteExportAddress"), formatOptional(data.remoteExportAddress)],
            ]}
          />
        </div>
      </>
    );
  }

  return (
    <DetailShell
      title={data.name}
      icon={<Globe24Regular />}
      topTabs={TOP_TABS}
      top={top}
      onTop={setTop}
      leftItems={LEFT_SECTIONS}
      left={left}
      onLeft={handleLeft}
      onEdit={() => {}}
      onAskAi={() => {}}
      moreActions={siteMoreActions.map((action) => ({ ...action, onClick: () => {} }))}
    >
      {content}
    </DetailShell>
  );
}
