import { useState } from "react";
import { useSubstrateMapDetail } from "@/api";
import { DetailShell, Empty, KV, Panel } from "@/components/common";
import type { DetailTab } from "@/components/common";
import { Grid24Regular } from "@/components/icons";
import { Body1Strong, Button, Caption1 } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { formatOverlayMeta } from "./substrateMapHelpers";
import { substrateMapMoreActions } from "./substrateMapMoreActions";

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "businessData.substrateMap.tabs.details" },
  { value: "content", labelKey: "businessData.substrateMap.tabs.content" },
  { value: "compare", labelKey: "businessData.substrateMap.tabs.compare" },
  { value: "references", labelKey: "businessData.substrateMap.tabs.references" },
  { value: "history", labelKey: "businessData.substrateMap.tabs.history" },
];

const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.substrateMap.sections.details",
  "businessData.substrateMap.sections.overlayBinConverters",
  "businessData.substrateMap.sections.attributes",
  "businessData.substrateMap.sections.overlayInformation",
  "businessData.substrateMap.sections.attachments",
];

export function SubstrateMapDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const sharedStyles = useSharedStyles();
  const { data, isLoading } = useSubstrateMapDetail(name);
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<TranslationKey>("businessData.substrateMap.sections.details");
  const handleLeft = (value: string) => setLeft(value as TranslationKey);

  if (isLoading || data === undefined) {
    return (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.substrateMap.notFound")}</Body1Strong>
        </Empty>
      </Panel>
    );
  }

  let content;
  if (top === "content") {
    content = (
      <Panel>
        <Body1Strong>{t("businessData.substrateMap.content.title")}</Body1Strong>
        <Caption1>{t("businessData.substrateMap.content.hint")}</Caption1>
        <div
          className={sharedStyles.contentCard}
          style={{ padding: "16px", marginTop: "12px", minHeight: "300px" }}
        >
          <Caption1>{t("businessData.substrateMap.content.empty")}</Caption1>
        </div>
      </Panel>
    );
  } else if (top !== "details") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.substrateMap.emptySection")}</Body1Strong>
        </Empty>
      </Panel>
    );
  } else if (left === "businessData.substrateMap.sections.overlayInformation") {
    content = (
      <Panel>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Body1Strong>
            {t("businessData.substrateMap.sections.overlayInformation")} ({data.overlays.length})
          </Body1Strong>
          <Button>{t("businessData.substrateMap.manageOverlayInfo")}</Button>
        </div>
        <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", rowGap: "8px" }}>
          {data.overlays.map((overlay) => (
            <div key={overlay.name} className={sharedStyles.contentCard} style={{ padding: "12px" }}>
              <Body1Strong>
                {overlay.name}
                {overlay.isActive ? ` (${t("businessData.substrateMap.active")})` : ""}
              </Body1Strong>
              <div>
                <Caption1>{formatOverlayMeta(overlay)}</Caption1>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    );
  } else if (left !== "businessData.substrateMap.sections.details") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.substrateMap.emptySection")}</Body1Strong>
        </Empty>
      </Panel>
    );
  } else {
    content = (
      <div className={sharedStyles.contentCard} style={{ padding: "16px", marginBottom: "12px" }}>
        <Body1Strong>{t("businessData.substrateMap.sections.details")}</Body1Strong>
        <KV
          rows={[
            [t("businessData.substrateMap.detail.name"), data.name],
            [t("businessData.substrateMap.detail.description"), data.description],
            [t("businessData.substrateMap.detail.substrateType"), data.substrateType],
            [
              t("businessData.substrateMap.detail.state"),
              t(`common.${data.state.toLowerCase()}` as TranslationKey),
            ],
            [t("businessData.substrateMap.detail.dataGroup"), data.dataGroup],
          ]}
        />
      </div>
    );
  }

  return (
    <DetailShell
      title={data.name}
      icon={<Grid24Regular />}
      topTabs={TOP_TABS}
      top={top}
      onTop={setTop}
      leftItems={LEFT_SECTIONS}
      left={left}
      onLeft={handleLeft}
      onEdit={() => {}}
      onAskAi={() => {}}
      moreActions={substrateMapMoreActions.map((action) => ({ ...action, onClick: () => {} }))}
    >
      {content}
    </DetailShell>
  );
}
