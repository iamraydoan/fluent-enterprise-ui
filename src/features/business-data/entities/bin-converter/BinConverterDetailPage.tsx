import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useBinConverterDetail } from "@/api";
import {
  DetailShell,
  ListPage,
  cloneAction,
  editAction,
  refreshAction,
  terminateAction,
  unterminateAction,
} from "@/components/common";
import type { HeaderAction } from "@/components/common";
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
import { useBinConverterDialogs } from "./useBinConverterDialogs";

const useDetailStyles = makeStyles({
  cards: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "12px" },
  card: { padding: "16px", display: "flex", flexDirection: "column", rowGap: "12px" },
  cardTitle: { fontSize: "14px", fontWeight: tokens.fontWeightSemibold, paddingBottom: "8px", borderBottom: `1px solid ${tokens.colorNeutralStroke2}` },
  row: { display: "flex", columnGap: "12px", fontSize: "13px" },
  label: { color: tokens.colorNeutralForeground3, minWidth: "140px" },
  tabs: { display: "flex", columnGap: "4px", padding: "0 16px" },
  tab: { padding: "10px 16px", border: "none", backgroundColor: "transparent", cursor: "pointer", fontFamily: "inherit", fontSize: "13px", borderBottom: "2px solid transparent", ":hover": { backgroundColor: tokens.colorNeutralBackground1Hover } },
  tabActive: { fontWeight: tokens.fontWeightSemibold, borderBottom: `2px solid ${tokens.colorBrandStroke1}` },
  tabContent: { padding: "16px", flexGrow: 1, minHeight: 0, overflowY: "auto" },
  empty: { padding: "32px", textAlign: "center", color: tokens.colorNeutralForeground3 },
});

const TABS = ["details", "compare", "references", "history"] as const;
const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.binConverter.detail.sections.details",
  "businessData.binConverter.detail.sections.conversions",
  "businessData.binConverter.detail.sections.attachments",
];

export function BinConverterDetailPage() {
  const { t } = useAppTranslation();
  const styles = useDetailStyles();
  const sharedStyles = useSharedStyles();
  const [tab, setTab] = useState<string>("details");
  const [left, setLeft] = useState<string>(LEFT_SECTIONS[0]);
  const { name } = useParams({ strict: false }) as { name: string };
  const displayName = decodeURIComponent(name);
  const { data: bc, isLoading } = useBinConverterDetail(displayName);
  const { dialogs, openEdit, openClone, openTerminate, openUnterminate } =
    useBinConverterDialogs(bc);

  if (isLoading || !bc) {
    return (
      <ListPage header={{ icon: <Box24Regular />, title: displayName, actions: [refreshAction, editAction] }}>
        <div className={styles.empty}>{t("businessData.binConverter.detail.loading")}</div>
      </ListPage>
    );
  }

  const showConversions = left === "businessData.binConverter.detail.sections.conversions";

  const detailActions: HeaderAction[] = [
    refreshAction,
    { ...editAction, onClick: openEdit },
    { ...cloneAction, onClick: openClone },
    bc?.state === "Terminated"
      ? { ...unterminateAction, onClick: openUnterminate }
      : { ...terminateAction, onClick: openTerminate },
  ];

  return (
    <ListPage
      header={{ icon: <Box24Regular />, title: `${bc.name} (${bc.state})`, actions: detailActions }}
    >
      {dialogs}
      <div className={styles.tabs} role="tablist">
        {TABS.map((value) => (
          <button key={value} role="tab" aria-selected={tab === value}
            className={`${styles.tab} ${tab === value ? styles.tabActive : ""}`} onClick={() => setTab(value)}>
            {t(`businessData.binConverter.detail.tabs.${value}`)}
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>
        {tab === "details" && (
          <DetailShell title={bc.name} icon={<Box24Regular />} topTabs={[]} top="details" onTop={() => undefined}
            leftItems={LEFT_SECTIONS} left={left} onLeft={setLeft} onEdit={() => undefined} onAskAi={() => undefined} showState={false}>
            {showConversions ? (
              <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                <Text className={styles.cardTitle}>{t("businessData.binConverter.detail.conversionsTitle", { count: bc.conversions.length })}</Text>
                <Table>
                  <TableHeader><TableRow>
                    <TableHeaderCell>{t("businessData.binConverter.detail.convColumns.fromBinCode")}</TableHeaderCell>
                    <TableHeaderCell>{t("businessData.binConverter.detail.convColumns.toBinCode")}</TableHeaderCell>
                    <TableHeaderCell>{t("businessData.binConverter.detail.convColumns.toBinDescription")}</TableHeaderCell>
                    <TableHeaderCell>{t("businessData.binConverter.detail.convColumns.toBinQuality")}</TableHeaderCell>
                    <TableHeaderCell>{t("businessData.binConverter.detail.convColumns.toBinColor")}</TableHeaderCell>
                  </TableRow></TableHeader>
                  <TableBody>
                    {bc.conversions.map((c) => (
                      <TableRow key={c.fromBinCode}>
                        <TableCell>{c.fromBinCode}</TableCell><TableCell>{c.toBinCode}</TableCell>
                        <TableCell>{c.toBinDescription}</TableCell><TableCell>{c.toBinQuality}</TableCell>
                        <TableCell>{c.toBinColor}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className={styles.cards}>
                <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <Text className={styles.cardTitle}>{t("businessData.binConverter.detail.binConverter")}</Text>
                  <KV label={t("businessData.binConverter.detail.name")} value={bc.name} />
                  <KV label={t("businessData.binConverter.detail.description")} value={bc.description} />
                  <KV label={t("businessData.binConverter.detail.universalState")} value={bc.universalState} />
                  <KV label={t("businessData.binConverter.detail.dataGroup")} value={bc.dataGroup} />
                </div>
                <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <KV label={t("businessData.binConverter.detail.converterType")} value={bc.converterType} />
                  <KV label={t("businessData.binConverter.detail.binType")} value={bc.binType} />
                </div>
              </div>
            )}
          </DetailShell>
        )}
        {tab !== "details" && <div className={styles.empty}>{t("businessData.binConverter.detail.historyEmpty")}</div>}
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
      <span>{value === "" ? t("businessData.binConverter.detail.emptyValue") : value}</span>
    </div>
  );
}
