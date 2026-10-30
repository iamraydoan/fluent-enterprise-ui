import { useState } from "react";
import { useFacilityDetail } from "@/api";
import { Card, CardGrid, DetailShell, Empty, KV } from "@/components/common";
import type { DetailTab } from "@/components/common";
import { Organization24Regular } from "@/components/icons";
import { Text, Button } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useBooleanLabel } from "../propertyLabels";
import { FacilityDialog } from "./FacilityDialog";
import { FacilityTerminateDialog } from "./FacilityTerminateDialog";
import { ManageShippingFacilitiesDialog } from "./ManageShippingFacilitiesDialog";
import { MODE_CLONE, MODE_EDIT, TERMINATE, UNTERMINATE } from "./wizardMode";

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "detailShell.tabs.details" },
  { value: "references", labelKey: "detailShell.tabs.references" },
  { value: "history", labelKey: "detailShell.tabs.history" },
];

const LEFT_ITEMS: TranslationKey[] = [
  "businessData.facility.sections.details",
  "businessData.facility.sections.areas",
  "businessData.facility.sections.shippingInformation",
  "businessData.facility.sections.attachments",
];

export function FacilityDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<string>("businessData.facility.sections.details");
  const [editOpen, setEditOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [unterminateOpen, setUnterminateOpen] = useState(false);
  const [manageShippingOpen, setManageShippingOpen] = useState(false);
  const { data, isLoading } = useFacilityDetail(name);
  const booleanLabel = useBooleanLabel();

  const shell = (content: React.ReactNode) => (
    <>
      <DetailShell
        title={name}
        icon={<Organization24Regular />}
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
        <FacilityDialog mode={MODE_EDIT} initialName={name} onClose={() => setEditOpen(false)} />
      )}
      {cloneOpen && (
        <FacilityDialog
          mode={MODE_CLONE}
          initialName={`${name} (Copy)`}
          onClose={() => setCloneOpen(false)}
        />
      )}
      {terminateOpen && (
        <FacilityTerminateDialog
          name={name}
          mode={TERMINATE}
          onClose={() => setTerminateOpen(false)}
        />
      )}
      {unterminateOpen && (
        <FacilityTerminateDialog
          name={name}
          mode={UNTERMINATE}
          onClose={() => setUnterminateOpen(false)}
        />
      )}
      {manageShippingOpen && (
        <ManageShippingFacilitiesDialog name={name} onClose={() => setManageShippingOpen(false)} />
      )}
    </>
  );

  if (isLoading || !data) {
    return shell(
      <Empty>
        <Text>{t("businessData.facility.sections.emptyBody")}</Text>
      </Empty>,
    );
  }

  if (top !== "details" || left !== "businessData.facility.sections.details") {
    return shell(
      <Empty>
        <Text>{t("businessData.facility.sections.empty")}</Text>
      </Empty>,
    );
  }

  return shell(
    <CardGrid>
      <Card title={t("businessData.facility.sections.facility")}>
        <KV
          rows={[
            [t("businessData.facility.details.name"), data.name],
            [t("businessData.facility.details.description"), data.description],
            [t("businessData.facility.details.type"), data.type],
            [t("businessData.facility.details.state"), data.state],
            [t("businessData.facility.details.dataGroup"), data.dataGroup],
          ]}
        />
      </Card>
      <Card title={t("businessData.facility.sections.information")}>
        <KV
          rows={[
            [t("businessData.facility.details.displayOrder"), String(data.displayOrder)],
            [t("businessData.facility.details.defaultCalendar"), data.defaultCalendar],
            [t("businessData.facility.details.site"), data.site],
            [t("businessData.facility.details.remote"), booleanLabel(data.remote)],
            [
              t("businessData.facility.details.terminateOnShipToThisFacility"),
              booleanLabel(data.terminateOnShipToThisFacility),
            ],
          ]}
        />
        <div style={{ marginTop: "12px" }}>
          <Button onClick={() => setManageShippingOpen(true)}>
            {t("businessData.facility.manageShipping.manage")}
          </Button>
        </div>
      </Card>
    </CardGrid>,
  );
}
