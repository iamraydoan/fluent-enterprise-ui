import { useState } from "react";
import { useShiftLogbookDetail } from "@/api";
import type { ShiftLogbookEntry } from "@/api";
import { DetailShell, Empty, KV, Panel } from "@/components/common";
import type { DetailTab } from "@/components/common";
import { DocumentBulletList24Regular } from "@/components/icons";
import { Body1Strong, Button, Caption1, Text } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { ShiftLogbookEntryDialog } from "./ShiftLogbookEntryDialog";
import { ShiftLogbookSignOffDialog } from "./ShiftLogbookSignOffDialog";
import { SHIFT_LOGBOOK_DETAILS_SECTION, formatEntryMeta } from "./shiftLogbookHelpers";
import { shiftLogbookMoreActions } from "./shiftLogbookMoreActions";

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "businessData.shiftLogbook.tabs.details" },
  { value: "references", labelKey: "businessData.shiftLogbook.tabs.references" },
  { value: "history", labelKey: "businessData.shiftLogbook.tabs.history" },
];

const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.shiftLogbook.sections.details",
  "businessData.shiftLogbook.sections.entries",
  "businessData.shiftLogbook.sections.attachments",
];

export function ShiftLogbookDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const sharedStyles = useSharedStyles();
  const { data, isLoading } = useShiftLogbookDetail(name);
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<TranslationKey>("businessData.shiftLogbook.sections.details");
  const [addOpen, setAddOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<ShiftLogbookEntry | undefined>(undefined);
  const [signOffOpen, setSignOffOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const handleLeft = (value: string) => setLeft(value as TranslationKey);

  if (isLoading || data === undefined) {
    return (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.shiftLogbook.notFound")}</Body1Strong>
        </Empty>
      </Panel>
    );
  }

  let content;
  if (top !== "details") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.shiftLogbook.emptySection")}</Body1Strong>
        </Empty>
      </Panel>
    );
  } else if (left === "businessData.shiftLogbook.sections.entries") {
    content = (
      <Panel>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Body1Strong>
            {t("businessData.shiftLogbook.sections.entries")} ({data.entries.length})
          </Body1Strong>
          <Button appearance="primary" onClick={() => setAddOpen(true)}>
            {t("businessData.shiftLogbook.addEntry.add")}
          </Button>
        </div>
        <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", rowGap: "8px" }}>
          {data.entries.length === 0 ? (
            <Caption1>{t("businessData.shiftLogbook.emptySection")}</Caption1>
          ) : (
            data.entries.map((entry, i) => (
              <div key={i} className={sharedStyles.contentCard} style={{ padding: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Body1Strong>{entry.title}</Body1Strong>
                  <Button appearance="subtle" onClick={() => setEditEntry(entry)}>
                    {t("actionBar.edit")}
                  </Button>
                </div>
                <Caption1>{formatEntryMeta(entry)}</Caption1>
                <Text>{entry.description}</Text>
              </div>
            ))
          )}
        </div>
      </Panel>
    );
  } else if (left === "businessData.shiftLogbook.sections.attachments") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("businessData.shiftLogbook.noAttachments")}</Body1Strong>
        </Empty>
      </Panel>
    );
  } else {
    content = (
      <>
        <div className={sharedStyles.contentCard} style={{ padding: "16px", marginBottom: "12px" }}>
          <Body1Strong>{t("businessData.shiftLogbook.sections.details")}</Body1Strong>
          <KV
            rows={[
              [t("businessData.shiftLogbook.detail.name"), data.name],
              [t("businessData.shiftLogbook.detail.area"), data.area],
              [
                t("businessData.shiftLogbook.detail.state"),
                t(`common.${data.state.toLowerCase()}` as TranslationKey),
              ],
              [t("businessData.shiftLogbook.detail.systemState"), data.systemState],
              [t("businessData.shiftLogbook.detail.dataGroup"), data.dataGroup],
            ]}
          />
        </div>
        <div className={sharedStyles.contentCard} style={{ padding: "16px", marginBottom: "12px" }}>
          <Body1Strong>{t("businessData.shiftLogbook.detail.shiftInfo")}</Body1Strong>
          <KV
            rows={[
              [t("businessData.shiftLogbook.detail.shiftDefinition"), data.shiftDefinition],
              [t("businessData.shiftLogbook.detail.shift"), data.shift],
              [t("businessData.shiftLogbook.detail.calendarDay"), data.calendarDay],
              [t("businessData.shiftLogbook.detail.team"), data.team],
            ]}
          />
        </div>
        {summaryOpen && (
          <div className={sharedStyles.contentCard} style={{ padding: "16px" }}>
            <Body1Strong>{t("businessData.shiftLogbook.summary.title")}</Body1Strong>
            <Text style={{ marginTop: "8px" }}>
              {t("businessData.shiftLogbook.summary.content", {
                count: data.entries.length,
                area: data.area,
                shift: data.shift,
              })}
            </Text>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <DetailShell
        title={data.name}
        icon={<DocumentBulletList24Regular />}
        topTabs={TOP_TABS}
        top={top}
        onTop={setTop}
        leftItems={LEFT_SECTIONS}
        left={left}
        onLeft={handleLeft}
        onEdit={() => {}}
        onAskAi={() => {}}
        moreActions={shiftLogbookMoreActions.map((action) => ({
          ...action,
          onClick: () => {
            if (action.id === "signOff") setSignOffOpen(true);
            else if (action.id === "summarize") {
              setSummaryOpen(true);
              setLeft(SHIFT_LOGBOOK_DETAILS_SECTION);
            }
          },
        }))}
      >
        {content}
      </DetailShell>
      {addOpen && <ShiftLogbookEntryDialog onClose={() => setAddOpen(false)} />}
      {editEntry !== undefined && (
        <ShiftLogbookEntryDialog initial={editEntry} onClose={() => setEditEntry(undefined)} />
      )}
      {signOffOpen && (
        <ShiftLogbookSignOffDialog entries={data.entries} onClose={() => setSignOffOpen(false)} />
      )}
    </>
  );
}
