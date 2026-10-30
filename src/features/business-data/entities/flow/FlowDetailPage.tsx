import { useState } from "react";
import { useFlowDetail } from "@/api";
import { Card, CardGrid, DetailShell, Empty, KV, SidePanel } from "@/components/common";
import type { DetailTab } from "@/components/common";
import { Flow24Regular } from "@/components/icons";
import { Button, Text, Tree, TreeItem, TreeItemLayout } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useBooleanLabel } from "../propertyLabels";
import { FlowDialog } from "./FlowDialog";
import { FlowLogicalNamesDialog, FlowReworkPathsDialog } from "./FlowManageDialogs";
import { FlowTerminateDialog } from "./FlowTerminateDialog";
import { MODE_CLONE, MODE_EDIT, TERMINATE, UNTERMINATE } from "./wizardMode";


const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "detailShell.tabs.details" },
  { value: "flowStructure", labelKey: "businessData.flow.tabs.flowStructure" },
  { value: "contextStructure", labelKey: "businessData.flow.tabs.contextStructure" },
  { value: "contextMatrix", labelKey: "businessData.flow.tabs.contextMatrix" },
  { value: "compare", labelKey: "businessData.flow.tabs.compare" },
  { value: "references", labelKey: "detailShell.tabs.references" },
  { value: "history", labelKey: "detailShell.tabs.history" },
];

const LEFT_ITEMS: TranslationKey[] = [
  "businessData.flow.sections.details",
  "businessData.flow.sections.logicalNames",
  "businessData.flow.sections.attachments",
];

export function FlowDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<string>("businessData.flow.sections.details");
  const [structureCollapsed, setStructureCollapsed] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [unterminateOpen, setUnterminateOpen] = useState(false);
  const [logicalNamesOpen, setLogicalNamesOpen] = useState(false);
  const [reworkPathsOpen, setReworkPathsOpen] = useState(false);
  const { data, isLoading } = useFlowDetail(name);
  const booleanLabel = useBooleanLabel();

  const shell = (content: React.ReactNode) => (
    <>
      <DetailShell
        title={name}
        icon={<Flow24Regular />}
        topTabs={TOP_TABS}
        top={top}
        onTop={setTop}
        leftItems={LEFT_ITEMS}
        left={left}
        onLeft={setLeft}
        onEdit={() => setEditOpen(true)}
        onClone={() => setCloneOpen(true)}
        onTerminate={() => setTerminateOpen(true)}
        onUnterminate={() => setUnterminateOpen(true)}
        onAskAi={() => undefined}
      >
        {content}
      </DetailShell>
      {editOpen && (
        <FlowDialog mode={MODE_EDIT} initialName={name} onClose={() => setEditOpen(false)} />
      )}
      {cloneOpen && (
        <FlowDialog
          mode={MODE_CLONE}
          initialName={`${name} (Copy)`}
          onClose={() => setCloneOpen(false)}
        />
      )}
      {terminateOpen && (
        <FlowTerminateDialog name={name} mode={TERMINATE} onClose={() => setTerminateOpen(false)} />
      )}
      {unterminateOpen && (
        <FlowTerminateDialog
          name={name}
          mode={UNTERMINATE}
          onClose={() => setUnterminateOpen(false)}
        />
      )}
      {logicalNamesOpen && <FlowLogicalNamesDialog onClose={() => setLogicalNamesOpen(false)} />}
      {reworkPathsOpen && <FlowReworkPathsDialog onClose={() => setReworkPathsOpen(false)} />}
    </>
  );

  if (isLoading || !data) {
    return shell(
      <Empty>
        <Text>{t("businessData.flow.sections.emptyBody")}</Text>
      </Empty>,
    );
  }

  if (top === "flowStructure") {
    return shell(
      <div style={{ display: "flex", gap: 16, height: "100%" }}>
        <SidePanel
          title={t("businessData.flow.sections.flowStructure")}
          collapsed={structureCollapsed}
          onToggle={() => setStructureCollapsed((value) => !value)}
        >
          <Tree>
            <TreeItem itemType="branch">
              <TreeItemLayout>{`${data.name} [A]`}</TreeItemLayout>
              {data.items.map((item) => (
                <TreeItem key={item.position} itemType="leaf">
                  <TreeItemLayout>{`${item.position}. ${item.name}`}</TreeItemLayout>
                </TreeItem>
              ))}
            </TreeItem>
          </Tree>
        </SidePanel>
        <Card title={t("businessData.flow.sections.flowDetails")}>
          <KV
            rows={[
              [t("businessData.flow.details.flow"), `${data.name} [A]`],
              [t("businessData.flow.details.description"), data.description],
              [t("businessData.flow.details.flowType"), data.flowType],
            ]}
          />
        </Card>
      </div>,
    );
  }

  if (top === "details" && left === "businessData.flow.sections.logicalNames") {
    return shell(
      <Card title={t("businessData.flow.sections.logicalNames")}>
        <Button appearance="primary" onClick={() => setLogicalNamesOpen(true)}>
          {t("businessData.flow.actions.manageLogicalNames")}
        </Button>
        <div style={{ marginTop: "12px" }}>
          <Button onClick={() => setReworkPathsOpen(true)}>
            {t("businessData.flow.actions.viewReworkPaths")}
          </Button>
        </div>
      </Card>,
    );
  }

  if (top !== "details" || left !== "businessData.flow.sections.details") {
    return shell(
      <Empty>
        <Text>{t("businessData.flow.sections.empty")}</Text>
      </Empty>,
    );
  }

  return shell(
    <CardGrid>
      <Card title={t("businessData.flow.sections.flow")}>
        <KV
          rows={[
            [t("businessData.flow.details.name"), data.name],
            [t("businessData.flow.details.description"), data.description],
            [t("businessData.flow.details.type"), data.type],
            [t("businessData.flow.details.state"), data.state],
            [t("businessData.flow.details.dataGroup"), data.dataGroup],
          ]}
        />
      </Card>
      <Card title={t("businessData.flow.sections.settings")}>
        <KV
          rows={[
            [t("businessData.flow.details.flowType"), data.flowType],
            [t("businessData.flow.details.enabled"), booleanLabel(data.enabled)],
          ]}
        />
      </Card>
    </CardGrid>,
  );
}
