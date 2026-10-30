import { useState } from "react";
import { useSubstrateMapMaskDetail } from "@/api";
import { DetailShell, Empty, KV, Panel } from "@/components/common";
import type { DetailTab } from "@/components/common";
import { Grid24Regular } from "@/components/icons";
import { Body1Strong, Caption1 } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { substrateMapMaskMoreActions } from "./substrateMapMaskMoreActions";

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "businessData.substrateMapMask.tabs.details" },
  { value: "content", labelKey: "businessData.substrateMapMask.tabs.content" },
  { value: "compare", labelKey: "businessData.substrateMapMask.tabs.compare" },
  { value: "references", labelKey: "businessData.substrateMapMask.tabs.references" },
  { value: "history", labelKey: "businessData.substrateMapMask.tabs.history" },
];

const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.substrateMapMask.sections.details",
  "businessData.substrateMapMask.sections.attributes",
  "businessData.substrateMapMask.sections.attachments",
];

export function SubstrateMapMaskDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const sharedStyles = useSharedStyles();
  const { data, isLoading } = useSubstrateMapMaskDetail(name);
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<TranslationKey>(
    "businessData.substrateMapMask.sections.details",
  );
  const handleLeft = (value: string) => setLeft(value as TranslationKey);

  if (isLoading || data === undefined) {
    return (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.substrateMapMask.notFound")}</Body1Strong>
        </Empty>
      </Panel>
    );
  }

  let content;
  if (top === "content") {
    content = (
      <Panel>
        <Body1Strong>{t("businessData.substrateMapMask.content.title")}</Body1Strong>
        <Caption1>{t("businessData.substrateMapMask.content.hint")}</Caption1>
        <div
          className={sharedStyles.contentCard}
          style={{ padding: "16px", marginTop: "12px", minHeight: "300px" }}
        >
          <Caption1>{t("businessData.substrateMapMask.content.empty")}</Caption1>
        </div>
      </Panel>
    );
  } else if (top !== "details" || left !== "businessData.substrateMapMask.sections.details") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.substrateMapMask.emptySection")}</Body1Strong>
        </Empty>
      </Panel>
    );
  } else {
    content = (
      <div className={sharedStyles.contentCard} style={{ padding: "16px", marginBottom: "12px" }}>
        <Body1Strong>{t("businessData.substrateMapMask.sections.details")}</Body1Strong>
        <KV
          rows={[
            [t("businessData.substrateMapMask.detail.name"), data.name],
            [t("businessData.substrateMapMask.detail.description"), data.description],
            [t("businessData.substrateMapMask.detail.substrateType"), data.substrateType],
            [
              t("businessData.substrateMapMask.detail.state"),
              t(`common.${data.state.toLowerCase()}` as TranslationKey),
            ],
            [t("businessData.substrateMapMask.detail.dataGroup"), data.dataGroup],
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
      moreActions={substrateMapMaskMoreActions.map((action) => ({ ...action, onClick: () => {} }))}
    >
      {content}
    </DetailShell>
  );
}
