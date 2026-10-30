import { useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useCalendarDetail } from "@/api";
import { DetailShell, ListPage, editAction, refreshAction } from "@/components/common";
import { Box24Regular } from "@/components/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  makeStyles,
  tokens,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";

const useDetailStyles = makeStyles({
  cards: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "12px" },
  card: { padding: "16px", display: "flex", flexDirection: "column", rowGap: "12px" },
  cardTitle: { fontSize: "14px", fontWeight: tokens.fontWeightSemibold, paddingBottom: "8px", borderBottom: `1px solid ${tokens.colorNeutralStroke2}` },
  row: { display: "flex", columnGap: "12px", fontSize: "13px" },
  label: { color: tokens.colorNeutralForeground3, minWidth: "190px" },
  tabs: { display: "flex", columnGap: "4px", padding: "0 16px" },
  tab: { padding: "10px 16px", border: "none", backgroundColor: "transparent", cursor: "pointer", fontFamily: "inherit", fontSize: "13px", borderBottom: "2px solid transparent", ":hover": { backgroundColor: tokens.colorNeutralBackground1Hover } },
  tabActive: { fontWeight: tokens.fontWeightSemibold, borderBottom: `2px solid ${tokens.colorBrandStroke1}` },
  tabContent: { padding: "16px", flexGrow: 1, minHeight: 0, overflowY: "auto" },
  empty: { padding: "32px", textAlign: "center", color: tokens.colorNeutralForeground3 },
  yearGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "16px" },
  monthCell: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" },
  dayCell: { aspectRatio: "1.2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", borderRadius: "4px" },
  dayWorking: { backgroundColor: tokens.colorPaletteGreenBackground2 },
  dayNonWorking: { backgroundColor: tokens.colorNeutralBackground3 },
  monthTitle: { fontSize: "14px", fontWeight: tokens.fontWeightSemibold, textAlign: "center", marginBottom: "8px" },
  weekdayHeader: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", marginBottom: "4px" },
  weekday: { fontSize: "11px", color: tokens.colorNeutralForeground3, textAlign: "center" },
  legend: { display: "flex", columnGap: "16px", marginTop: "16px", fontSize: "12px" },
  legendSwatch: { width: "12px", height: "12px", display: "inline-block", marginRight: "6px", borderRadius: "2px", verticalAlign: "middle" },
});

