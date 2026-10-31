import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useChangeSetDetail } from "@/api";
import {
  DetailShell,
  ListPage,
  cloneAction,
  editAction,
  refreshAction,
  terminateAction,
} from "@/components/common";
import type { HeaderAction } from "@/components/common";
import {
  Box24Regular,
  Checkmark16Filled,
  MoreVertical24Regular,
  Send24Regular,
} from "@/components/icons";
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
import { useChangeSetDialogs } from "./useChangeSetDialogs";

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
  label: { color: tokens.colorNeutralForeground3, minWidth: "180px" },
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
});

const TABS = ["details", "references", "history"] as const;
const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.changeSet.detail.sections.details",
  "businessData.changeSet.detail.sections.items",
  "businessData.changeSet.detail.sections.subscribers",
  "businessData.changeSet.detail.sections.attachments",
];

export function ChangeSetDetailPage() {
  const { t } = useAppTranslation();
  const styles = useDetailStyles();
  const sharedStyles = useSharedStyles();
  const [tab, setTab] = useState<string>("details");
  const [left, setLeft] = useState<string>(LEFT_SECTIONS[0]);
  const { name } = useParams({ strict: false }) as { name: string };
  const displayName = decodeURIComponent(name);
  const { data: cs, isLoading } = useChangeSetDetail(displayName);
  const {
    dialogs,
    openEdit,
    openClone,
    openTerminate,
    openTransition,
    openManageItems,
    openCreateItems,
    openApproveItems,
    openCompareItems,
    openTransferItems,
    openManageReviewers,
    openManageSubscribers,
    openTakeOwnership,
    openChange,
  } = useChangeSetDialogs(cs);

  if (isLoading || !cs) {
    return (
      <ListPage
        header={{
          icon: <Box24Regular />,
          title: displayName,
          actions: [refreshAction, editAction],
        }}
      >
        <div className={styles.empty}>{t("businessData.changeSet.detail.loading")}</div>
      </ListPage>
    );
  }

  const detailActions: HeaderAction[] = [
    refreshAction,
    { ...editAction, onClick: openEdit },
    { ...cloneAction, onClick: openClone },
    { ...terminateAction, onClick: openTerminate },
    {
      id: "requestApproval",
      icon: <Send24Regular />,
      labelKey: "businessData.changeSet.operations.requestApproval",
      onClick: () => openTransition("requestApproval"),
    },
    {
      id: "approve",
      icon: <Checkmark16Filled />,
      labelKey: "businessData.changeSet.operations.approve",
      onClick: () => openTransition("approve"),
    },
    {
      id: "more",
      icon: <MoreVertical24Regular />,
      labelKey: "actionBar.more",
      menu: [
        {
          label: t("businessData.changeSet.operations.reject"),
          onClick: () => openTransition("reject"),
        },
        {
          label: t("businessData.changeSet.operations.rework"),
          onClick: () => openTransition("rework"),
        },
        {
          label: t("businessData.changeSet.operations.cancel"),
          onClick: () => openTransition("cancel"),
        },
        { label: t("businessData.changeSet.operations.manageItems"), onClick: openManageItems },
        { label: t("businessData.changeSet.operations.createItems"), onClick: openCreateItems },
        { label: t("businessData.changeSet.operations.approveItems"), onClick: openApproveItems },
        { label: t("businessData.changeSet.operations.compareItems"), onClick: openCompareItems },
        { label: t("businessData.changeSet.operations.transferItems"), onClick: openTransferItems },
        {
          label: t("businessData.changeSet.operations.manageStateReviewers"),
          onClick: openManageReviewers,
        },
        {
          label: t("businessData.changeSet.operations.manageSubscribers"),
          onClick: openManageSubscribers,
        },
        { label: t("businessData.changeSet.operations.takeOwnership"), onClick: openTakeOwnership },
        { label: t("businessData.changeSet.operations.change"), onClick: openChange },
      ],
    },
  ];

  const showItems = left === "businessData.changeSet.detail.sections.items";
  const showSubscribers = left === "businessData.changeSet.detail.sections.subscribers";

  return (
    <ListPage
      header={{ icon: <Box24Regular />, title: `${cs.name} (${cs.state})`, actions: detailActions }}
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
            {t(`businessData.changeSet.detail.tabs.${value}`)}
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>
        {tab === "details" && (
          <DetailShell
            title={cs.name}
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
                <Text className={styles.cardTitle}>
                  {t("businessData.changeSet.detail.itemsTitle", { count: cs.items.length })}
                </Text>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHeaderCell>
                        {t("businessData.changeSet.detail.itemColumns.name")}
                      </TableHeaderCell>
                      <TableHeaderCell>
                        {t("businessData.changeSet.detail.itemColumns.type")}
                      </TableHeaderCell>
                      <TableHeaderCell>
                        {t("businessData.changeSet.detail.itemColumns.approvalRole")}
                      </TableHeaderCell>
                      <TableHeaderCell>
                        {t("businessData.changeSet.detail.itemColumns.approver")}
                      </TableHeaderCell>
                      <TableHeaderCell>
                        {t("businessData.changeSet.detail.itemColumns.approvalDate")}
                      </TableHeaderCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cs.items.map((i) => (
                      <TableRow key={i.name}>
                        <TableCell>{i.name}</TableCell>
                        <TableCell>{i.type}</TableCell>
                        <TableCell>
                          {i.approvalRole === ""
                            ? t("businessData.changeSet.detail.emptyValue")
                            : i.approvalRole}
                        </TableCell>
                        <TableCell>
                          {i.approver === ""
                            ? t("businessData.changeSet.detail.emptyValue")
                            : i.approver}
                        </TableCell>
                        <TableCell>
                          {i.approvalDate === ""
                            ? t("businessData.changeSet.detail.emptyValue")
                            : i.approvalDate}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : showSubscribers ? (
              <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                <Text className={styles.cardTitle}>
                  {t("businessData.changeSet.detail.subscribersTitle", {
                    count: cs.subscribers.length,
                  })}
                </Text>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHeaderCell>
                        {t("businessData.changeSet.detail.subscriberColumns.name")}
                      </TableHeaderCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cs.subscribers.map((s) => (
                      <TableRow key={s.name}>
                        <TableCell>{s.name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className={styles.cards}>
                <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <Text className={styles.cardTitle}>
                    {t("businessData.changeSet.detail.changeSet")}
                  </Text>
                  <KV label={t("businessData.changeSet.detail.name")} value={cs.name} />
                  <KV
                    label={t("businessData.changeSet.detail.description")}
                    value={cs.description}
                  />
                  <KV label={t("businessData.changeSet.detail.type")} value={cs.type} />
                  <KV
                    label={t("businessData.changeSet.detail.universalState")}
                    value={cs.universalState}
                  />
                  <KV
                    label={t("businessData.changeSet.detail.systemState")}
                    value={cs.systemState}
                  />
                  <KV label={t("businessData.changeSet.detail.dataGroup")} value={cs.dataGroup} />
                </div>
                <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <Text className={styles.cardTitle}>
                    {t("businessData.changeSet.detail.information")}
                  </Text>
                  <KV label={t("businessData.changeSet.detail.category")} value={cs.category} />
                  <KV label={t("businessData.changeSet.detail.urgency")} value={cs.urgency} />
                  <KV label={t("businessData.changeSet.detail.owner")} value={cs.owner} />
                </div>
                <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <Text className={styles.cardTitle}>
                    {t("businessData.changeSet.detail.approval")}
                  </Text>
                  <Bool
                    label={t("businessData.changeSet.detail.requiresApproval")}
                    value={cs.requiresApproval}
                  />
                  <KV
                    label={t("businessData.changeSet.detail.approvalRole")}
                    value={cs.approvalRole}
                  />
                  <Bool
                    label={t("businessData.changeSet.detail.makeItemsEffectiveOnApproval")}
                    value={cs.makeItemsEffectiveOnApproval}
                  />
                </div>
                <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <Text className={styles.cardTitle}>
                    {t("businessData.changeSet.detail.notification")}
                  </Text>
                  <Bool
                    label={t("businessData.changeSet.detail.sendEmailToApprovers")}
                    value={cs.sendEmailToApprovers}
                  />
                  <Bool
                    label={t("businessData.changeSet.detail.sendEmailToRequester")}
                    value={cs.sendEmailToRequester}
                  />
                </div>
                <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <Text className={styles.cardTitle}>
                    {t("businessData.changeSet.detail.documentation")}
                  </Text>
                  <KV
                    label={t("businessData.changeSet.detail.reasonForChange")}
                    value={cs.reasonForChange}
                  />
                  <KV
                    label={t("businessData.changeSet.detail.descriptionOfChange")}
                    value={cs.descriptionOfChange}
                  />
                </div>
              </div>
            )}
          </DetailShell>
        )}
        {tab !== "details" && (
          <div className={styles.empty}>{t("businessData.changeSet.detail.historyEmpty")}</div>
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
      <span>{value === "" ? t("businessData.changeSet.detail.emptyValue") : value}</span>
    </div>
  );
}

function Bool({ label, value }: { label: string; value: boolean }) {
  const styles = useDetailStyles();
  const { t } = useAppTranslation();
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}:</span>
      <span>
        {value ? t("businessData.changeSet.detail.yes") : t("businessData.changeSet.detail.no")}
      </span>
    </div>
  );
}
