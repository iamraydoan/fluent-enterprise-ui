import { useState } from "react";
import { useShiftPlanDetail } from "@/api";
import { DetailShell, Empty, KV, Panel } from "@/components/common";
import type { DetailTab } from "@/components/common";
import { Timer24Regular } from "@/components/icons";
import { Body1Strong, Button, Caption1 } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import {
  formatEmployeeMeta,
  formatWorkgroupMeta,
  formatWorkgroupResources,
} from "./shiftPlanHelpers";
import { shiftPlanMoreActions } from "./shiftPlanMoreActions";

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "businessData.shiftPlan.tabs.details" },
  { value: "calendar", labelKey: "businessData.shiftPlan.tabs.calendar" },
  { value: "references", labelKey: "businessData.shiftPlan.tabs.references" },
  { value: "history", labelKey: "businessData.shiftPlan.tabs.history" },
];

const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.shiftPlan.sections.details",
  "businessData.shiftPlan.sections.workgroups",
  "businessData.shiftPlan.sections.employees",
  "businessData.shiftPlan.sections.attributes",
  "businessData.shiftPlan.sections.attachments",
];

export function ShiftPlanDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const sharedStyles = useSharedStyles();
  const { data, isLoading } = useShiftPlanDetail(name);
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<TranslationKey>("businessData.shiftPlan.sections.details");
  const handleLeft = (value: string) => setLeft(value as TranslationKey);

  if (isLoading || data === undefined) {
    return (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.shiftPlan.notFound")}</Body1Strong>
        </Empty>
      </Panel>
    );
  }

  let content;
  if (top === "calendar") {
    content = (
      <Panel>
        <Body1Strong>{t("businessData.shiftPlan.calendar.title")}</Body1Strong>
        <Caption1>{t("businessData.shiftPlan.calendar.hint")}</Caption1>
        <div
          className={sharedStyles.contentCard}
          style={{ padding: "16px", marginTop: "12px", minHeight: "300px" }}
        >
          <Caption1>{t("businessData.shiftPlan.calendar.empty")}</Caption1>
        </div>
      </Panel>
    );
  } else if (top !== "details") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.shiftPlan.emptySection")}</Body1Strong>
        </Empty>
      </Panel>
    );
  } else if (left === "businessData.shiftPlan.sections.workgroups") {
    content = (
      <Panel>
        <Body1Strong>
          {t("businessData.shiftPlan.sections.workgroups")} ({data.workgroups.length})
        </Body1Strong>
        <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", rowGap: "8px" }}>
          {data.workgroups.map((wg) => (
            <div key={wg.name} className={sharedStyles.contentCard} style={{ padding: "12px" }}>
              <Body1Strong>{wg.name}</Body1Strong>
              <Caption1>{formatWorkgroupMeta(wg)}</Caption1>
              <Caption1>{formatWorkgroupResources(wg)}</Caption1>
            </div>
          ))}
        </div>
      </Panel>
    );
  } else if (left === "businessData.shiftPlan.sections.employees") {
    content = (
      <Panel>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Body1Strong>
            {t("businessData.shiftPlan.sections.employees")} ({data.employees.length})
          </Body1Strong>
          <Button>{t("businessData.shiftPlan.manageEmployees")}</Button>
        </div>
        <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", rowGap: "8px" }}>
          {data.employees.map((emp) => (
            <div key={emp.name} className={sharedStyles.contentCard} style={{ padding: "12px" }}>
              <Body1Strong>{emp.name}</Body1Strong>
              <Caption1>{formatEmployeeMeta(emp)}</Caption1>
            </div>
          ))}
        </div>
      </Panel>
    );
  } else if (
    left === "businessData.shiftPlan.sections.attributes" ||
    left === "businessData.shiftPlan.sections.attachments"
  ) {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.shiftPlan.emptySection")}</Body1Strong>
        </Empty>
      </Panel>
    );
  } else {
    content = (
      <>
        <div className={sharedStyles.contentCard} style={{ padding: "16px", marginBottom: "12px" }}>
          <Body1Strong>{t("businessData.shiftPlan.sections.details")}</Body1Strong>
          <KV
            rows={[
              [t("businessData.shiftPlan.detail.name"), data.name],
              [t("businessData.shiftPlan.detail.description"), data.description],
              [t("businessData.shiftPlan.detail.type"), data.type],
              [t("businessData.shiftPlan.detail.calendar"), data.calendar],
              [
                t("businessData.shiftPlan.detail.state"),
                t(`common.${data.state.toLowerCase()}` as TranslationKey),
              ],
              [t("businessData.shiftPlan.detail.dataGroup"), data.dataGroup],
            ]}
          />
        </div>
        <div className={sharedStyles.contentCard} style={{ padding: "16px" }}>
          <Body1Strong>{t("businessData.shiftPlan.detail.ownership")}</Body1Strong>
          <KV rows={[[t("businessData.shiftPlan.detail.ownerRole"), data.ownerRole]]} />
        </div>
      </>
    );
  }

  return (
    <DetailShell
      title={data.name}
      icon={<Timer24Regular />}
      topTabs={TOP_TABS}
      top={top}
      onTop={setTop}
      leftItems={LEFT_SECTIONS}
      left={left}
      onLeft={handleLeft}
      onEdit={() => {}}
      onAskAi={() => {}}
      moreActions={shiftPlanMoreActions.map((action) => ({ ...action, onClick: () => {} }))}
    >
      {content}
    </DetailShell>
  );
}
