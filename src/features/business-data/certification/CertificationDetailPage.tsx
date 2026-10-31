import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useCertificationDetail } from "@/api";
import {
  DetailShell,
  ListPage,
  cloneAction,
  refreshAction,
  terminateAction,
  unterminateAction,
  DetailTabs,
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
import { useCertificationDialogs } from "./useCertificationDialogs";

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
  label: { color: tokens.colorNeutralForeground3, minWidth: "170px" },
  empty: { padding: "32px", textAlign: "center", color: tokens.colorNeutralForeground3 },
});

const TABS = ["details", "references", "history"] as const;
const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.certification.detail.sections.details",
  "businessData.certification.detail.sections.employees",
  "businessData.certification.detail.sections.qualifications",
  "businessData.certification.detail.sections.attachments",
];

export function CertificationDetailPage() {
  const { t } = useAppTranslation();
  const styles = useDetailStyles();
  const sharedStyles = useSharedStyles();
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

  if (isLoading || !cert) {
    return (
      <ListPage header={{ icon: <Box24Regular />, title: displayName, actions: [refreshAction] }}>
        <div className={styles.empty}>{t("businessData.certification.detail.loading")}</div>
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
              <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                <Text className={styles.cardTitle}>
                  {t("businessData.certification.detail.employeesTitle", {
                    count: cert.employees.length,
                  })}
                </Text>
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
              </div>
            ) : showQualifications ? (
              <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                <Text className={styles.cardTitle}>
                  {t("businessData.certification.detail.qualificationsTitle", {
                    count: cert.qualifications.length,
                  })}
                </Text>
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
                        <TableCell>
                          {q.required
                            ? t("businessData.certification.detail.yes")
                            : t("businessData.certification.detail.no")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className={styles.cards}>
                <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <Text className={styles.cardTitle}>
                    {t("businessData.certification.detail.certification")}
                  </Text>
                  <KV label={t("businessData.certification.detail.name")} value={cert.name} />
                  <KV
                    label={t("businessData.certification.detail.description")}
                    value={cert.description}
                  />
                  <KV label={t("businessData.certification.detail.type")} value={cert.type} />
                  <KV
                    label={t("businessData.certification.detail.universalState")}
                    value={cert.universalState}
                  />
                  <KV
                    label={t("businessData.certification.detail.dataGroup")}
                    value={cert.dataGroup}
                  />
                </div>
                <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <Text className={styles.cardTitle}>
                    {t("businessData.certification.detail.info")}
                  </Text>
                  <KV
                    label={t("businessData.certification.detail.ownerRole")}
                    value={cert.ownerRole}
                  />
                  <Bool
                    label={t("businessData.certification.detail.sendNotificationOnChanges")}
                    value={cert.sendNotificationOnChanges}
                  />
                  <Bool
                    label={t("businessData.certification.detail.sendNotificationWhenRequired")}
                    value={cert.sendNotificationWhenRequired}
                  />
                </div>
                <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <Text className={styles.cardTitle}>
                    {t("businessData.certification.detail.permission")}
                  </Text>
                  <Bool
                    label={t("businessData.certification.detail.allowManualGrants")}
                    value={cert.allowManualGrants}
                  />
                  <Bool
                    label={t("businessData.certification.detail.allowSelfGranting")}
                    value={cert.allowSelfGranting}
                  />
                  <Bool
                    label={t("businessData.certification.detail.allowGrantingByManager")}
                    value={cert.allowGrantingByManager}
                  />
                </div>
                <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <Text className={styles.cardTitle}>
                    {t("businessData.certification.detail.validityPeriod")}
                  </Text>
                  <KV
                    label={t("businessData.certification.detail.validFor")}
                    value={cert.validFor}
                  />
                  <Bool
                    label={t("businessData.certification.detail.allowOverride")}
                    value={cert.allowOverride}
                  />
                </div>
                <div className={`${sharedStyles.contentCard} ${styles.card}`}>
                  <Text className={styles.cardTitle}>
                    {t("businessData.certification.detail.training")}
                  </Text>
                  <KV
                    label={t("businessData.certification.detail.trainingMaximumDuration")}
                    value={cert.trainingMaximumDuration}
                  />
                  <Bool
                    label={t("businessData.certification.detail.traineeByDefault")}
                    value={cert.traineeByDefault}
                  />
                </div>
              </div>
            )}
          </DetailShell>
        )}
        {tab !== "details" && (
          <div className={styles.empty}>{t("businessData.certification.detail.historyEmpty")}</div>
        )}
      </DetailTabs>
    </ListPage>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  const styles = useDetailStyles();
  const { t } = useAppTranslation();
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}:</span>
      <span>{value === "" ? t("businessData.certification.detail.emptyValue") : value}</span>
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
        {value
          ? t("businessData.certification.detail.yes")
          : t("businessData.certification.detail.no")}
      </span>
    </div>
  );
}
