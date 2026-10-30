import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useAreaDetail } from "@/api";
import {
  DetailShell,
  ListPage,
  editAction,
  refreshAction,
} from "@/components/common";
import { Box24Regular } from "@/components/icons";
import { Text, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";

const useDetailStyles = makeStyles({
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "12px",
  },
  card: { padding: "16px", display: "flex", flexDirection: "column", rowGap: "12px" },
  cardTitle: {
    fontSize: "14px",
    fontWeight: tokens.fontWeightSemibold,
    paddingBottom: "8px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  row: { display: "flex", columnGap: "12px", fontSize: "13px" },
  label: { color: tokens.colorNeutralForeground3, minWidth: "120px" },
  tabs: { display: "flex", columnGap: "4px", padding: "0 16px" },
  tab: {
    padding: "10px 16px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "13px",
    borderBottom: `2px solid transparent`,
    ":hover": { backgroundColor: tokens.colorNeutralBackground1Hover },
  },
  tabActive: {
    fontWeight: tokens.fontWeightSemibold,
    borderBottom: `2px solid ${tokens.colorBrandStroke1}`,
  },
  tabContent: { padding: "16px", flexGrow: 1, minHeight: 0, overflowY: "auto" },
  empty: { padding: "32px", textAlign: "center", color: tokens.colorNeutralForeground3 },
});

const TABS = ["details", "areaView", "maintenance", "references", "history"] as const;
type AreaTab = (typeof TABS)[number];

const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.area.detail.sections.details",
  "businessData.area.detail.sections.steps",
  "businessData.area.detail.sections.resources",
  "businessData.area.detail.sections.subAreas",
  "businessData.area.detail.sections.attachments",
];

export function AreaDetailPage() {
  const { name } = useParams({ strict: false }) as { name: string };
  const { t } = useAppTranslation();
  const styles = useDetailStyles();
  const sharedStyles = useSharedStyles();
  const [tab, setTab] = useState<AreaTab>("details");
  const [left, setLeft] = useState<string>(LEFT_SECTIONS[0]);
  const { data: area, isLoading } = useAreaDetail(decodeURIComponent(name));

  if (isLoading || !area) {
    return (
      <ListPage
        header={{
          icon: <Box24Regular />,
          title: decodeURIComponent(name),
          actions: [refreshAction, editAction],
        }}
      >
        <div className={styles.empty}>{t("businessData.area.detail.loading")}</div>
      </ListPage>
    );
  }

  return (
    <ListPage
      header={{
        icon: <Box24Regular />,
        title: `${area.name} (${area.state})`,
        actions: [refreshAction, editAction],
      }}
    >
      <div className={styles.tabs} role="tablist">
        {TABS.map((value) => (
          <button
            key={value}
            role="tab"
            aria-selected={tab === value}
            className={`${styles.tab} ${tab === value ? styles.tabActive : ""}`}
            onClick={() => setTab(value)}
          >
            {t(`businessData.area.detail.tabs.${value}`)}
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>
        {tab === "details" && (
          <DetailShell
            title={area.name}
            icon={<Box24Regular />}
            topTabs={[]}
            top=""
            onTop={() => undefined}
            leftItems={[...LEFT_SECTIONS]}
            left={left}
            onLeft={setLeft}
            onEdit={() => undefined}
            onAskAi={() => undefined}
            showState={false}
          >
            <div className={styles.cards}>
              <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                <Text className={styles.cardTitle}>{t("businessData.area.detail.area")}</Text>
                <KV label={t("businessData.area.detail.name")} value={area.name} />
                <KV label={t("businessData.area.detail.description")} value={area.description} />
                <KV label={t("businessData.area.detail.type")} value={area.type} />
                <KV
                  label={t("businessData.area.detail.universalState")}
                  value={area.universalState}
                />
                <KV label={t("businessData.area.detail.dataGroup")} value={area.dataGroup} />
              </div>
              <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                <Text className={styles.cardTitle}>{t("businessData.area.detail.information")}</Text>
                <KV label={t("businessData.area.detail.facility")} value={area.facility} />
                <KV
                  label={t("businessData.area.detail.displayOrder")}
                  value={String(area.displayOrder)}
                />
                <KV label={t("businessData.area.detail.areaType")} value={area.areaType} />
              </div>
              <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                <Text className={styles.cardTitle}>{t("businessData.area.detail.planning")}</Text>
                <KV label={t("businessData.area.detail.calendar")} value={area.calendar} />
                <KV label={t("businessData.area.detail.schedule")} value={area.schedule} />
                <KV label={t("businessData.area.detail.costCenter")} value={area.costCenter} />
              </div>
              <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                <Text className={styles.cardTitle}>{t("businessData.area.detail.shiftLogbooks")}</Text>
                <KV
                  label={t("businessData.area.detail.enableShiftLogbook")}
                  value={area.enableShiftLogbook ? t("businessData.area.detail.yes") : t("businessData.area.detail.no")}
                />
              </div>
            </div>
          </DetailShell>
        )}
        {tab !== "details" && (
          <div className={styles.empty}>{t("businessData.area.detail.historyEmpty")}</div>
        )}
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
      <span>{value === "" ? t("businessData.area.detail.emptyValue") : value}</span>
    </div>
  );
}
