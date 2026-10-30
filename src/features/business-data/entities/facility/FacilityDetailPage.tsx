import { useState } from "react";
import { useFacilityDetail } from "@/api";
import { Card, CardGrid, DetailShell, Empty, KV } from "@/components/common";
import type { DetailTab } from "@/components/common";
import { Organization24Regular } from "@/components/icons";
import { Text } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useBooleanLabel } from "../propertyLabels";

const tk = (key: string) => key as TranslationKey;

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "detailShell.tabs.details" },
  { value: "references", labelKey: "detailShell.tabs.references" },
  { value: "history", labelKey: "detailShell.tabs.history" },
];

const LEFT_ITEMS: TranslationKey[] = [
  tk("businessData.facility.sections.details"),
  tk("businessData.facility.sections.areas"),
  tk("businessData.facility.sections.shippingInformation"),
  tk("businessData.facility.sections.attachments"),
];

export function FacilityDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<string>(tk("businessData.facility.sections.details"));
  const { data, isLoading } = useFacilityDetail(name);
  const booleanLabel = useBooleanLabel();

  const shell = (content: React.ReactNode) => (
    <DetailShell
      title={name}
      icon={<Organization24Regular />}
      topTabs={TOP_TABS}
      top={top}
      onTop={setTop}
      leftItems={LEFT_ITEMS}
      left={left}
      onLeft={setLeft}
      onEdit={() => undefined}
      onAskAi={() => undefined}
    >
      {content}
    </DetailShell>
  );

  if (isLoading || !data) {
    return shell(
      <Empty>
        <Text>{t(tk("businessData.facility.sections.emptyBody"))}</Text>
      </Empty>,
    );
  }

  if (top !== "details" || left !== tk("businessData.facility.sections.details")) {
    return shell(
      <Empty>
        <Text>{t(tk("businessData.facility.sections.empty"))}</Text>
      </Empty>,
    );
  }

  return shell(
    <CardGrid>
      <Card title={t(tk("businessData.facility.sections.facility"))}>
        <KV
          rows={[
            [t(tk("businessData.facility.details.name")), data.name],
            [t(tk("businessData.facility.details.description")), data.description],
            [t(tk("businessData.facility.details.type")), data.type],
            [t(tk("businessData.facility.details.state")), data.state],
            [t(tk("businessData.facility.details.dataGroup")), data.dataGroup],
          ]}
        />
      </Card>
      <Card title={t(tk("businessData.facility.sections.information"))}>
        <KV
          rows={[
            [t(tk("businessData.facility.details.displayOrder")), String(data.displayOrder)],
            [t(tk("businessData.facility.details.defaultCalendar")), data.defaultCalendar],
            [t(tk("businessData.facility.details.site")), data.site],
            [t(tk("businessData.facility.details.remote")), booleanLabel(data.remote)],
            [t(tk("businessData.facility.details.terminateOnShipToThisFacility")), booleanLabel(data.terminateOnShipToThisFacility)],
          ]}
        />
      </Card>
    </CardGrid>,
  );
}
