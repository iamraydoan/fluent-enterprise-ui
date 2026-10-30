import { useState } from "react";
import { useTransferOrderDetail } from "@/api";
import { DetailShell, Empty, KV, Panel } from "@/components/common";
import type { DetailTab } from "@/components/common";
import { ArrowExportUp24Regular } from "@/components/icons";
import { Body1Strong, Caption1 } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { formatItemMeta } from "./transferOrderHelpers";
import { transferOrderMoreActions } from "./transferOrderMoreActions";

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "businessData.transferOrder.tabs.details" },
  { value: "references", labelKey: "businessData.transferOrder.tabs.references" },
  { value: "history", labelKey: "businessData.transferOrder.tabs.history" },
];

const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.transferOrder.sections.details",
  "businessData.transferOrder.sections.items",
  "businessData.transferOrder.sections.attachments",
];

export function TransferOrderDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const sharedStyles = useSharedStyles();
  const { data, isLoading } = useTransferOrderDetail(name);
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<TranslationKey>("businessData.transferOrder.sections.details");
  const handleLeft = (value: string) => setLeft(value as TranslationKey);

  if (isLoading || data === undefined) {
    return (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.transferOrder.notFound")}</Body1Strong>
        </Empty>
      </Panel>
    );
  }

  let content;
  if (top !== "details") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.transferOrder.emptySection")}</Body1Strong>
        </Empty>
      </Panel>
    );
  } else if (left === "businessData.transferOrder.sections.items") {
    content = (
      <Panel>
        <Body1Strong>
          {t("businessData.transferOrder.sections.items")} ({data.items.length})
        </Body1Strong>
        <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", rowGap: "8px" }}>
          {data.items.map((item) => (
            <div
              key={item.material}
              className={sharedStyles.contentCard}
              style={{ padding: "12px" }}
            >
              <Body1Strong>{item.material}</Body1Strong>
              <div>
                <Caption1>{formatItemMeta(item)}</Caption1>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    );
  } else if (left !== "businessData.transferOrder.sections.details") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.transferOrder.emptySection")}</Body1Strong>
        </Empty>
      </Panel>
    );
  } else {
    content = (
      <div className={sharedStyles.contentCard} style={{ padding: "16px", marginBottom: "12px" }}>
        <Body1Strong>{t("businessData.transferOrder.sections.details")}</Body1Strong>
        <KV
          rows={[
            [t("businessData.transferOrder.detail.name"), data.name],
            [t("businessData.transferOrder.detail.description"), data.description],
            [t("businessData.transferOrder.detail.sourceLocation"), data.sourceLocation],
            [t("businessData.transferOrder.detail.destinationLocation"), data.destinationLocation],
            [t("businessData.transferOrder.detail.orderState"), data.orderState],
            [
              t("businessData.transferOrder.detail.state"),
              t(`common.${data.state.toLowerCase()}` as TranslationKey),
            ],
            [t("businessData.transferOrder.detail.dataGroup"), data.dataGroup],
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
      moreActions={transferOrderMoreActions.map((action) => ({ ...action, onClick: () => {} }))}
    >
      {content}
    </DetailShell>
  );
}
