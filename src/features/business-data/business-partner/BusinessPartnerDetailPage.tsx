import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useBusinessPartnerDetail } from "@/api";
import type { HeaderAction } from "@/components/common";
import {
  cloneAction,
  DetailShell,
  DetailTabs,
  editAction,
  Empty,
  ListPage,
  refreshAction,
  terminateAction,
  unterminateAction,
  SectionHeader,
  Grid,
  HStack,
  VStack,
} from "@/components/common";
import { Box24Regular } from "@/components/icons";
import { makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import { theme } from "@/styles/theme";
import { useBusinessPartnerDialogs } from "./useBusinessPartnerDialogs";

const useDetailStyles = makeStyles({
  card: { padding: theme.spacing.lg },
  cardTitle: {
    fontSize: "14px",
    fontWeight: theme.font.weightSemibold,
    paddingBottom: theme.spacing.sm,
    borderBottom: `1px solid ${theme.color.borderSubtle}`,
  },
  row: {
    fontSize: "13px",
  },
  label: { color: theme.color.textTertiary, minWidth: "140px" },
});

const TABS = ["details", "references", "history"] as const;
const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.businessPartner.detail.sections.details",
  "businessData.businessPartner.detail.sections.attachments",
];

export function BusinessPartnerDetailPage() {
  const { t } = useAppTranslation();
  const styles = useDetailStyles();
  const sharedStyles = useSharedStyles();
  const [tab, setTab] = useState<string>("details");
  const [left, setLeft] = useState<string>(LEFT_SECTIONS[0]);
  const { name } = useParams({ strict: false }) as { name: string };
  const displayName = decodeURIComponent(name);
  const { data: bp, isLoading } = useBusinessPartnerDetail(displayName);
  const { dialogs, openEdit, openClone, openTerminate, openUnterminate } =
    useBusinessPartnerDialogs(bp);

  if (isLoading || !bp) {
    return (
      <ListPage
        header={{
          icon: <Box24Regular />,
          title: displayName,
          actions: [refreshAction, editAction],
        }}
      >
        <Empty>{t("businessData.businessPartner.detail.loading")}</Empty>
      </ListPage>
    );
  }

  const detailActions: HeaderAction[] = [
    refreshAction,
    { ...editAction, onClick: openEdit },
    { ...cloneAction, onClick: openClone },
    bp?.state === "Terminated"
      ? { ...unterminateAction, onClick: openUnterminate }
      : { ...terminateAction, onClick: openTerminate },
  ];

  return (
    <ListPage
      header={{ icon: <Box24Regular />, title: `${bp.name} (${bp.state})`, actions: detailActions }}
    >
      {dialogs}
      <DetailTabs
        tabs={TABS.map((value) => ({
          value,
          label: t(`businessData.businessPartner.detail.tabs.${value}`),
        }))}
        active={tab}
        onChange={(value) => setTab(value as typeof tab)}
      >
        {tab === "details" && (
          <DetailShell
            title={bp.name}
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
            <Grid columns="repeat(auto-fit, minmax(300px, 1fr))" gap="12px">
              <VStack gap="md" className={`${sharedStyles.contentCard} ${styles.card}`}>
                <SectionHeader title={t("businessData.businessPartner.detail.businessPartner")} />
                <KV label={t("businessData.businessPartner.detail.name")} value={bp.name} />
                <KV
                  label={t("businessData.businessPartner.detail.description")}
                  value={bp.description}
                />
                <KV
                  label={t("businessData.businessPartner.detail.universalState")}
                  value={bp.universalState}
                />
                <KV
                  label={t("businessData.businessPartner.detail.dataGroup")}
                  value={bp.dataGroup}
                />
              </VStack>
              <VStack gap="md" className={`${sharedStyles.contentCard} ${styles.card}`}>
                <SectionHeader title={t("businessData.businessPartner.detail.properties")} />
                <Bool
                  label={t("businessData.businessPartner.detail.contractor")}
                  value={bp.isContractor}
                />
                <Bool
                  label={t("businessData.businessPartner.detail.customer")}
                  value={bp.isCustomer}
                />
                <Bool
                  label={t("businessData.businessPartner.detail.supplier")}
                  value={bp.isSupplier}
                />
                <Bool
                  label={t("businessData.businessPartner.detail.manufacturer")}
                  value={bp.isManufacturer}
                />
                <KV
                  label={t("businessData.businessPartner.detail.labelSpecification")}
                  value={bp.labelSpecification}
                />
              </VStack>
              <VStack gap="md" className={`${sharedStyles.contentCard} ${styles.card}`}>
                <SectionHeader
                  title={t("businessData.businessPartner.detail.contactInformation")}
                />
                <KV
                  label={t("businessData.businessPartner.detail.contactTitle")}
                  value={bp.contactTitle}
                />
                <KV
                  label={t("businessData.businessPartner.detail.contactName")}
                  value={bp.contactName}
                />
                <KV label={t("businessData.businessPartner.detail.email")} value={bp.email} />
                <KV
                  label={t("businessData.businessPartner.detail.mobilePhone")}
                  value={bp.mobilePhone}
                />
                <KV
                  label={t("businessData.businessPartner.detail.businessPhone")}
                  value={bp.businessPhone}
                />
                <KV
                  label={t("businessData.businessPartner.detail.businessFax")}
                  value={bp.businessFax}
                />
              </VStack>
              <VStack gap="md" className={`${sharedStyles.contentCard} ${styles.card}`}>
                <SectionHeader
                  title={t("businessData.businessPartner.detail.addressInformation")}
                />
                <KV label={t("businessData.businessPartner.detail.address")} value={bp.address} />
                <KV label={t("businessData.businessPartner.detail.zipCode")} value={bp.zipCode} />
                <KV label={t("businessData.businessPartner.detail.country")} value={bp.country} />
                <KV label={t("businessData.businessPartner.detail.state")} value={bp.stateName} />
                <KV label={t("businessData.businessPartner.detail.city")} value={bp.city} />
              </VStack>
              <VStack gap="md" className={`${sharedStyles.contentCard} ${styles.card}`}>
                <SectionHeader title={t("businessData.businessPartner.detail.otherInformation")} />
                <KV
                  label={t("businessData.businessPartner.detail.taxNumber")}
                  value={bp.taxNumber}
                />
                <KV label={t("businessData.businessPartner.detail.website")} value={bp.website} />
              </VStack>
            </Grid>
          </DetailShell>
        )}
        {tab !== "details" && (
          <Empty>{t("businessData.businessPartner.detail.historyEmpty")}</Empty>
        )}
      </DetailTabs>
    </ListPage>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  const styles = useDetailStyles();
  const { t } = useAppTranslation();
  return (
    <HStack gap="12px" className={styles.row}>
      <span className={styles.label}>{label}:</span>
      <span>{value === "" ? t("businessData.businessPartner.detail.emptyValue") : value}</span>
    </HStack>
  );
}

function Bool({ label, value }: { label: string; value: boolean }) {
  const styles = useDetailStyles();
  const { t } = useAppTranslation();
  return (
    <HStack gap="12px" className={styles.row}>
      <span className={styles.label}>{label}:</span>
      <span>
        {value
          ? t("businessData.businessPartner.detail.yes")
          : t("businessData.businessPartner.detail.no")}
      </span>
    </HStack>
  );
}
