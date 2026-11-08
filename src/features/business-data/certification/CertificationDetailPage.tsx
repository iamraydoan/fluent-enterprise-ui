import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useCertificationDetail } from "@/api";
import type { HeaderAction } from "@/components/common";
import {
  cloneAction,
  DetailCard,
  DetailField,
  DetailShell,
  DetailTabs,
  Empty,
  Grid,
  ListPage,
  refreshAction,
  terminateAction,
  unterminateAction,
} from "@/components/common";
import { Box24Regular, MoreVertical24Regular } from "@/components/icons";
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
import { useCertificationDialogs } from "./useCertificationDialogs";

const TABS = ["details", "references", "history"] as const;
const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.certification.detail.sections.details",
  "businessData.certification.detail.sections.employees",
  "businessData.certification.detail.sections.qualifications",
  "businessData.certification.detail.sections.attachments",
];

export function CertificationDetailPage() {
  const { t } = useAppTranslation();
  const [tab, setTab] = useState<string>("details");
  const [left, setLeft] = useState<string>(LEFT_SECTIONS[0]);
  const { name } = useParams({ strict: false }) as { name: string };
  const displayName = decodeURIComponent(name);
  const { data: cert, isLoading } = useCertificationDetail(displayName);
  const {
    dialogs,
    openClone,
    openTerminate,
    openUnterminate,
    openAssign,
    openGrant,
    openManageEmployees,
    openRevoke,
    openUnassign,
  } = useCertificationDialogs(cert);

  const displayValue = (value: string) =>
    value === "" ? t("businessData.certification.detail.emptyValue") : value;
  const displayYesNo = (value: boolean) =>
    value ? t("businessData.certification.detail.yes") : t("businessData.certification.detail.no");

  if (isLoading || !cert) {
    return (
      <ListPage header={{ icon: <Box24Regular />, title: displayName, actions: [refreshAction] }}>
        <Empty>{t("businessData.certification.detail.loading")}</Empty>
      </ListPage>
    );
  }

  const showEmployees = left === "businessData.certification.detail.sections.employees";
  const showQualifications = left === "businessData.certification.detail.sections.qualifications";

  const detailActions: HeaderAction[] = [
    refreshAction,
    { ...cloneAction, onClick: openClone },
    cert?.state === "Terminated"
      ? { ...unterminateAction, onClick: openUnterminate }
      : { ...terminateAction, onClick: openTerminate },
    {
      id: "more",
      icon: <MoreVertical24Regular />,
      labelKey: "actionBar.more",
      menu: [
        { label: t("businessData.certification.operations.assignEmployees"), onClick: openAssign },
        {
          label: t("businessData.certification.operations.grantCertification"),
          onClick: openGrant,
        },
        {
          label: t("businessData.certification.operations.manageEmployees"),
          onClick: openManageEmployees,
        },
        { label: t("businessData.certification.operations.revoke"), onClick: openRevoke },
        { label: t("businessData.certification.operations.unassign"), onClick: openUnassign },
      ],
    },
  ];

  return (
    <ListPage
      header={{
        icon: <Box24Regular />,
        title: `${cert.name} (${cert.state})`,
        actions: detailActions,
      }}
    >
      {dialogs}
      <DetailTabs
        tabs={TABS.map((value) => ({
          value,
          label: t(`businessData.certification.detail.tabs.${value}`),
        }))}
        active={tab}
        onChange={(value) => setTab(value as typeof tab)}
      >
        {tab === "details" && (
          <DetailShell
            title={cert.name}
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
            {showEmployees ? (
              <DetailCard
                title={t("businessData.certification.detail.employeesTitle", {
                  count: cert.employees.length,
                })}
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHeaderCell>
                        {t("businessData.certification.detail.employeeColumns.name")}
                      </TableHeaderCell>
                      <TableHeaderCell>
                        {t("businessData.certification.detail.employeeColumns.state")}
                      </TableHeaderCell>
                      <TableHeaderCell>
                        {t("businessData.certification.detail.employeeColumns.expirationDate")}
                      </TableHeaderCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cert.employees.map((e) => (
                      <TableRow key={e.name}>
                        <TableCell>{e.name}</TableCell>
                        <TableCell>{e.state}</TableCell>
                        <TableCell>{e.expirationDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </DetailCard>
            ) : showQualifications ? (
              <DetailCard
                title={t("businessData.certification.detail.qualificationsTitle", {
                  count: cert.qualifications.length,
                })}
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHeaderCell>
                        {t("businessData.certification.detail.qualColumns.qualification")}
                      </TableHeaderCell>
                      <TableHeaderCell>
                        {t("businessData.certification.detail.qualColumns.proficiency")}
                      </TableHeaderCell>
                      <TableHeaderCell>
                        {t("businessData.certification.detail.qualColumns.required")}
                      </TableHeaderCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cert.qualifications.map((q) => (
                      <TableRow key={q.qualification}>
                        <TableCell>{q.qualification}</TableCell>
                        <TableCell>{q.proficiency}</TableCell>
                        <TableCell>{displayYesNo(q.required)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </DetailCard>
            ) : (
              <Grid columns="auto-fit" gap="md">
                <DetailCard title={t("businessData.certification.detail.certification")}>
                  <DetailField
                    label={t("businessData.certification.detail.name")}
                    value={displayValue(cert.name)}
                    labelWidth={170}
                  />
                  <DetailField
                    label={t("businessData.certification.detail.description")}
                    value={displayValue(cert.description)}
                    labelWidth={170}
                  />
                  <DetailField
                    label={t("businessData.certification.detail.type")}
                    value={displayValue(cert.type)}
                    labelWidth={170}
                  />
                  <DetailField
                    label={t("businessData.certification.detail.universalState")}
                    value={displayValue(cert.universalState)}
                    labelWidth={170}
                  />
                  <DetailField
                    label={t("businessData.certification.detail.dataGroup")}
                    value={displayValue(cert.dataGroup)}
                    labelWidth={170}
                  />
                </DetailCard>
                <DetailCard title={t("businessData.certification.detail.info")}>
                  <DetailField
                    label={t("businessData.certification.detail.ownerRole")}
                    value={displayValue(cert.ownerRole)}
                    labelWidth={170}
                  />
                  <DetailField
                    label={t("businessData.certification.detail.sendNotificationOnChanges")}
                    value={displayYesNo(cert.sendNotificationOnChanges)}
                    labelWidth={170}
                  />
                  <DetailField
                    label={t("businessData.certification.detail.sendNotificationWhenRequired")}
                    value={displayYesNo(cert.sendNotificationWhenRequired)}
                    labelWidth={170}
                  />
                </DetailCard>
                <DetailCard title={t("businessData.certification.detail.permission")}>
                  <DetailField
                    label={t("businessData.certification.detail.allowManualGrants")}
                    value={displayYesNo(cert.allowManualGrants)}
                    labelWidth={170}
                  />
                  <DetailField
                    label={t("businessData.certification.detail.allowSelfGranting")}
                    value={displayYesNo(cert.allowSelfGranting)}
                    labelWidth={170}
                  />
                  <DetailField
                    label={t("businessData.certification.detail.allowGrantingByManager")}
                    value={displayYesNo(cert.allowGrantingByManager)}
                    labelWidth={170}
                  />
                </DetailCard>
                <DetailCard title={t("businessData.certification.detail.validityPeriod")}>
                  <DetailField
                    label={t("businessData.certification.detail.validFor")}
                    value={displayValue(cert.validFor)}
                    labelWidth={170}
                  />
                  <DetailField
                    label={t("businessData.certification.detail.allowOverride")}
                    value={displayYesNo(cert.allowOverride)}
                    labelWidth={170}
                  />
                </DetailCard>
                <DetailCard title={t("businessData.certification.detail.training")}>
                  <DetailField
                    label={t("businessData.certification.detail.trainingMaximumDuration")}
                    value={displayValue(cert.trainingMaximumDuration)}
                    labelWidth={170}
                  />
                  <DetailField
                    label={t("businessData.certification.detail.traineeByDefault")}
                    value={displayYesNo(cert.traineeByDefault)}
                    labelWidth={170}
                  />
                </DetailCard>
              </Grid>
            )}
          </DetailShell>
        )}
        {tab !== "details" && <Empty>{t("businessData.certification.detail.historyEmpty")}</Empty>}
      </DetailTabs>
    </ListPage>
  );
}
