import { useState } from "react";
import { useStepDetail } from "@/api";
import { DetailShell, Empty, KV, Panel } from "@/components/common";
import type { DetailTab } from "@/components/common";
import { Flow24Regular } from "@/components/icons";
import { Body1Strong } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { formatList } from "./stepHelpers";
import { stepMoreActions } from "./stepMoreActions";

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "businessData.step.tabs.details" },
  { value: "schedule", labelKey: "businessData.step.tabs.schedule" },
  { value: "stepView", labelKey: "businessData.step.tabs.stepView" },
  { value: "contexts", labelKey: "businessData.step.tabs.contexts" },
  { value: "compare", labelKey: "businessData.step.tabs.compare" },
  { value: "references", labelKey: "businessData.step.tabs.references" },
  { value: "history", labelKey: "businessData.step.tabs.history" },
];

const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.step.sections.details",
  "businessData.step.sections.logicalNames",
  "businessData.step.sections.areas",
  "businessData.step.sections.reasons",
  "businessData.step.sections.futureActions",
  "businessData.step.sections.costing",
  "businessData.step.sections.sampling",
  "businessData.step.sections.scheduling",
  "businessData.step.sections.inspections",
  "businessData.step.sections.attachments",
];

const CONTEXTS: TranslationKey[] = [
  "businessData.step.contexts.bom",
  "businessData.step.contexts.certifications",
  "businessData.step.contexts.chart",
  "businessData.step.contexts.checklist",
  "businessData.step.contexts.dataCollection",
  "businessData.step.contexts.document",
  "businessData.step.contexts.durables",
  "businessData.step.contexts.inspectionPlan",
  "businessData.step.contexts.lineFlow",
  "businessData.step.contexts.samplingPattern",
  "businessData.step.contexts.service",
  "businessData.step.contexts.splitTrackOut",
  "businessData.step.contexts.timeConstraints",
  "businessData.step.contexts.yieldCycleTime",
];

export function StepDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const sharedStyles = useSharedStyles();
  const { data, isLoading } = useStepDetail(name);
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<TranslationKey>("businessData.step.sections.details");
  const handleLeft = (value: string) => setLeft(value as TranslationKey);

  if (isLoading || data === undefined) {
    return (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.step.notFound")}</Body1Strong>
        </Empty>
      </Panel>
    );
  }

  let content;
  if (top === "contexts") {
    content = (
      <Panel>
        <Body1Strong>{t("businessData.step.tabs.contexts")}</Body1Strong>
        <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", rowGap: "8px" }}>
          {CONTEXTS.map((key) => (
            <div key={key} className={sharedStyles.contentCard} style={{ padding: "12px" }}>
              <Body1Strong>{t(key)}</Body1Strong>
            </div>
          ))}
        </div>
      </Panel>
    );
  } else if (top !== "details") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.step.emptySection")}</Body1Strong>
        </Empty>
      </Panel>
    );
  } else if (left === "businessData.step.sections.logicalNames") {
    content = (
      <Panel>
        <Body1Strong>
          {t("businessData.step.sections.logicalNames")} ({data.logicalNames.length})
        </Body1Strong>
        <div style={{ marginTop: "12px" }}>{formatList(data.logicalNames)}</div>
      </Panel>
    );
  } else if (left === "businessData.step.sections.areas") {
    content = (
      <Panel>
        <Body1Strong>
          {t("businessData.step.sections.areas")} ({data.areas.length})
        </Body1Strong>
        <div style={{ marginTop: "12px" }}>{formatList(data.areas)}</div>
      </Panel>
    );
  } else if (left === "businessData.step.sections.reasons") {
    content = (
      <Panel>
        <Body1Strong>
          {t("businessData.step.sections.reasons")} ({data.reasons.length})
        </Body1Strong>
        <div style={{ marginTop: "12px" }}>{formatList(data.reasons)}</div>
      </Panel>
    );
  } else if (left !== "businessData.step.sections.details") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.step.emptySection")}</Body1Strong>
        </Empty>
      </Panel>
    );
  } else {
    content = (
      <div className={sharedStyles.contentCard} style={{ padding: "16px", marginBottom: "12px" }}>
        <Body1Strong>{t("businessData.step.sections.details")}</Body1Strong>
        <KV
          rows={[
            [t("businessData.step.detail.name"), data.name],
            [t("businessData.step.detail.description"), data.description],
            [
              t("businessData.step.detail.state"),
              t(`common.${data.state.toLowerCase()}` as TranslationKey),
            ],
            [t("businessData.step.detail.dataGroup"), data.dataGroup],
            [
              t("businessData.step.detail.includeInScheduling"),
              data.includeInScheduling ? t("common.yes") : t("common.no"),
            ],
          ]}
        />
      </div>
    );
  }

  return (
    <DetailShell
      title={data.name}
      icon={<Flow24Regular />}
      topTabs={TOP_TABS}
      top={top}
      onTop={setTop}
      leftItems={LEFT_SECTIONS}
      left={left}
      onLeft={handleLeft}
      onEdit={() => {}}
      onAskAi={() => {}}
      moreActions={stepMoreActions.map((action) => ({ ...action, onClick: () => {} }))}
    >
      {content}
    </DetailShell>
  );
}
