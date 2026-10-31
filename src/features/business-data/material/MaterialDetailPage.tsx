import { useState } from "react";
import { useMaterialDetail } from "@/api";
import type { DetailMoreMenuItem, DetailTab } from "@/components/common";
import { DetailShell, KV } from "@/components/common";
import { Box24Regular } from "@/components/icons";
import { Text, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import {
  AbortMaterialDialog,
  AttachMaterialDialog,
  ChangeFlowStepDialog,
  ChangeProductDialog,
  ChangeQuantityDialog,
  CloneMaterialDialog,
  CombineMaterialDialog,
  CreateMaterialDialog,
  DetachMaterialDialog,
  DispatchMaterialDialog,
  EditMaterialDialog,
  GradeMaterialDialog,
  HoldMaterialDialog,
  MergeMaterialDialog,
  MoveNextMaterialDialog,
  ReceiveMaterialDialog,
  ReworkMaterialDialog,
  ShipMaterialDialog,
  SplitMaterialDialog,
  TerminateMaterialDialog,
  TrackInMaterialDialog,
  TrackOutMaterialDialog,
  UndispatchMaterialDialog,
  UnshipMaterialDialog,
  UnterminateMaterialDialog,
  ViewMaterialDocumentsDialog,
  ViewMaterialReportsDialog,
} from "./MaterialDialogs";

const useStyles = makeStyles({
  cards: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" },
  sectionTitle: { marginBottom: "8px" },
});

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "businessData.material.tabs.details" },
  { value: "traceability", labelKey: "businessData.material.tabs.traceability" },
  { value: "container", labelKey: "businessData.material.tabs.container" },
  { value: "defects", labelKey: "businessData.material.tabs.defects" },
  { value: "genealogy", labelKey: "businessData.material.tabs.genealogy" },
  { value: "history", labelKey: "businessData.material.tabs.history" },
  { value: "compare", labelKey: "businessData.material.tabs.compare" },
];

const LEFT_SECTIONS: TranslationKey[] = [
  "businessData.material.sideSections.details",
  "businessData.material.sideSections.holds",
  "businessData.material.sideSections.defects",
  "businessData.material.sideSections.timeConstraints",
  "businessData.material.sideSections.dependencies",
  "businessData.material.sideSections.subMaterials",
  "businessData.material.sideSections.collectedData",
  "businessData.material.sideSections.attributes",
  "businessData.material.sideSections.attachments",
];

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

