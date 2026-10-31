import { useState } from "react";
import { useShiftDefinitionDetail } from "@/api";
import { DetailShell, Empty, KV, Panel } from "@/components/common";
import type { DetailTab } from "@/components/common";
import { Timer24Regular } from "@/components/icons";
import { Body1Strong, Button, Caption1 } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { ManageShiftsDialog } from "./dialogs/ManageShiftsDialog";
import { ShiftDefinitionCloneDialog } from "./dialogs/ShiftDefinitionCloneDialog";
import { ShiftDefinitionEditDialog } from "./dialogs/ShiftDefinitionEditDialog";
import {
  ShiftDefinitionTerminateDialog,
  ShiftDefinitionUnterminateDialog,
} from "./dialogs/ShiftDefinitionStateDialogs";
import { SHIFT_DEFINITION_MORE_ACTIONS } from "./shiftDefinitionMoreActions";

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "businessData.shiftDefinition.tabs.details" },
  { value: "references", labelKey: "businessData.shiftDefinition.tabs.references" },
  { value: "history", labelKey: "businessData.shiftDefinition.tabs.history" },
];

const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.shiftDefinition.sections.details",
  "businessData.shiftDefinition.sections.shifts",
  "businessData.shiftDefinition.sections.attributes",
  "businessData.shiftDefinition.sections.attachments",
];

export function ShiftDefinitionDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const sharedStyles = useSharedStyles();
  const { data, isLoading } = useShiftDefinitionDetail(name);
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<TranslationKey>("businessData.shiftDefinition.sections.details");
  const [manageOpen, setManageOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [unterminateOpen, setUnterminateOpen] = useState(false);
  const handleLeft = (value: string) => setLeft(value as TranslationKey);

  if (isLoading || data === undefined) {
    return (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.shiftDefinition.notFound")}</Body1Strong>
        </Empty>
      </Panel>
    );
  }

  let content;
  if (top !== "details") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.shiftDefinition.emptySection")}</Body1Strong>
        </Empty>
      </Panel>
    );
  } else if (left === "businessData.shiftDefinition.sections.shifts") {
    content = (
      <Panel>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Body1Strong>{t("businessData.shiftDefinition.sections.shifts")}</Body1Strong>
          <Button onClick={() => setManageOpen(true)}>
            {t("businessData.shiftDefinition.manage")}
          </Button>
        </div>
        {data.shifts.length === 0 ? (
          <Caption1>{t("businessData.shiftDefinition.emptySection")}</Caption1>
        ) : (
          data.shifts.map((shift) => (
            <div
              key={shift.name}
              className={sharedStyles.contentCard}
              style={{ marginTop: "8px", padding: "12px" }}
            >
              <Body1Strong>{shift.name}</Body1Strong>
              <Caption1>
                {t("businessData.shiftDefinition.shiftTimeRange", {
                  start: shift.startTime,
                  end: shift.endTime,
                })}
              </Caption1>
            </div>
          ))
        )}
      </Panel>
    );
  } else if (left === "businessData.shiftDefinition.sections.attributes") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.shiftDefinition.noAttributes")}</Body1Strong>
        </Empty>
      </Panel>
    );
  } else if (left === "businessData.shiftDefinition.sections.attachments") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.shiftDefinition.noAttachments")}</Body1Strong>
        </Empty>
      </Panel>
    );
  } else {
    content = (
      <>
        <div className={sharedStyles.contentCard} style={{ padding: "16px", marginBottom: "12px" }}>
          <Body1Strong>{t("businessData.shiftDefinition.sections.details")}</Body1Strong>
          <KV
            rows={[
              [t("businessData.shiftDefinition.detail.name"), data.name],
              [t("businessData.shiftDefinition.detail.description"), data.description],
              [
                t("businessData.shiftDefinition.detail.state"),
                t(`common.${data.state.toLowerCase()}` as TranslationKey),
              ],
              [t("businessData.shiftDefinition.detail.dataGroup"), data.dataGroup],
            ]}
          />
        </div>
        <div className={sharedStyles.contentCard} style={{ padding: "16px" }}>
          <Body1Strong>{t("businessData.shiftDefinition.detail.information")}</Body1Strong>
          <KV
            rows={[
              [t("businessData.shiftDefinition.detail.calendar"), data.calendar],
              [t("businessData.shiftDefinition.detail.startTime"), data.startTime],
            ]}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <DetailShell
        title={data.name}
        icon={<Timer24Regular />}
        topTabs={TOP_TABS}
        top={top}
        onTop={setTop}
        leftItems={LEFT_SECTIONS}
        left={left}
        onLeft={handleLeft}
        onEdit={() => setEditOpen(true)}
        onAskAi={() => {}}
        moreActions={SHIFT_DEFINITION_MORE_ACTIONS.map((action) => ({
          ...action,
          onClick: () => {
            if (action.id === "clone") setCloneOpen(true);
            else if (action.id === "terminate") setTerminateOpen(true);
            else if (action.id === "unterminate") setUnterminateOpen(true);
          },
        }))}
      >
        {content}
      </DetailShell>
      {manageOpen && (
        <ManageShiftsDialog
          definitionName={data.name}
          shifts={data.shifts}
          onClose={() => setManageOpen(false)}
        />
      )}
      {editOpen && <ShiftDefinitionEditDialog data={data} onClose={() => setEditOpen(false)} />}
      {cloneOpen && (
        <ShiftDefinitionCloneDialog sourceName={data.name} onClose={() => setCloneOpen(false)} />
      )}
      {terminateOpen && (
        <ShiftDefinitionTerminateDialog name={data.name} onClose={() => setTerminateOpen(false)} />
      )}
      {unterminateOpen && (
        <ShiftDefinitionUnterminateDialog
          name={data.name}
          onClose={() => setUnterminateOpen(false)}
        />
      )}
    </>
  );
}
