import { useState } from "react";
import { useProductDetail } from "@/api";
import type { DetailMoreMenuItem, DetailTab } from "@/components/common";
import { DetailShell, KV } from "@/components/common";
import { Box24Regular } from "@/components/icons";
import { Text, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import {
  CloneProductDialog,
  CreateBOMForProductDialog,
  CreateProductDialog,
  EditProductDialog,
  ImportProductInfoDialog,
  ManageBinningTreeDialog,
  ManageCharacteristicsDialog,
  ManageComponentInfoDialog,
  ManageCostsDialog,
  ManageManufacturersDialog,
  ManageMaterialLogisticsDialog,
  ManagePlanningDialog,
  ManageProductParametersDialog,
  ManageRepairPolicyDialog,
  ManageRulesDialog,
  ManageSafetyInfoDialog,
  ManageSchedulingDialog,
  ManageSubProductsDialog,
  ManageTransferInfoDialog,
  ManageUnitConversionDialog,
  PreviewRulesDialog,
  TerminateProductDialog,
  UnterminateProductDialog,
  ViewProductReportsDialog,
} from "./ProductOperations";

const useStyles = makeStyles({
  cards: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" },
  sectionTitle: { marginBottom: "8px" },
});

export function ProductDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const styles = useStyles();
  const shared = useSharedStyles();
  const { data: detail } = useProductDetail(name);

  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<string>("businessData.product.left.details");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [unterminateOpen, setUnterminateOpen] = useState(false);
  const [createBOMOpen, setCreateBOMOpen] = useState(false);
  const [importInfoOpen, setImportInfoOpen] = useState(false);
  const [binningTreeOpen, setBinningTreeOpen] = useState(false);
  const [characteristicsOpen, setCharacteristicsOpen] = useState(false);
  const [costsOpen, setCostsOpen] = useState(false);
  const [logisticsOpen, setLogisticsOpen] = useState(false);
  const [parametersOpen, setParametersOpen] = useState(false);
  const [planningOpen, setPlanningOpen] = useState(false);
  const [componentInfoOpen, setComponentInfoOpen] = useState(false);
  const [manufacturersOpen, setManufacturersOpen] = useState(false);
  const [repairPolicyOpen, setRepairPolicyOpen] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [safetyInfoOpen, setSafetyInfoOpen] = useState(false);
  const [schedulingOpen, setSchedulingOpen] = useState(false);
  const [subProductsOpen, setSubProductsOpen] = useState(false);
  const [transferInfoOpen, setTransferInfoOpen] = useState(false);
  const [unitConversionOpen, setUnitConversionOpen] = useState(false);
  const [previewRulesOpen, setPreviewRulesOpen] = useState(false);
  const [viewReportsOpen, setViewReportsOpen] = useState(false);

  if (!detail) {
    return <Text>{t("businessData.product.pageLabel")}</Text>;
  }

  const isTerminated = detail.state === "Terminated";

  const topTabs: DetailTab[] = [
    { value: "details", labelKey: "businessData.product.tabs.details" },
    { value: "references", labelKey: "businessData.product.tabs.references" },
    { value: "history", labelKey: "businessData.product.tabs.history" },
  ];

  const leftItems: TranslationKey[] = [
    "businessData.product.left.details",
    "businessData.product.left.parameters",
    "businessData.product.left.attachments",
  ];

  const terminateItem: DetailMoreMenuItem = isTerminated
    ? {
        key: "unterminate",
        labelKey: "businessData.product.operations.unterminate.title",
        onClick: () => setUnterminateOpen(true),
      }
    : {
        key: "terminate",
        labelKey: "businessData.product.operations.terminate.title",
        onClick: () => setTerminateOpen(true),
      };

  const moreMenuItems: DetailMoreMenuItem[] = [
    {
      key: "createBOM",
      labelKey: "businessData.product.operations.createBOM.title",
      onClick: () => setCreateBOMOpen(true),
    },
    {
      key: "manageParameters",
      labelKey: "businessData.product.operations.manageParameters.title",
      onClick: () => setParametersOpen(true),
    },
    {
      key: "manageBinningTree",
      labelKey: "businessData.product.operations.manageBinningTree.title",
      onClick: () => setBinningTreeOpen(true),
    },
    {
      key: "manageSubProducts",
      labelKey: "businessData.product.operations.manageSubProducts.title",
      onClick: () => setSubProductsOpen(true),
    },
    {
      key: "manageUnitConversion",
      labelKey: "businessData.product.operations.manageUnitConversion.title",
      onClick: () => setUnitConversionOpen(true),
    },
    {
      key: "manageCharacteristics",
      labelKey: "businessData.product.operations.manageCharacteristics.title",
      onClick: () => setCharacteristicsOpen(true),
    },
    {
      key: "manageCosts",
      labelKey: "businessData.product.operations.manageCosts.title",
      onClick: () => setCostsOpen(true),
    },
    {
      key: "manageLogistics",
      labelKey: "businessData.product.operations.manageLogistics.title",
      onClick: () => setLogisticsOpen(true),
    },
    {
      key: "managePlanning",
      labelKey: "businessData.product.operations.managePlanning.title",
      onClick: () => setPlanningOpen(true),
    },
    {
      key: "manageScheduling",
      labelKey: "businessData.product.operations.manageScheduling.title",
      onClick: () => setSchedulingOpen(true),
    },
    {
      key: "manageRules",
      labelKey: "businessData.product.operations.manageRules.title",
      onClick: () => setRulesOpen(true),
    },
    {
      key: "previewRules",
      labelKey: "businessData.product.operations.previewRules.title",
      onClick: () => setPreviewRulesOpen(true),
    },
    {
      key: "viewReports",
      labelKey: "businessData.product.operations.viewReports.title",
      onClick: () => setViewReportsOpen(true),
    },
    {
      key: "clone",
      labelKey: "businessData.product.operations.clone.title",
      onClick: () => setCloneOpen(true),
    },
    terminateItem,
  ];

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
        onEdit={() => setEditOpen(true)}
        onAskAi={() => undefined}
        showState={false}
        moreMenuItems={moreMenuItems}
      >
        <div className={styles.cards}>
          <div className={shared.contentCard} style={{ padding: "14px 16px" }}>
            <Text weight="semibold" size={400} className={styles.sectionTitle}>
              {t("businessData.product.detail.generalData")}
            </Text>
            <KV
              rows={[
                [t("businessData.product.detail.fields.name"), detail.name],
                [t("businessData.product.detail.fields.description"), detail.description],
                [t("businessData.product.detail.fields.productType"), detail.productType],
                [t("businessData.product.detail.fields.state"), detail.state],
                [t("businessData.product.detail.fields.isActive"), detail.isActive],
              ]}
            />
          </div>
        </div>
      </DetailShell>
      <CreateProductDialog open={createOpen} onClose={() => setCreateOpen(false)} />
      <EditProductDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initialName={detail.name}
      />
      <CloneProductDialog open={cloneOpen} onClose={() => setCloneOpen(false)} />
      <TerminateProductDialog open={terminateOpen} onClose={() => setTerminateOpen(false)} />
      <UnterminateProductDialog open={unterminateOpen} onClose={() => setUnterminateOpen(false)} />
      <CreateBOMForProductDialog open={createBOMOpen} onClose={() => setCreateBOMOpen(false)} />
      <ImportProductInfoDialog open={importInfoOpen} onClose={() => setImportInfoOpen(false)} />
      <ManageBinningTreeDialog open={binningTreeOpen} onClose={() => setBinningTreeOpen(false)} />
      <ManageCharacteristicsDialog
        open={characteristicsOpen}
        onClose={() => setCharacteristicsOpen(false)}
      />
      <ManageCostsDialog open={costsOpen} onClose={() => setCostsOpen(false)} />
      <ManageMaterialLogisticsDialog open={logisticsOpen} onClose={() => setLogisticsOpen(false)} />
      <ManageProductParametersDialog
        open={parametersOpen}
        onClose={() => setParametersOpen(false)}
      />
      <ManagePlanningDialog open={planningOpen} onClose={() => setPlanningOpen(false)} />
      <ManageComponentInfoDialog
        open={componentInfoOpen}
        onClose={() => setComponentInfoOpen(false)}
      />
      <ManageManufacturersDialog
        open={manufacturersOpen}
        onClose={() => setManufacturersOpen(false)}
      />
      <ManageRepairPolicyDialog
        open={repairPolicyOpen}
        onClose={() => setRepairPolicyOpen(false)}
      />
      <ManageRulesDialog open={rulesOpen} onClose={() => setRulesOpen(false)} />
      <ManageSafetyInfoDialog open={safetyInfoOpen} onClose={() => setSafetyInfoOpen(false)} />
      <ManageSchedulingDialog open={schedulingOpen} onClose={() => setSchedulingOpen(false)} />
      <ManageSubProductsDialog open={subProductsOpen} onClose={() => setSubProductsOpen(false)} />
      <ManageTransferInfoDialog
        open={transferInfoOpen}
        onClose={() => setTransferInfoOpen(false)}
      />
      <ManageUnitConversionDialog
        open={unitConversionOpen}
        onClose={() => setUnitConversionOpen(false)}
      />
      <PreviewRulesDialog open={previewRulesOpen} onClose={() => setPreviewRulesOpen(false)} />
      <ViewProductReportsDialog open={viewReportsOpen} onClose={() => setViewReportsOpen(false)} />
    </>
  );
}
