import { useState } from "react";
import { useMaterialTransferDetail } from "@/api";
import type { DetailMoreMenuItem, DetailTab } from "@/components/common";
import { DetailShell, KV } from "@/components/common";
import { Box24Regular } from "@/components/icons";
import { Text, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import {
  ApproveMaterialTransferDialog,
  CancelMaterialTransferDialog,
  ChangeMaterialTransferInfoDialog,
  DeliverMaterialTransferDialog,
  PrepareMaterialTransferDialog,
  ReceiveMaterialTransferDialog,
  RefuseMaterialTransferDialog,
  RejectMaterialTransferDialog,
  RequestForCostCenterDialog,
  RequestForMAODialog,
  RequestMaterialTransferDialog,
  ReturnInventoryDialog,
  ReturnMaterialDialog,
  SendMaterialTransferDialog,
  SpecialApproveMaterialTransferDialog,
  SpecialDeliverMaterialTransferDialog,
  SpecialReceiveMaterialTransferDialog,
  SpecialRequestForMaterialDialog,
  SpecialSendMaterialTransferDialog,
} from "./MaterialTransferDialogs";

const useStyles = makeStyles({
  cards: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" },
  sectionTitle: { marginBottom: "8px" },
});

function Card({ titleKey, rows }: { titleKey: TranslationKey; rows: [string, React.ReactNode][] }) {
  const { t } = useAppTranslation();
  const shared = useSharedStyles();
  const styles = useStyles();
  return (
    <div className={shared.contentCard} style={{ padding: "14px 16px" }}>
      <Text weight="semibold" size={400} className={styles.sectionTitle}>
        {t(titleKey)}
      </Text>
      <KV rows={rows} />
    </div>
  );
}

export function MaterialTransferDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const styles = useStyles();
  const { data: detail } = useMaterialTransferDetail(name);

  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<string>("businessData.materialTransfer.left.details");
  const [approveOpen, setApproveOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [changeInfoOpen, setChangeInfoOpen] = useState(false);
  const [deliverOpen, setDeliverOpen] = useState(false);
  const [prepareOpen, setPrepareOpen] = useState(false);
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [refuseOpen, setRefuseOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestForMAOOpen, setRequestForMAOOpen] = useState(false);
  const [requestForCostCenterOpen, setRequestForCostCenterOpen] = useState(false);
  const [returnInventoryOpen, setReturnInventoryOpen] = useState(false);
  const [returnMaterialOpen, setReturnMaterialOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [specialApproveOpen, setSpecialApproveOpen] = useState(false);
  const [specialDeliverOpen, setSpecialDeliverOpen] = useState(false);
  const [specialReceiveOpen, setSpecialReceiveOpen] = useState(false);
  const [specialRequestOpen, setSpecialRequestOpen] = useState(false);
  const [specialSendOpen, setSpecialSendOpen] = useState(false);

  if (!detail) {
    return <Text>{t("businessData.materialTransfer.pageLabel")}</Text>;
  }

  const topTabs: DetailTab[] = [
    { value: "details", labelKey: "businessData.materialTransfer.tabs.details" },
    { value: "references", labelKey: "businessData.materialTransfer.tabs.references" },
    { value: "history", labelKey: "businessData.materialTransfer.tabs.history" },
  ];

  const leftItems: TranslationKey[] = [
    "businessData.materialTransfer.left.details",
    "businessData.materialTransfer.left.materials",
    "businessData.materialTransfer.left.attachments",
  ];

  const moreMenuItems: DetailMoreMenuItem[] = [
    {
      key: "request",
      labelKey: "businessData.materialTransfer.operations.request.title",
      onClick: () => setRequestOpen(true),
    },
    {
      key: "approve",
      labelKey: "businessData.materialTransfer.operations.approve.title",
      onClick: () => setApproveOpen(true),
    },
    {
      key: "reject",
      labelKey: "businessData.materialTransfer.operations.reject.title",
      onClick: () => setRejectOpen(true),
    },
    {
      key: "cancel",
      labelKey: "businessData.materialTransfer.operations.cancel.title",
      onClick: () => setCancelOpen(true),
    },
    {
      key: "prepare",
      labelKey: "businessData.materialTransfer.operations.prepare.title",
      onClick: () => setPrepareOpen(true),
    },
    {
      key: "send",
      labelKey: "businessData.materialTransfer.operations.send.title",
      onClick: () => setSendOpen(true),
    },
    {
      key: "receive",
      labelKey: "businessData.materialTransfer.operations.receive.title",
      onClick: () => setReceiveOpen(true),
    },
    {
      key: "deliver",
      labelKey: "businessData.materialTransfer.operations.deliver.title",
      onClick: () => setDeliverOpen(true),
    },
    {
      key: "refuse",
      labelKey: "businessData.materialTransfer.operations.refuse.title",
      onClick: () => setRefuseOpen(true),
    },
    {
      key: "changeInfo",
      labelKey: "businessData.materialTransfer.operations.changeInfo.title",
      onClick: () => setChangeInfoOpen(true),
    },
    {
      key: "returnMaterial",
      labelKey: "businessData.materialTransfer.operations.returnMaterial.title",
      onClick: () => setReturnMaterialOpen(true),
    },
    {
      key: "returnInventory",
      labelKey: "businessData.materialTransfer.operations.returnInventory.title",
      onClick: () => setReturnInventoryOpen(true),
    },
  ];

  const f = "businessData.materialTransfer.detail.fields" as const;
  return (
    <>
      <DetailShell
        title={detail.name}
        icon={<Box24Regular />}
        topTabs={topTabs}
        top={top}
        onTop={setTop}
        leftItems={leftItems}
        left={left}
        onLeft={setLeft}
        onEdit={() => undefined}
        onAskAi={() => undefined}
        showState={false}
        moreActions={moreMenuItems}
      >
        <div className={styles.cards}>
          <Card
            titleKey="businessData.materialTransfer.detail.generalData"
            rows={[
              [t(`${f}.name`), detail.name],
              [t(`${f}.type`), detail.type],
              [t(`${f}.state`), detail.state],
              [t(`${f}.material`), detail.material],
              [t(`${f}.quantity`), detail.quantity],
            ]}
          />
          <Card
            titleKey="businessData.materialTransfer.detail.generalData"
            rows={[
              [t(`${f}.fromFacility`), detail.fromFacility],
              [t(`${f}.toFacility`), detail.toFacility],
              [t(`${f}.requester`), detail.requester],
              [t(`${f}.urgency`), detail.urgency],
              [t(`${f}.quantity`), detail.quantity],
            ]}
          />
        </div>
      </DetailShell>
      <ApproveMaterialTransferDialog open={approveOpen} onClose={() => setApproveOpen(false)} />
      <CancelMaterialTransferDialog open={cancelOpen} onClose={() => setCancelOpen(false)} />
      <ChangeMaterialTransferInfoDialog
        open={changeInfoOpen}
        onClose={() => setChangeInfoOpen(false)}
      />
      <DeliverMaterialTransferDialog open={deliverOpen} onClose={() => setDeliverOpen(false)} />
      <PrepareMaterialTransferDialog open={prepareOpen} onClose={() => setPrepareOpen(false)} />
      <ReceiveMaterialTransferDialog open={receiveOpen} onClose={() => setReceiveOpen(false)} />
      <RefuseMaterialTransferDialog open={refuseOpen} onClose={() => setRefuseOpen(false)} />
      <RejectMaterialTransferDialog open={rejectOpen} onClose={() => setRejectOpen(false)} />
      <RequestMaterialTransferDialog open={requestOpen} onClose={() => setRequestOpen(false)} />
      <RequestForMAODialog open={requestForMAOOpen} onClose={() => setRequestForMAOOpen(false)} />
      <RequestForCostCenterDialog
        open={requestForCostCenterOpen}
        onClose={() => setRequestForCostCenterOpen(false)}
      />
      <ReturnInventoryDialog
        open={returnInventoryOpen}
        onClose={() => setReturnInventoryOpen(false)}
      />
      <ReturnMaterialDialog
        open={returnMaterialOpen}
        onClose={() => setReturnMaterialOpen(false)}
      />
      <SendMaterialTransferDialog open={sendOpen} onClose={() => setSendOpen(false)} />
      <SpecialApproveMaterialTransferDialog
        open={specialApproveOpen}
        onClose={() => setSpecialApproveOpen(false)}
      />
      <SpecialDeliverMaterialTransferDialog
        open={specialDeliverOpen}
        onClose={() => setSpecialDeliverOpen(false)}
      />
      <SpecialReceiveMaterialTransferDialog
        open={specialReceiveOpen}
        onClose={() => setSpecialReceiveOpen(false)}
      />
      <SpecialRequestForMaterialDialog
        open={specialRequestOpen}
        onClose={() => setSpecialRequestOpen(false)}
      />
      <SpecialSendMaterialTransferDialog
        open={specialSendOpen}
        onClose={() => setSpecialSendOpen(false)}
      />
    </>
  );
}
