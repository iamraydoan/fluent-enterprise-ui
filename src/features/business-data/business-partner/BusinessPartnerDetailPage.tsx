import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useBusinessPartnerDetail } from "@/api";
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
  unterminateAction,
} from "@/components/common";
import { Box24Regular } from "@/components/icons";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useBusinessPartnerDialogs } from "./useBusinessPartnerDialogs";

const TABS = ["details", "references", "history"] as const;
const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.businessPartner.detail.sections.details",
  "businessData.businessPartner.detail.sections.attachments",
];

export function BusinessPartnerDetailPage() {
  const { t } = useAppTranslation();
  const [tab, setTab] = useState<string>("details");
  const [left, setLeft] = useState<string>(LEFT_SECTIONS[0]);
  const { name } = useParams({ strict: false }) as { name: string };
  const displayName = decodeURIComponent(name);
  const { data: bp, isLoading } = useBusinessPartnerDetail(displayName);
  const { dialogs, openEdit, openClone, openTerminate, openUnterminate } =
    useBusinessPartnerDialogs(bp);

  const displayValue = (value: string) =>
    value === "" ? t("businessData.businessPartner.detail.emptyValue") : value;
  const displayYesNo = (value: boolean) =>
    value
      ? t("businessData.businessPartner.detail.yes")
      : t("businessData.businessPartner.detail.no");

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
            <Grid columns="auto-fit" gap="md">
              <DetailCard title={t("businessData.businessPartner.detail.businessPartner")}>
                <DetailField
                  label={t("businessData.businessPartner.detail.name")}
                  value={displayValue(bp.name)}
                  labelWidth={140}
                />
                <DetailField
                  label={t("businessData.businessPartner.detail.description")}
                  value={displayValue(bp.description)}
                  labelWidth={140}
                />
                <DetailField
                  label={t("businessData.businessPartner.detail.universalState")}
                  value={displayValue(bp.universalState)}
                  labelWidth={140}
                />
                <DetailField
                  label={t("businessData.businessPartner.detail.dataGroup")}
                  value={displayValue(bp.dataGroup)}
                  labelWidth={140}
                />
              </DetailCard>
              <DetailCard title={t("businessData.businessPartner.detail.properties")}>
                <DetailField
                  label={t("businessData.businessPartner.detail.contractor")}
                  value={displayYesNo(bp.isContractor)}
                  labelWidth={140}
                />
                <DetailField
                  label={t("businessData.businessPartner.detail.customer")}
                  value={displayYesNo(bp.isCustomer)}
                  labelWidth={140}
                />
                <DetailField
                  label={t("businessData.businessPartner.detail.supplier")}
                  value={displayYesNo(bp.isSupplier)}
                  labelWidth={140}
                />
                <DetailField
                  label={t("businessData.businessPartner.detail.manufacturer")}
                  value={displayYesNo(bp.isManufacturer)}
                  labelWidth={140}
                />
                <DetailField
                  label={t("businessData.businessPartner.detail.labelSpecification")}
                  value={displayValue(bp.labelSpecification)}
                  labelWidth={140}
                />
              </DetailCard>
              <DetailCard title={t("businessData.businessPartner.detail.contactInformation")}>
                <DetailField
                  label={t("businessData.businessPartner.detail.contactTitle")}
                  value={displayValue(bp.contactTitle)}
                  labelWidth={140}
                />
                <DetailField
                  label={t("businessData.businessPartner.detail.contactName")}
                  value={displayValue(bp.contactName)}
                  labelWidth={140}
                />
                <DetailField
                  label={t("businessData.businessPartner.detail.email")}
                  value={displayValue(bp.email)}
                  labelWidth={140}
                />
                <DetailField
                  label={t("businessData.businessPartner.detail.mobilePhone")}
                  value={displayValue(bp.mobilePhone)}
                  labelWidth={140}
                />
                <DetailField
                  label={t("businessData.businessPartner.detail.businessPhone")}
                  value={displayValue(bp.businessPhone)}
                  labelWidth={140}
                />
                <DetailField
                  label={t("businessData.businessPartner.detail.businessFax")}
                  value={displayValue(bp.businessFax)}
                  labelWidth={140}
                />
              </DetailCard>
              <DetailCard title={t("businessData.businessPartner.detail.addressInformation")}>
                <DetailField
                  label={t("businessData.businessPartner.detail.address")}
                  value={displayValue(bp.address)}
                  labelWidth={140}
                />
                <DetailField
                  label={t("businessData.businessPartner.detail.zipCode")}
                  value={displayValue(bp.zipCode)}
                  labelWidth={140}
                />
                <DetailField
                  label={t("businessData.businessPartner.detail.country")}
                  value={displayValue(bp.country)}
                  labelWidth={140}
                />
                <DetailField
                  label={t("businessData.businessPartner.detail.state")}
                  value={displayValue(bp.stateName)}
                  labelWidth={140}
                />
                <DetailField
                  label={t("businessData.businessPartner.detail.city")}
                  value={displayValue(bp.city)}
                  labelWidth={140}
                />
              </DetailCard>
              <DetailCard title={t("businessData.businessPartner.detail.otherInformation")}>
                <DetailField
                  label={t("businessData.businessPartner.detail.taxNumber")}
                  value={displayValue(bp.taxNumber)}
                  labelWidth={140}
                />
                <DetailField
                  label={t("businessData.businessPartner.detail.website")}
                  value={displayValue(bp.website)}
                  labelWidth={140}
                />
              </DetailCard>
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
