import { useState } from "react";
import { useTransferRequirementDetail } from "@/api";
import { DetailShell, Empty, KV, Panel } from "@/components/common";
import type { DetailTab } from "@/components/common";
import { ArrowExportUp24Regular } from "@/components/icons";
import { Body1Strong, Caption1 } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { formatItemMeta } from "./transferRequirementHelpers";
import { transferRequirementMoreActions } from "./transferRequirementMoreActions";

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "businessData.transferRequirement.tabs.details" },
  { value: "references", labelKey: "businessData.transferRequirement.tabs.references" },
  { value: "history", labelKey: "businessData.transferRequirement.tabs.history" },
];

const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.transferRequirement.sections.details",
  "businessData.transferRequirement.sections.items",
  "businessData.transferRequirement.sections.attachments",
];

export function TransferRequirementDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const sharedStyles = useSharedStyles();
  const { data, isLoading } = useTransferRequirementDetail(name);
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<TranslationKey>(
    "businessData.transferRequirement.sections.details",
  );
  const handleLeft = (value: string) => setLeft(value as TranslationKey);

  if (isLoading || data === undefined) {
    return (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.transferRequirement.notFound")}</Body1Strong>
        </Empty>
      </Panel>
    );
  }

  let content;
  if (top !== "details") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.transferRequirement.emptySection")}</Body1Strong>
        </Empty>
      </Panel>
    );
  } else if (left === "businessData.transferRequirement.sections.items") {
    content = (
      <Panel>
        <Body1Strong>
          {t("businessData.transferRequirement.sections.items")} ({data.items.length})
        </Body1Strong>
        <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", rowGap: "8px" }}>
          {data.items.map((item) => (
            <div
              key={item.product}
              className={sharedStyles.contentCard}
              style={{ padding: "12px" }}
            >
              <Body1Strong>{item.product}</Body1Strong>
              <div>
                <Caption1>{formatItemMeta(item)}</Caption1>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    );
  } else if (left !== "businessData.transferRequirement.sections.details") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.transferRequirement.emptySection")}</Body1Strong>
        </Empty>
      </Panel>
    );
  } else {
    content = (
      <div className={sharedStyles.contentCard} style={{ padding: "16px", marginBottom: "12px" }}>
        <Body1Strong>{t("businessData.transferRequirement.sections.details")}</Body1Strong>
        <KV
          rows={[
            [t("businessData.transferRequirement.detail.name"), data.name],
            [t("businessData.transferRequirement.detail.description"), data.description],
            [t("businessData.transferRequirement.detail.sourceLocation"), data.sourceLocation],
            [
              t("businessData.transferRequirement.detail.destinationLocation"),
              data.destinationLocation,
            ],
            [t("businessData.transferRequirement.detail.requirementState"), data.requirementState],
            [
              t("businessData.transferRequirement.detail.state"),
              t(`common.${data.state.toLowerCase()}` as TranslationKey),
            ],
            [t("businessData.transferRequirement.detail.dataGroup"), data.dataGroup],
          ]}
        />
      </div>
    );
  }

  return (
    <DetailShell
      title={data.name}
      icon={<ArrowExportUp24Regular />}
      topTabs={TOP_TABS}
      top={top}
      onTop={setTop}
      leftItems={LEFT_SECTIONS}
      left={left}
      onLeft={handleLeft}
      onEdit={() => {}}
      onAskAi={() => {}}
      moreActions={transferRequirementMoreActions.map((action) => ({
        ...action,
        onClick: () => {},
      }))}
    >
      {content}
    </DetailShell>
  );
}