export function MaterialDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const styles = useStyles();
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState("businessData.material.sideSections.details");
  const { data: detail } = useMaterialDetail(name);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [unterminateOpen, setUnterminateOpen] = useState(false);
  const [dispatchOpen, setDispatchOpen] = useState(false);
  const [undispatchOpen, setUndispatchOpen] = useState(false);
  const [trackInOpen, setTrackInOpen] = useState(false);
  const [trackOutOpen, setTrackOutOpen] = useState(false);
  const [moveNextOpen, setMoveNextOpen] = useState(false);
  const [abortOpen, setAbortOpen] = useState(false);
  const [shipOpen, setShipOpen] = useState(false);
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [unshipOpen, setUnshipOpen] = useState(false);
  const [holdOpen, setHoldOpen] = useState(false);
  const [splitOpen, setSplitOpen] = useState(false);
  const [mergeOpen, setMergeOpen] = useState(false);
  const [combineOpen, setCombineOpen] = useState(false);
  const [attachOpen, setAttachOpen] = useState(false);
  const [detachOpen, setDetachOpen] = useState(false);
  const [gradeOpen, setGradeOpen] = useState(false);
  const [reworkOpen, setReworkOpen] = useState(false);
  const [changeProductOpen, setChangeProductOpen] = useState(false);
  const [changeQuantityOpen, setChangeQuantityOpen] = useState(false);
  const [changeFlowStepOpen, setChangeFlowStepOpen] = useState(false);
  const [viewReportsOpen, setViewReportsOpen] = useState(false);
  const [viewDocumentsOpen, setViewDocumentsOpen] = useState(false);

  if (!detail) {
    return <Text>{t("businessData.material.detailsView")}</Text>;
  }

  const isTerminated = detail.state === "Terminated";

  const terminateItem: DetailMoreMenuItem = isTerminated
    ? {
        key: "unterminate",
        labelKey: "businessData.material.operations.unterminate.title",
        onClick: () => setUnterminateOpen(true),
      }
    : {
        key: "terminate",
        labelKey: "businessData.material.operations.terminate.title",
        onClick: () => setTerminateOpen(true),
      };

  const moreMenuItems: DetailMoreMenuItem[] = [
    {
      key: "dispatch",
      labelKey: "businessData.material.operations.dispatch.title",
      onClick: () => setDispatchOpen(true),
    },
    {
      key: "trackIn",
      labelKey: "businessData.material.operations.trackIn.title",
      onClick: () => setTrackInOpen(true),
    },
    {
      key: "trackOut",
      labelKey: "businessData.material.operations.trackOut.title",
      onClick: () => setTrackOutOpen(true),
    },
    {
      key: "moveNext",
      labelKey: "businessData.material.operations.moveNext.title",
      onClick: () => setMoveNextOpen(true),
    },
    {
      key: "ship",
      labelKey: "businessData.material.operations.ship.title",
      onClick: () => setShipOpen(true),
    },
    {
      key: "receive",
      labelKey: "businessData.material.operations.receive.title",
      onClick: () => setReceiveOpen(true),
    },
    {
      key: "hold",
      labelKey: "businessData.material.operations.hold.title",
      onClick: () => setHoldOpen(true),
    },
    {
      key: "split",
      labelKey: "businessData.material.operations.split.title",
      onClick: () => setSplitOpen(true),
    },
    {
      key: "merge",
      labelKey: "businessData.material.operations.merge.title",
      onClick: () => setMergeOpen(true),
    },
    {
      key: "attach",
      labelKey: "businessData.material.operations.attach.title",
      onClick: () => setAttachOpen(true),
    },
    {
      key: "grade",
      labelKey: "businessData.material.operations.grade.title",
      onClick: () => setGradeOpen(true),
    },
    {
      key: "viewReports",
      labelKey: "businessData.material.operations.viewReports.title",
      onClick: () => setViewReportsOpen(true),
    },
    {
      key: "clone",
      labelKey: "businessData.material.operations.clone.title",
      onClick: () => setCloneOpen(true),
    },
    terminateItem,
  ];

  return (
    <>
      <DetailShell
        title={detail.name}
        icon={<Box24Regular />}
        topTabs={TOP_TABS}
        top={top}
        onTop={setTop}
        leftItems={LEFT_SECTIONS}
        left={left}
        onLeft={setLeft}
        onEdit={() => setEditOpen(true)}
        onAskAi={() => undefined}
        showState={false}
        moreMenuItems={moreMenuItems}
      >
        {top === "details" && (
          <div className={styles.cards}>
            <Card
              titleKey="businessData.material.sections.material"
              rows={[
                [t("businessData.material.fields.name"), detail.name],
                [t("businessData.material.fields.description"), detail.description],
                [t("businessData.material.fields.type"), detail.type],
                [t("businessData.material.fields.universalState"), detail.universalState],
                [t("businessData.material.fields.systemState"), detail.systemState],
              ]}
            />
            <Card
              titleKey="businessData.material.sections.basicInformation"
              rows={[
                [t("businessData.material.fields.form"), detail.form],
                [t("businessData.material.fields.facility"), detail.facility],
                [t("businessData.material.fields.product"), detail.product],
                [t("businessData.material.fields.productDescription"), detail.productDescription],
              ]}
            />
            <Card
              titleKey="businessData.material.sections.flowAndStep"
              rows={[
                [t("businessData.material.fields.flow"), detail.flow],
                [t("businessData.material.fields.step"), detail.step],
                [t("businessData.material.fields.flowPath"), detail.flowPath],
              ]}
            />
            <Card
              titleKey="businessData.material.sections.quantities"
              rows={[
                [t("businessData.material.fields.primaryQuantity"), detail.primaryQuantity],
                [t("businessData.material.fields.secondaryQuantity"), detail.secondaryQuantity],
              ]}
            />
            <Card
              titleKey="businessData.material.sections.subMaterials"
              rows={[
                [
                  t("businessData.material.fields.subMaterialCount"),
                  String(detail.subMaterialCount),
                ],
              ]}
            />
            <Card
              titleKey="businessData.material.sections.resourceAndContainer"
              rows={[
                [t("businessData.material.fields.resource"), ""],
                [t("businessData.material.fields.container"), ""],
              ]}
            />
          </div>
        )}
        {top !== "details" && (
          <div className={styles.cards}>
            <Text>{t("businessData.material.emptyTab")}</Text>
          </div>
        )}
      </DetailShell>
      <CreateMaterialDialog open={createOpen} onClose={() => setCreateOpen(false)} />
      <EditMaterialDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initialName={detail.name}
      />
      <CloneMaterialDialog open={cloneOpen} onClose={() => setCloneOpen(false)} />
      <TerminateMaterialDialog open={terminateOpen} onClose={() => setTerminateOpen(false)} />
      <UnterminateMaterialDialog open={unterminateOpen} onClose={() => setUnterminateOpen(false)} />
      <DispatchMaterialDialog open={dispatchOpen} onClose={() => setDispatchOpen(false)} />
      <UndispatchMaterialDialog open={undispatchOpen} onClose={() => setUndispatchOpen(false)} />
      <TrackInMaterialDialog open={trackInOpen} onClose={() => setTrackInOpen(false)} />
      <TrackOutMaterialDialog open={trackOutOpen} onClose={() => setTrackOutOpen(false)} />
      <MoveNextMaterialDialog open={moveNextOpen} onClose={() => setMoveNextOpen(false)} />
      <AbortMaterialDialog open={abortOpen} onClose={() => setAbortOpen(false)} />
      <ShipMaterialDialog open={shipOpen} onClose={() => setShipOpen(false)} />
      <ReceiveMaterialDialog open={receiveOpen} onClose={() => setReceiveOpen(false)} />
      <UnshipMaterialDialog open={unshipOpen} onClose={() => setUnshipOpen(false)} />
      <HoldMaterialDialog open={holdOpen} onClose={() => setHoldOpen(false)} />
      <SplitMaterialDialog open={splitOpen} onClose={() => setSplitOpen(false)} />
      <MergeMaterialDialog open={mergeOpen} onClose={() => setMergeOpen(false)} />
      <CombineMaterialDialog open={combineOpen} onClose={() => setCombineOpen(false)} />
      <AttachMaterialDialog open={attachOpen} onClose={() => setAttachOpen(false)} />
      <DetachMaterialDialog open={detachOpen} onClose={() => setDetachOpen(false)} />
      <GradeMaterialDialog open={gradeOpen} onClose={() => setGradeOpen(false)} />
      <ReworkMaterialDialog open={reworkOpen} onClose={() => setReworkOpen(false)} />
      <ChangeProductDialog open={changeProductOpen} onClose={() => setChangeProductOpen(false)} />
      <ChangeQuantityDialog
        open={changeQuantityOpen}
        onClose={() => setChangeQuantityOpen(false)}
      />
      <ChangeFlowStepDialog
        open={changeFlowStepOpen}
        onClose={() => setChangeFlowStepOpen(false)}
      />
      <ViewMaterialReportsDialog open={viewReportsOpen} onClose={() => setViewReportsOpen(false)} />
      <ViewMaterialDocumentsDialog
        open={viewDocumentsOpen}
        onClose={() => setViewDocumentsOpen(false)}
      />
    </>
  );
}
