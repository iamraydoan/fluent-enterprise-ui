import { useState } from "react";
import { useFabLiveDetail } from "@/api";
import { Card, DetailShell, Empty, KV, Panel } from "@/components/common";
import type { DetailTab } from "@/components/common";
import { Target24Regular } from "@/components/icons";
import { Body1Strong } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "manufacturing.fabLives.tabs.details" },
  { value: "references", labelKey: "manufacturing.fabLives.tabs.references" },
  { value: "history", labelKey: "manufacturing.fabLives.tabs.history" },
];

const LEFT_SECTIONS: TranslationKey[] = [
  "manufacturing.fabLives.sections.details",
  "manufacturing.fabLives.sections.attributes",
  "manufacturing.fabLives.sections.attachments",
];

export function FabLiveDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const { data, isLoading } = useFabLiveDetail(name);
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<TranslationKey>("manufacturing.fabLives.sections.details");
  const handleLeft = (value: string) => setLeft(value as TranslationKey);

  if (isLoading || data === undefined) {
    return (
      <Panel>
        <Empty>
          <Body1Strong>{t("manufacturing.fabLives.notFound")}</Body1Strong>
        </Empty>
      </Panel>
    );
  }

  let content;
  if (top !== "details") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("manufacturing.fabLives.emptySection")}</Body1Strong>
        </Empty>
      </Panel>
    );
  } else if (left !== "manufacturing.fabLives.sections.details") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("manufacturing.fabLives.emptySection")}</Body1Strong>
        </Empty>
      </Panel>
    );
  } else {
    content = (
      <Card title={t("manufacturing.fabLives.sections.details")}>
        <Body1Strong>{t("manufacturing.fabLives.readOnlyNotice")}</Body1Strong>
        <KV
          rows={[
            [t("manufacturing.fabLives.detail.name"), data.name],
            [t("manufacturing.fabLives.detail.description"), data.description],
            [t("manufacturing.fabLives.detail.folder"), data.folder],
            [
              t("manufacturing.fabLives.detail.state"),
              t(`common.${data.state.toLowerCase()}` as TranslationKey),
            ],
            [t("manufacturing.fabLives.detail.dataGroup"), data.dataGroup],
          ]}
        />
      </Card>
    );
  }

  return (
    <DetailShell
      title={data.name}
      icon={<Target24Regular />}
      topTabs={TOP_TABS}
      top={top}
      onTop={setTop}
      leftItems={LEFT_SECTIONS}
      left={left}
      onLeft={handleLeft}
      onEdit={() => undefined}
      onAskAi={() => undefined}
    >
      {content}
    </DetailShell>
  );
}
