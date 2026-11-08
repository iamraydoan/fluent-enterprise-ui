import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useChangeSetDetail } from "@/api";
import type { HeaderAction } from "@/components/common";
import {
  cloneAction,
  DetailCard,
  DetailField,
  DetailShell,
  DetailTabs,
  editAction,
  Empty,
  Grid,
  ListPage,
  refreshAction,
  terminateAction,
} from "@/components/common";
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
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useChangeSetDialogs } from "./useChangeSetDialogs";

const TABS = ["details", "references", "history"] as const;
const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.changeSet.detail.sections.details",
  "businessData.changeSet.detail.sections.items",
  "businessData.changeSet.detail.sections.subscribers",
  "businessData.changeSet.detail.sections.attachments",
];

export function ChangeSetDetailPage() {
  const { t } = useAppTranslation();
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

  const displayValue = (value: string) =>
    value === "" ? t("businessData.changeSet.detail.emptyValue") : value;
  const displayYesNo = (value: boolean) =>
    value ? t("businessData.changeSet.detail.yes") : t("businessData.changeSet.detail.no");

  if (isLoading || !cs) {
    return (
      <ListPage
        header={{
          icon: <Box24Regular />,
          title: displayName,
          actions: [refreshAction, editAction],
        }}
      >
        <Empty>{t("businessData.changeSet.detail.loading")}</Empty>
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
      <DetailTabs
        tabs={TABS.map((value) => ({
          value,
          label: t(`businessData.changeSet.detail.tabs.${value}`),
        }))}
        active={tab}
        onChange={(value) => setTab(value as typeof tab)}
      >
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
              <DetailCard
                title={t("businessData.changeSet.detail.itemsTitle", { count: cs.items.length })}
              >
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
                        <TableCell>{displayValue(i.approvalRole)}</TableCell>
                        <TableCell>{displayValue(i.approver)}</TableCell>
                        <TableCell>{displayValue(i.approvalDate)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </DetailCard>
            ) : showSubscribers ? (
              <DetailCard
                title={t("businessData.changeSet.detail.subscribersTitle", {
                  count: cs.subscribers.length,
                })}
              >
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
              </DetailCard>
            ) : (
              <Grid columns="auto-fit" gap="md">
                <DetailCard title={t("businessData.changeSet.detail.changeSet")}>
                  <DetailField
                    label={t("businessData.changeSet.detail.name")}
                    value={displayValue(cs.name)}
                    labelWidth={180}
                  />
                  <DetailField
                    label={t("businessData.changeSet.detail.description")}
                    value={displayValue(cs.description)}
                    labelWidth={180}
                  />
                  <DetailField
                    label={t("businessData.changeSet.detail.type")}
                    value={displayValue(cs.type)}
                    labelWidth={180}
                  />
                  <DetailField
                    label={t("businessData.changeSet.detail.universalState")}
                    value={displayValue(cs.universalState)}
                    labelWidth={180}
                  />
                  <DetailField
                    label={t("businessData.changeSet.detail.systemState")}
                    value={displayValue(cs.systemState)}
                    labelWidth={180}
                  />
                  <DetailField
                    label={t("businessData.changeSet.detail.dataGroup")}
                    value={displayValue(cs.dataGroup)}
                    labelWidth={180}
                  />
                </DetailCard>
                <DetailCard title={t("businessData.changeSet.detail.information")}>
                  <DetailField
                    label={t("businessData.changeSet.detail.category")}
                    value={displayValue(cs.category)}
                    labelWidth={180}
                  />
                  <DetailField
                    label={t("businessData.changeSet.detail.urgency")}
                    value={displayValue(cs.urgency)}
                    labelWidth={180}
                  />
                  <DetailField
                    label={t("businessData.changeSet.detail.owner")}
                    value={displayValue(cs.owner)}
                    labelWidth={180}
                  />
                </DetailCard>
                <DetailCard title={t("businessData.changeSet.detail.approval")}>
                  <DetailField
                    label={t("businessData.changeSet.detail.requiresApproval")}
                    value={displayYesNo(cs.requiresApproval)}
                    labelWidth={180}
                  />
                  <DetailField
                    label={t("businessData.changeSet.detail.approvalRole")}
                    value={displayValue(cs.approvalRole)}
                    labelWidth={180}
                  />
                  <DetailField
                    label={t("businessData.changeSet.detail.makeItemsEffectiveOnApproval")}
                    value={displayYesNo(cs.makeItemsEffectiveOnApproval)}
                    labelWidth={180}
                  />
                </DetailCard>
                <DetailCard title={t("businessData.changeSet.detail.notification")}>
                  <DetailField
                    label={t("businessData.changeSet.detail.sendEmailToApprovers")}
                    value={displayYesNo(cs.sendEmailToApprovers)}
                    labelWidth={180}
                  />
                  <DetailField
                    label={t("businessData.changeSet.detail.sendEmailToRequester")}
                    value={displayYesNo(cs.sendEmailToRequester)}
                    labelWidth={180}
                  />
                </DetailCard>
                <DetailCard title={t("businessData.changeSet.detail.documentation")}>
                  <DetailField
                    label={t("businessData.changeSet.detail.reasonForChange")}
                    value={displayValue(cs.reasonForChange)}
                    labelWidth={180}
                  />
                  <DetailField
                    label={t("businessData.changeSet.detail.descriptionOfChange")}
                    value={displayValue(cs.descriptionOfChange)}
                    labelWidth={180}
                  />
                </DetailCard>
              </Grid>
            )}
          </DetailShell>
        )}
        {tab !== "details" && <Empty>{t("businessData.changeSet.detail.historyEmpty")}</Empty>}
      </DetailTabs>
    </ListPage>
  );
}
