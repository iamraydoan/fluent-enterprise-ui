import { useState } from "react";
import { useProductGroupDetail } from "@/api";
import type { DetailMoreMenuItem } from "@/components/common";
import { DetailSectionCard, DetailShell, Grid, KV } from "@/components/common";
import { Box24Regular } from "@/components/icons";
import { Text } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import {
  CloneProductGroupDialog,
  EditProductGroupDialog,
  ManageProductGroupParametersDialog,
  TerminateProductGroupDialog,
  UnterminateProductGroupDialog,
} from "./dialogs";

const TOP_TABS: { value: string; labelKey: TranslationKey }[] = [
  { value: "details", labelKey: "businessData.productGroup.tabs.details" },
  { value: "contexts", labelKey: "businessData.productGroup.tabs.contexts" },
  { value: "compare", labelKey: "businessData.productGroup.tabs.compare" },
  { value: "references", labelKey: "businessData.productGroup.tabs.references" },
  { value: "history", labelKey: "businessData.productGroup.tabs.history" },
];

const LEFT_ITEMS: TranslationKey[] = [
  "businessData.productGroup.left.details",
  "businessData.productGroup.left.parameters",
  "businessData.productGroup.left.products",
  "businessData.productGroup.left.attachments",
];

export function ProductGroupDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const { data: detail } = useProductGroupDetail(name);

  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<string>(LEFT_ITEMS[0]);
  const [editOpen, setEditOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [unterminateOpen, setUnterminateOpen] = useState(false);
  const [manageParamsOpen, setManageParamsOpen] = useState(false);

  if (!detail) {
    return <Text>{t("businessData.productGroup.pageLabel")}</Text>;
  }

  const isTerminated = detail.state === "Terminated";

  const terminateItem: DetailMoreMenuItem = isTerminated
    ? {
        key: "unterminate",
        labelKey: "businessData.productGroup.operations.unterminate.title",
        onClick: () => setUnterminateOpen(true),
      }
    : {
        key: "terminate",
        labelKey: "businessData.productGroup.operations.terminate.title",
        onClick: () => setTerminateOpen(true),
      };

  const moreMenuItems: DetailMoreMenuItem[] = [
    {
      key: "clone",
      labelKey: "businessData.productGroup.operations.clone.title",
      onClick: () => setCloneOpen(true),
    },
    {
      key: "manageParameters",
      labelKey: "businessData.productGroup.operations.manageParameters.title",
      onClick: () => setManageParamsOpen(true),
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
        leftItems={LEFT_ITEMS}
        left={left}
        onLeft={setLeft}
        onEdit={() => setEditOpen(true)}
        onAskAi={() => undefined}
        showState={false}
        moreActions={moreMenuItems}
      >
        {top === "details" && left === LEFT_ITEMS[0] && (
          <Grid columns="repeat(2, 1fr)" gap="md">
            <DetailSectionCard title={t("businessData.productGroup.detail.generalData")}>
              <KV
                rows={[
                  [t("businessData.productGroup.detail.fields.name"), detail.name],
                  [t("businessData.productGroup.detail.fields.description"), detail.description],
                  [t("businessData.productGroup.detail.fields.state"), detail.state],
                  [t("businessData.productGroup.detail.fields.productCount"), detail.productCount],
                ]}
              />
            </DetailSectionCard>
            <DetailSectionCard title={t("businessData.productGroup.detail.information")}>
              <KV rows={[]} />
            </DetailSectionCard>
          </Grid>
        )}
        {top === "details" && left === LEFT_ITEMS[1] && (
          <DetailSectionCard title={t("businessData.productGroup.left.parameters")}>
            <Text size={300}>{t("businessData.productGroup.paramsHint")}</Text>
          </DetailSectionCard>
        )}
        {top === "details" && left === LEFT_ITEMS[2] && (
          <DetailSectionCard title={t("businessData.productGroup.left.products")}>
            <Text size={300}>{t("businessData.productGroup.productsHint")}</Text>
          </DetailSectionCard>
        )}
        {top === "details" && left === LEFT_ITEMS[3] && (
          <DetailSectionCard title={t("businessData.productGroup.left.attachments")}>
            {null}
          </DetailSectionCard>
        )}
        {top === "contexts" && (
          <DetailSectionCard title={t("businessData.productGroup.tabs.contexts")}>
            <Text size={300}>{t("businessData.productGroup.contextsHint")}</Text>
          </DetailSectionCard>
        )}
        {top === "compare" && (
          <DetailSectionCard title={t("businessData.productGroup.tabs.compare")}>
            <Text size={300}>{t("businessData.productGroup.compareHint")}</Text>
          </DetailSectionCard>
        )}
        {top === "references" && (
          <DetailSectionCard title={t("businessData.productGroup.tabs.references")}>
            <Text size={300}>{t("businessData.productGroup.referencesHint")}</Text>
          </DetailSectionCard>
        )}
        {top === "history" && (
          <DetailSectionCard title={t("businessData.productGroup.tabs.history")}>
            <Text size={300}>{t("businessData.productGroup.historyHint")}</Text>
          </DetailSectionCard>
        )}
      </DetailShell>

      <EditProductGroupDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initialName={detail.name}
      />
      <CloneProductGroupDialog open={cloneOpen} onClose={() => setCloneOpen(false)} />
      <TerminateProductGroupDialog open={terminateOpen} onClose={() => setTerminateOpen(false)} />
      <UnterminateProductGroupDialog
        open={unterminateOpen}
        onClose={() => setUnterminateOpen(false)}
      />
      <ManageProductGroupParametersDialog
        open={manageParamsOpen}
        onClose={() => setManageParamsOpen(false)}
      />
    </>
  );
}
