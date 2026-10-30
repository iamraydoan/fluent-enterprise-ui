import { useState } from "react";
import { useTeamDetail } from "@/api";
import { DetailShell, Empty, KV, Panel } from "@/components/common";
import type { DetailTab } from "@/components/common";
import { ShieldCheckmark20Regular } from "@/components/icons";
import { Body1Strong } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { formatList } from "./teamHelpers";
import { teamMoreActions } from "./teamMoreActions";

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "businessData.team.tabs.details" },
  { value: "references", labelKey: "businessData.team.tabs.references" },
  { value: "history", labelKey: "businessData.team.tabs.history" },
];

const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.team.sections.details",
  "businessData.team.sections.employees",
  "businessData.team.sections.calendarDays",
  "businessData.team.sections.attachments",
];

export function TeamDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const sharedStyles = useSharedStyles();
  const { data, isLoading } = useTeamDetail(name);
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<TranslationKey>("businessData.team.sections.details");
  const handleLeft = (value: string) => setLeft(value as TranslationKey);

  if (isLoading || data === undefined) {
    return (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.team.notFound")}</Body1Strong>
        </Empty>
      </Panel>
    );
  }

  let content;
  if (top !== "details") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.team.emptySection")}</Body1Strong>
        </Empty>
      </Panel>
    );
  } else if (left === "businessData.team.sections.employees") {
    content = (
      <Panel>
        <Body1Strong>
          {t("businessData.team.sections.employees")} ({data.employees.length})
        </Body1Strong>
        <div style={{ marginTop: "12px" }}>{formatList(data.employees)}</div>
      </Panel>
    );
  } else if (left === "businessData.team.sections.calendarDays") {
    content = (
      <Panel>
        <Body1Strong>
          {t("businessData.team.sections.calendarDays")} ({data.calendarDays.length})
        </Body1Strong>
        <div style={{ marginTop: "12px" }}>{formatList(data.calendarDays)}</div>
      </Panel>
    );
  } else if (left !== "businessData.team.sections.details") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.team.emptySection")}</Body1Strong>
        </Empty>
      </Panel>
    );
  } else {
    content = (
      <div className={sharedStyles.contentCard} style={{ padding: "16px", marginBottom: "12px" }}>
        <Body1Strong>{t("businessData.team.sections.details")}</Body1Strong>
        <KV
          rows={[
            [t("businessData.team.detail.name"), data.name],
            [t("businessData.team.detail.description"), data.description],
            [t("businessData.team.detail.calendar"), data.calendar],
            [
              t("businessData.team.detail.state"),
              t(`common.${data.state.toLowerCase()}` as TranslationKey),
            ],
            [t("businessData.team.detail.dataGroup"), data.dataGroup],
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
      moreActions={teamMoreActions.map((action) => ({ ...action, onClick: () => {} }))}
    >
      {content}
    </DetailShell>
  );
}