const TABS = ["details", "calendarDays", "references", "history"] as const;
const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.calendar.detail.sections.details",
  "businessData.calendar.detail.sections.weekDefinition",
  "businessData.calendar.detail.sections.attachments",
];

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const WEEKDAY_SHORT = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function MonthGrid({ year, month }: { year: number; month: number }) {
  const styles = useDetailStyles();
  const first = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<{ day: number | null; working: boolean }> = [];
  for (let i = 0; i < first; i++) cells.push({ day: null, working: false });
  for (let d = 1; d <= daysInMonth; d++) {
    const dow = new Date(year, month, d).getDay();
    cells.push({ day: d, working: dow !== 0 && dow !== 6 });
  }
  return (
    <div>
      <div className={styles.monthTitle}>{MONTH_NAMES[month]} {year}</div>
      <div className={styles.weekdayHeader}>{WEEKDAY_SHORT.map((w) => <span key={w} className={styles.weekday}>{w}</span>)}</div>
      <div className={styles.monthCell}>
        {cells.map((c, i) => (
          <div key={i} className={`${styles.dayCell} ${c.day !== null ? (c.working ? styles.dayWorking : styles.dayNonWorking) : ""}`}>
            {c.day ?? ""}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CalendarDetailPage() {
  const { t } = useAppTranslation();
  const styles = useDetailStyles();
  const sharedStyles = useSharedStyles();
  const [tab, setTab] = useState<string>("details");
  const [left, setLeft] = useState<string>(LEFT_SECTIONS[0]);
  const { name } = useParams({ strict: false }) as { name: string };
  const displayName = decodeURIComponent(name);
  const { data: cal, isLoading } = useCalendarDetail(displayName);

  if (isLoading || !cal) {
    return (
      <ListPage header={{ icon: <Box24Regular />, title: displayName, actions: [refreshAction, editAction] }}>
        <div className={styles.empty}>{t("businessData.calendar.detail.loading")}</div>
      </ListPage>
    );
  }

  const showWeek = left === "businessData.calendar.detail.sections.weekDefinition";

  return (
    <ListPage header={{ icon: <Box24Regular />, title: `${cal.name} (${cal.state})`, actions: [refreshAction, editAction] }}>
      <div className={styles.tabs} role="tablist">
        {TABS.map((value) => (
          <button key={value} role="tab" aria-selected={tab === value}
            className={`${styles.tab} ${tab === value ? styles.tabActive : ""}`} onClick={() => setTab(value)}>
            {t(`businessData.calendar.detail.tabs.${value}`)}
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>
        {tab === "details" && (
          <DetailShell title={cal.name} icon={<Box24Regular />} topTabs={[]} top="details" onTop={() => undefined}
            leftItems={LEFT_SECTIONS} left={left} onLeft={setLeft} onEdit={() => undefined} onAskAi={() => undefined} showState={false}>
            {showWeek ? (
              <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                <Text className={styles.cardTitle}>{t("businessData.calendar.detail.weekDaysTitle", { count: cal.weekDefinition.length })}</Text>
                <Table>
                  <TableHeader><TableRow>
                    <TableHeaderCell>{t("businessData.calendar.detail.weekColumns.day")}</TableHeaderCell>
                    <TableHeaderCell>{t("businessData.calendar.detail.weekColumns.shiftDefinition")}</TableHeaderCell>
                    <TableHeaderCell>{t("businessData.calendar.detail.weekColumns.costOvertimeFactor")}</TableHeaderCell>
                  </TableRow></TableHeader>
                  <TableBody>
                    {cal.weekDefinition.map((w) => (
                      <TableRow key={w.day}>
                        <TableCell>{w.day}</TableCell>
                        <TableCell>{w.shiftDefinition}</TableCell>
                        <TableCell>{w.costOvertimeFactor}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className={styles.cards}>
                <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <Text className={styles.cardTitle}>{t("businessData.calendar.detail.calendar")}</Text>
                  <KV label={t("businessData.calendar.detail.name")} value={cal.name} />
                  <KV label={t("businessData.calendar.detail.description")} value={cal.description} />
                  <KV label={t("businessData.calendar.detail.universalState")} value={cal.universalState} />
                  <KV label={t("businessData.calendar.detail.dataGroup")} value={cal.dataGroup} />
                </div>
                <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <Text className={styles.cardTitle}>{t("businessData.calendar.detail.information")}</Text>
                  <KV label={t("businessData.calendar.detail.timeZone")} value={cal.timeZone} />
                  <KV label={t("businessData.calendar.detail.clockInEarlyStart")} value={String(cal.clockInEarlyStartMinutes)} />
                  <KV label={t("businessData.calendar.detail.enterpriseReporting")} value={cal.enterpriseWideReportingDimension ? t("businessData.calendar.detail.yes") : t("businessData.calendar.detail.no")} />
                  <KV label={t("businessData.calendar.detail.fiscalStartDay")} value={String(cal.fiscalStartDay)} />
                  <KV label={t("businessData.calendar.detail.fiscalStartMonth")} value={cal.fiscalStartMonth} />
                  <KV label={t("businessData.calendar.detail.weekStartDay")} value={cal.weekStartDay} />
                  <KV label={t("businessData.calendar.detail.dayStartTime")} value={cal.dayStartTime} />
                </div>
              </div>
            )}
          </DetailShell>
        )}
        {tab === "calendarDays" && (
          <div className={sharedStyles.contentCard} style={{ padding: 16 }}>
            <div className={styles.yearGrid}>
              {Array.from({ length: 12 }, (_, m) => <MonthGrid key={m} year={2026} month={m} />)}
            </div>
            <div className={styles.legend}>
              <span><span className={styles.legendSwatch} style={{ backgroundColor: tokens.colorPaletteGreenBackground2 }} />{t("businessData.calendar.detail.legendWorking")}</span>
              <span><span className={styles.legendSwatch} style={{ backgroundColor: tokens.colorNeutralBackground3 }} />{t("businessData.calendar.detail.legendNonWorking")}</span>
            </div>
          </div>
        )}
        {tab !== "details" && tab !== "calendarDays" && <div className={styles.empty}>{t("businessData.calendar.detail.historyEmpty")}</div>}
      </div>
    </ListPage>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  const styles = useDetailStyles();
  const { t } = useAppTranslation();
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}:</span>
      <span>{value === "" ? t("businessData.calendar.detail.emptyValue") : value}</span>
    </div>
  );
}
