import { useState } from "react";
import { useMapDetail } from "@/api";
import { Card, CardGrid, DetailShell, Empty, KV } from "@/components/common";
import type { DetailTab } from "@/components/common";
import { Grid24Regular } from "@/components/icons";
import { Text } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

const tk = (key: string) => key as TranslationKey;

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "detailShell.tabs.details" },
  { value: "content", labelKey: tk("businessData.map.tabs.content") },
  { value: "references", labelKey: "detailShell.tabs.references" },
  { value: "history", labelKey: "detailShell.tabs.history" },
];

const LEFT_ITEMS: TranslationKey[] = [
  tk("businessData.map.sections.details"),
  tk("businessData.map.sections.layers"),
  tk("businessData.map.sections.attachments"),
];

export function MapDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<string>(tk("businessData.map.sections.details"));
  const { data, isLoading } = useMapDetail(name);

  const shell = (content: React.ReactNode) => (
    <DetailShell
      title={name}
      icon={<Grid24Regular />}
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
        <Text>{t(tk("businessData.map.sections.emptyBody"))}</Text>
      </Empty>,
    );
  }

  if (top !== "details" || left !== tk("businessData.map.sections.details")) {
    return shell(
      <Empty>
        <Text>{t(tk("businessData.map.sections.empty"))}</Text>
      </Empty>,
    );
  }

  return shell(
    <CardGrid>
      <Card title={t(tk("businessData.map.sections.map"))}>
        <KV
          rows={[
            [t(tk("businessData.map.details.name")), data.name],
            [t(tk("businessData.map.details.description")), data.description],
            [t(tk("businessData.map.details.state")), data.state],
          ]}
        />
      </Card>
      <Card title={t(tk("businessData.map.sections.mapDefinition"))}>
        <KV
          rows={[
            [t(tk("businessData.map.details.mapDefinition")), data.mapDefinition],
          ]}
        />
      </Card>
      <Card title={t(tk("businessData.map.sections.context"))}>
        <KV
          rows={[
            [t(tk("businessData.map.details.step")), data.step],
            [t(tk("businessData.map.details.resource")), data.resource],
            [t(tk("businessData.map.details.material")), data.material],
          ]}
        />
      </Card>
    </CardGrid>,
  );
}
