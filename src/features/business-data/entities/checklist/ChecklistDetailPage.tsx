import { useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useChecklistDetail } from "@/api";
import { DetailShell, ListPage, editAction, refreshAction } from "@/components/common";
import { Box24Regular } from "@/components/icons";
import { Text, makeStyles, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";

const useDetailStyles = makeStyles({
  cards: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "12px" },
  card: { padding: "16px", display: "flex", flexDirection: "column", rowGap: "12px" },
  cardTitle: { fontSize: "14px", fontWeight: tokens.fontWeightSemibold, paddingBottom: "8px", borderBottom: `1px solid ${tokens.colorNeutralStroke2}` },
  row: { display: "flex", columnGap: "12px", fontSize: "13px" },
  label: { color: tokens.colorNeutralForeground3, minWidth: "200px" },
  tabs: { display: "flex", columnGap: "4px", padding: "0 16px" },
  tab: { padding: "10px 16px", border: "none", backgroundColor: "transparent", cursor: "pointer", fontFamily: "inherit", fontSize: "13px", borderBottom: "2px solid transparent", ":hover": { backgroundColor: tokens.colorNeutralBackground1Hover } },
  tabActive: { fontWeight: tokens.fontWeightSemibold, borderBottom: `2px solid ${tokens.colorBrandStroke1}` },
  tabContent: { padding: "16px", flexGrow: 1, minHeight: 0, overflowY: "auto" },
  empty: { padding: "32px", textAlign: "center", color: tokens.colorNeutralForeground3 },
  split: { display: "grid", gridTemplateColumns: "minmax(320px, 2fr) 3fr", gap: "12px", alignItems: "start" },
  itemList: { display: "flex", flexDirection: "column", rowGap: "4px" },
  itemButton: { textAlign: "left", padding: "10px 12px", border: "none", backgroundColor: "transparent", cursor: "pointer", fontFamily: "inherit", fontSize: "13px", borderRadius: "4px", ":hover": { backgroundColor: tokens.colorNeutralBackground1Hover } },
  itemActive: { backgroundColor: tokens.colorBrandBackgroundInvertedSelected, fontWeight: tokens.fontWeightSemibold },
  itemDesc: { fontSize: "12px", color: tokens.colorNeutralForeground3, marginTop: "4px" },
  subTabs: { display: "flex", columnGap: "4px", borderBottom: `1px solid ${tokens.colorNeutralStroke2}`, marginBottom: "12px" },
  subTab: { padding: "8px 16px", border: "none", backgroundColor: "transparent", cursor: "pointer", fontFamily: "inherit", fontSize: "12px", textTransform: "uppercase", borderBottom: "2px solid transparent" },
  subTabActive: { color: tokens.colorBrandForeground1, borderBottom: `2px solid ${tokens.colorBrandStroke1}`, fontWeight: tokens.fontWeightSemibold },
});

const TABS = ["details", "checklistItems", "compare", "references", "history"] as const;
const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.checklist.detail.sections.details",
  "businessData.checklist.detail.sections.instances",
  "businessData.checklist.detail.sections.attachments",
];
const SUB_TABS = ["generalData", "instructions", "bom", "condition"] as const;

