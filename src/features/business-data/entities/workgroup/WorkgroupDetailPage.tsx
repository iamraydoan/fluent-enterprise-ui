import { useState } from "react";
import { useWorkgroupDetail } from "@/api";
import { DetailShell, Empty, KV, Panel } from "@/components/common";
import type { DetailTab } from "@/components/common";
import { ShieldCheckmark20Regular } from "@/components/icons";
import { Body1Strong } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { formatList } from "./workgroupHelpers";
import { workgroupMoreActions } from "./workgroupMoreActions";

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "businessData.workgroup.tabs.details" },
  { value: "references", labelKey: "businessData.workgroup.tabs.references" },
  { value: "history", labelKey: "businessData.workgroup.tabs.history" },
];

const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.workgroup.sections.details",
  "businessData.workgroup.sections.resources",
  "businessData.workgroup.sections.steps",
  "businessData.workgroup.sections.areas",
  "businessData.workgroup.sections.attachments",
];

export function WorkgroupDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const sharedStyles = useSharedStyles();
  const { data, isLoading } = useWorkgroupDetail(name);
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<TranslationKey>("businessData.workgroup.sections.details");
  const handleLeft = (value: string) => setLeft(value as TranslationKey);

  if (isLoading || data === undefined) {
    return (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.workgroup.notFound")}</Body1Strong>
        </Empty>
      </Panel>
    );
  }

  let content;
  if (top !== "details") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.workgroup.emptySection")}</Body1Strong>
        </Empty>
      </Panel>
    );
  } else if (left === "businessData.workgroup.sections.resources") {
    content = (
      <Panel>
        <Body1Strong>
          {t("businessData.workgroup.sections.resources")} ({data.resources.length})
        </Body1Strong>
        <div style={{ marginTop: "12px" }}>{formatList(data.resources)}</div>
      </Panel>
    );
  } else if (left === "businessData.workgroup.sections.steps") {
    content = (
      <Panel>
        <Body1Strong>
          {t("businessData.workgroup.sections.steps")} ({data.steps.length})
        </Body1Strong>
        <div style={{ marginTop: "12px" }}>{formatList(data.steps)}</div>
      </Panel>
    );
  } else if (left === "businessData.workgroup.sections.areas") {
    content = (
      <Panel>
        <Body1Strong>
          {t("businessData.workgroup.sections.areas")} ({data.areas.length})
        </Body1Strong>
        <div style={{ marginTop: "12px" }}>{formatList(data.areas)}</div>
      </Panel>
    );
  } else if (left !== "businessData.workgroup.sections.details") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.workgroup.emptySection")}</Body1Strong>
        </Empty>
      </Panel>
    );
  } else {
    content = (
      <div className={sharedStyles.contentCard} style={{ padding: "16px", marginBottom: "12px" }}>
        <Body1Strong>{t("businessData.workgroup.sections.details")}</Body1Strong>
        <KV
          rows={[
            [t("businessData.workgroup.detail.name"), data.name],
            [t("businessData.workgroup.detail.description"), data.description],
            [t("businessData.workgroup.detail.scope"), data.scope],
            [
              t("businessData.workgroup.detail.state"),
              t(`common.${data.state.toLowerCase()}` as TranslationKey),
            ],
            [t("businessData.workgroup.detail.dataGroup"), data.dataGroup],
          ]}
        />
      </div>
    );
  }

  return (
    <DetailShell
      title={data.name}
      icon={<ShieldCheckmark20Regular />}
      topTabs={TOP_TABS}
      top={top}
      onTop={setTop}
      leftItems={LEFT_SECTIONS}
      left={left}
      onLeft={handleLeft}
      onEdit={() => {}}
      onAskAi={() => {}}
      moreActions={workgroupMoreActions.map((action) => ({ ...action, onClick: () => {} }))}
    >
      {content}
    </DetailShell>
  );
}
