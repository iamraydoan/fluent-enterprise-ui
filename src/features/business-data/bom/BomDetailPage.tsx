import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useBomDetail } from "@/api";
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
import { Box24Regular, MoreVertical24Regular } from "@/components/icons";
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
import { useBomDialogs } from "./useBomDialogs";

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
  label: { color: tokens.colorNeutralForeground3, minWidth: "140px" },
  tabs: { display: "flex", columnGap: "4px", padding: "0 16px" },
  tab: {
    padding: "10px 16px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "13px",
    borderBottom: "2px solid transparent",
    ":hover": { backgroundColor: tokens.colorNeutralBackground1Hover },
  },
  tabActive: {
    fontWeight: tokens.fontWeightSemibold,
    borderBottom: `2px solid ${tokens.colorBrandStroke1}`,
  },
  tabContent: { padding: "16px", flexGrow: 1, minHeight: 0, overflowY: "auto" },
  empty: { padding: "32px", textAlign: "center", color: tokens.colorNeutralForeground3 },
  itemsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
});

const TABS = ["details", "compare", "references", "history"] as const;
type BomTab = (typeof TABS)[number];

const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.bom.detail.sections.details",
  "businessData.bom.detail.sections.bomItems",
  "businessData.bom.detail.sections.instances",
  "businessData.bom.detail.sections.attachments",
];

export function BomDetailPage() {
  const { t } = useAppTranslation();
  const styles = useDetailStyles();
  const sharedStyles = useSharedStyles();
  const [tab, setTab] = useState<BomTab>("details");
  const [left, setLeft] = useState<string>(LEFT_SECTIONS[0]);
  const { name } = useParams({ strict: false }) as { name: string };
  const displayName = decodeURIComponent(name);
  const { data: bom, isLoading } = useBomDetail(displayName);
  const { dialogs, openEdit, openClone, openTerminate, openUnterminate, openManageItems } =
    useBomDialogs(bom);

  if (isLoading || !bom) {
    return (
      <ListPage
        header={{
          icon: <Box24Regular />,
          title: displayName,
          actions: [refreshAction, editAction],
        }}
      >
        <div className={styles.empty}>{t("businessData.bom.detail.loading")}</div>
      </ListPage>
    );
  }

  const showItems = left === "businessData.bom.detail.sections.bomItems";

  const detailActions: HeaderAction[] = [
    refreshAction,
    { ...editAction, onClick: openEdit },
    { ...cloneAction, onClick: openClone },
    bom?.state === "Terminated"
      ? { ...unterminateAction, onClick: openUnterminate }
      : { ...terminateAction, onClick: openTerminate },
    {
      id: "more",
      icon: <MoreVertical24Regular />,
      labelKey: "actionBar.more",
      menu: [{ label: t("businessData.bom.operations.manageItems"), onClick: openManageItems }],
    },
  ];

  return (
    <ListPage
      header={{
        icon: <Box24Regular />,
        title: `${bom.name} (${bom.state})`,
        actions: detailActions,
      }}
    >
      {dialogs}
      <div className={styles.tabs} role="tablist">
        {TABS.map((value) => (
          <button
            key={value}
            role="tab"
            aria-selected={tab === value}
            className={`${styles.tab} ${tab === value ? styles.tabActive : ""}`}
            onClick={() => setTab(value)}
          >
            {t(`businessData.bom.detail.tabs.${value}`)}
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>
        {tab === "details" && (
          <DetailShell
            title={bom.name}
            icon={<Box24Regular />}
            topTabs={[]}
            top="details"
            onTop={() => undefined}
            leftItems={LEFT_SECTIONS}
            left={left}
            onLeft={setLeft}
            onEdit={() => undefined}
            onAskAi={() => undefined}
            showState={false}
          >
            {showItems ? (
              <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                <div className={styles.itemsHeader}>
                  <Text className={styles.cardTitle}>
                    {t("businessData.bom.detail.bomItemsTitle", { count: bom.items.length })}
                  </Text>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHeaderCell>
                        {t("businessData.bom.detail.itemColumns.item")}
                      </TableHeaderCell>
                      <TableHeaderCell>
                        {t("businessData.bom.detail.itemColumns.product")}
                      </TableHeaderCell>
                      <TableHeaderCell>
                        {t("businessData.bom.detail.itemColumns.quantity")}
                      </TableHeaderCell>
                      <TableHeaderCell>
                        {t("businessData.bom.detail.itemColumns.units")}
                      </TableHeaderCell>
                      <TableHeaderCell>
                        {t("businessData.bom.detail.itemColumns.position")}
                      </TableHeaderCell>
                      <TableHeaderCell>
                        {t("businessData.bom.detail.itemColumns.source")}
                      </TableHeaderCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bom.items.map((item) => (
                      <TableRow key={item.item}>
                        <TableCell>{item.item}</TableCell>
                        <TableCell>{item.product}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.units}</TableCell>
                        <TableCell>{item.position}</TableCell>
                        <TableCell>{item.source}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className={styles.cards}>
                <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <Text className={styles.cardTitle}>{t("businessData.bom.detail.bom")}</Text>
                  <KV label={t("businessData.bom.detail.name")} value={bom.name} />
                  <KV label={t("businessData.bom.detail.description")} value={bom.description} />
                  <KV label={t("businessData.bom.detail.type")} value={bom.type} />
                  <KV
                    label={t("businessData.bom.detail.universalState")}
                    value={bom.universalState}
                  />
                  <KV label={t("businessData.bom.detail.dataGroup")} value={bom.dataGroup} />
                </div>
                <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <Text className={styles.cardTitle}>{t("businessData.bom.detail.changeSet")}</Text>
                  <KV label={t("businessData.bom.detail.changeSetLabel")} value={bom.changeSet} />
                </div>
                <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <Text className={styles.cardTitle}>
                    {t("businessData.bom.detail.information")}
                  </Text>
                  <KV label={t("businessData.bom.detail.scope")} value={bom.scope} />
                  <KV label={t("businessData.bom.detail.product")} value={bom.product} />
                  <KV
                    label={t("businessData.bom.detail.baseQuantity")}
                    value={String(bom.baseQuantity)}
                  />
                  <KV label={t("businessData.bom.detail.units")} value={bom.units} />
                  <KV
                    label={t("businessData.bom.detail.useTolerances")}
                    value={
                      bom.useTolerances
                        ? t("businessData.bom.detail.yes")
                        : t("businessData.bom.detail.no")
                    }
                  />
                  <KV
                    label={t("businessData.bom.detail.useMixedAssembly")}
                    value={
                      bom.useMixedAssembly
                        ? t("businessData.bom.detail.yes")
                        : t("businessData.bom.detail.no")
                    }
                  />
                </div>
              </div>
            )}
          </DetailShell>
        )}
        {tab !== "details" && (
          <div className={styles.empty}>{t("businessData.bom.detail.historyEmpty")}</div>
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
      <span>{value === "" ? t("businessData.bom.detail.emptyValue") : value}</span>
    </div>
  );
}
