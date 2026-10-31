import { useState } from "react";
import { useTaskDetail } from "@/api";
import { DetailShell, Empty, KV, Panel } from "@/components/common";
import type { DetailTab } from "@/components/common";
import { Checkmark20Filled } from "@/components/icons";
import { Body1Strong } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { taskMoreActions } from "./taskMoreActions";

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "businessData.task.tabs.details" },
  { value: "references", labelKey: "businessData.task.tabs.references" },
  { value: "history", labelKey: "businessData.task.tabs.history" },
];

const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.task.sections.details",
  "businessData.task.sections.attachments",
];

export function TaskDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const sharedStyles = useSharedStyles();
  const { data, isLoading } = useTaskDetail(name);
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<TranslationKey>("businessData.task.sections.details");
  const handleLeft = (value: string) => setLeft(value as TranslationKey);

  if (isLoading || data === undefined) {
    return (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.task.notFound")}</Body1Strong>
        </Empty>
      </Panel>
    );
  }

  const content =
    top !== "details" || left !== "businessData.task.sections.details" ? (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.task.emptySection")}</Body1Strong>
        </Empty>
      </Panel>
    ) : (
      <>
        <div className={sharedStyles.contentCard} style={{ padding: "16px", marginBottom: "12px" }}>
          <Body1Strong>{t("businessData.task.sections.details")}</Body1Strong>
          <KV
            rows={[
              [t("businessData.task.detail.name"), data.name],
              [t("businessData.task.detail.description"), data.description],
              [t("businessData.task.detail.owner"), data.owner],
              [t("businessData.task.detail.taskState"), data.taskState],
              [
                t("businessData.task.detail.state"),
                t(`common.${data.state.toLowerCase()}` as TranslationKey),
              ],
              [t("businessData.task.detail.dataGroup"), data.dataGroup],
            ]}
          />
        </div>
        <div className={sharedStyles.contentCard} style={{ padding: "16px" }}>
          <Body1Strong>{t("businessData.task.detail.assignment")}</Body1Strong>
          <KV
            rows={[
              [t("businessData.task.detail.requester"), data.requester],
              [t("businessData.task.detail.dueDate"), data.dueDate],
            ]}
          />
        </div>
      </>
    );

  return (
    <DetailShell
      title={data.name}
      icon={<Checkmark20Filled />}
      topTabs={TOP_TABS}
      top={top}
      onTop={setTop}
      leftItems={LEFT_SECTIONS}
      left={left}
      onLeft={handleLeft}
      onEdit={() => {}}
      onAskAi={() => {}}
      moreActions={taskMoreActions.map((action) => ({ ...action, onClick: () => {} }))}
    >
      {content}
    </DetailShell>
  );
}