export function ChecklistDetailPage() {
  const { t } = useAppTranslation();
  const styles = useDetailStyles();
  const sharedStyles = useSharedStyles();
  const [tab, setTab] = useState<string>("details");
  const [left, setLeft] = useState<string>(LEFT_SECTIONS[0]);
  const [itemIdx, setItemIdx] = useState(0);
  const [subTab, setSubTab] = useState<string>("generalData");
  const { name } = useParams({ strict: false }) as { name: string };
  const displayName = decodeURIComponent(name);
  const { data: cl, isLoading } = useChecklistDetail(displayName);

  if (isLoading || !cl) {
    return (
      <ListPage header={{ icon: <Box24Regular />, title: displayName, actions: [refreshAction, editAction] }}>
        <div className={styles.empty}>{t("businessData.checklist.detail.loading")}</div>
      </ListPage>
    );
  }

  const showInstances = left === "businessData.checklist.detail.sections.instances";
  const item = cl.items[Math.min(itemIdx, cl.items.length - 1)];

  return (
    <ListPage header={{ icon: <Box24Regular />, title: `${cl.name} (${cl.state})`, actions: [refreshAction, editAction] }}>
      <div className={styles.tabs} role="tablist">
        {TABS.map((value) => (
          <button key={value} role="tab" aria-selected={tab === value}
            className={`${styles.tab} ${tab === value ? styles.tabActive : ""}`} onClick={() => setTab(value)}>
            {t(`businessData.checklist.detail.tabs.${value}`)}
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>
        {tab === "details" && (
          <DetailShell title={cl.name} icon={<Box24Regular />} topTabs={[]} top="details" onTop={() => undefined}
            leftItems={LEFT_SECTIONS} left={left} onLeft={setLeft} onEdit={() => undefined} onAskAi={() => undefined} showState={false}>
            {showInstances ? (
              <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                <Text className={styles.cardTitle}>{t("businessData.checklist.detail.instancesTitle", { count: cl.instances.length })}</Text>
                <div className={styles.itemList}>
                  {cl.instances.map((i) => (
                    <div key={i.name} className={styles.row}>
                      <span className={styles.label}>{i.name}:</span>
                      <span>{i.state}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={styles.cards}>
                <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <Text className={styles.cardTitle}>{t("businessData.checklist.detail.checklist")}</Text>
                  <KV label={t("businessData.checklist.detail.name")} value={cl.name} />
                  <KV label={t("businessData.checklist.detail.description")} value={cl.description} />
                  <KV label={t("businessData.checklist.detail.type")} value={cl.type} />
                  <KV label={t("businessData.checklist.detail.universalState")} value={cl.universalState} />
                  <KV label={t("businessData.checklist.detail.dataGroup")} value={cl.dataGroup} />
                </div>
                <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <Text className={styles.cardTitle}>{t("businessData.checklist.detail.information")}</Text>
                  <KV label={t("businessData.checklist.detail.scope")} value={cl.scope} />
                  <KV label={t("businessData.checklist.detail.executionMode")} value={cl.executionMode} />
                  <KV label={t("businessData.checklist.detail.bom")} value={cl.bom} />
                  <KV label={t("businessData.checklist.detail.product")} value={cl.product} />
                  <KV label={t("businessData.checklist.detail.materialDeviationProtocol")} value={cl.materialDeviationProtocol} />
                  <Bool label={t("businessData.checklist.detail.defineStandardTimes")} value={cl.defineStandardTimes} />
                  <Bool label={t("businessData.checklist.detail.trackExecutionTimes")} value={cl.trackExecutionTimes} />
                  <KV label={t("businessData.checklist.detail.standardDuration")} value={cl.standardDuration} />
                </div>
              </div>
            )}
          </DetailShell>
        )}
        {tab === "checklistItems" && (
          <div className={`${sharedStyles.contentCard} ${styles.card}`}>
            <Text className={styles.cardTitle}>{t("businessData.checklist.detail.itemsTitle", { count: cl.items.length })}</Text>
            <div className={styles.split}>
              <div className={styles.itemList}>
                {cl.items.map((i, idx) => (
                  <button key={i.name} className={`${styles.itemButton} ${idx === Math.min(itemIdx, cl.items.length - 1) ? styles.itemActive : ""}`} onClick={() => setItemIdx(idx)}>
                    <div>{i.name}</div>
                    <div className={styles.itemDesc}>{i.description}</div>
                  </button>
                ))}
              </div>
              {item && (
                <div>
                  <div className={styles.subTabs}>
                    {SUB_TABS.map((v) => (
                      <button key={v} className={`${styles.subTab} ${subTab === v ? styles.subTabActive : ""}`} onClick={() => setSubTab(v)}>
                        {t(`businessData.checklist.detail.subTabs.${v}`)}
                      </button>
                    ))}
                  </div>
                  {subTab === "generalData" && (
                    <div style={{ display: "flex", flexDirection: "column", rowGap: 12 }}>
                      <KV label={t("businessData.checklist.detail.itemName")} value={item.name} />
                      <KV label={t("businessData.checklist.detail.activityType")} value={item.activityType} />
                      <KV label={t("businessData.checklist.detail.trackingType")} value={item.trackingType} />
                      <KV label={t("businessData.checklist.detail.standardDuration")} value={item.standardDuration} />
                      <Bool label={t("businessData.checklist.detail.optional")} value={item.optional} />
                      <Bool label={t("businessData.checklist.detail.floating")} value={item.floating} />
                    </div>
                  )}
                  {subTab !== "generalData" && <div className={styles.empty}>{t("businessData.checklist.detail.historyEmpty")}</div>}
                </div>
              )}
            </div>
          </div>
        )}
        {!["details", "checklistItems"].includes(tab) && <div className={styles.empty}>{t("businessData.checklist.detail.historyEmpty")}</div>}
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
      <span>{value === "" ? t("businessData.checklist.detail.emptyValue") : value}</span>
    </div>
  );
}

function Bool({ label, value }: { label: string; value: boolean }) {
  const styles = useDetailStyles();
  const { t } = useAppTranslation();
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}:</span>
      <span>{value ? t("businessData.checklist.detail.yes") : t("businessData.checklist.detail.no")}</span>
    </div>
  );
}
