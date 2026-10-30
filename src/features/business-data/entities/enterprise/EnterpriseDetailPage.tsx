import { useState } from "react";
import { useEnterpriseDetail } from "@/api";
import { Card, CardGrid, DetailShell, Empty, KV } from "@/components/common";
import type { DetailTab } from "@/components/common";
import { Organization24Regular } from "@/components/icons";
import { Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow, Text } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

const tk = (key: string) => key as TranslationKey;

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "detailShell.tabs.details" },
  { value: "references", labelKey: "detailShell.tabs.references" },
  { value: "history", labelKey: "detailShell.tabs.history" },
];

const LEFT_ITEMS: TranslationKey[] = [
  tk("businessData.enterprise.sections.details"),
  tk("businessData.enterprise.sections.sites"),
  tk("businessData.enterprise.sections.attributes"),
  tk("businessData.enterprise.sections.attachments"),
];

export function EnterpriseDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<string>(tk("businessData.enterprise.sections.details"));
  const { data, isLoading } = useEnterpriseDetail(name);

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
        <Text>{t(tk("businessData.enterprise.sections.emptyBody"))}</Text>
      </Empty>,
    );
  }

  if (top !== "details" || left !== tk("businessData.enterprise.sections.details")) {
    if (left === tk("businessData.enterprise.sections.sites") && top === "details") {
      return shell(
        <Card title={t(tk("businessData.enterprise.sections.sites"))}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>{t(tk("businessData.enterprise.columns.name"))}</TableHeaderCell>
                <TableHeaderCell>{t(tk("businessData.enterprise.columns.state"))}</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.sites.map((site) => (
                <TableRow key={site.name}>
                  <TableCell>{site.name}</TableCell>
                  <TableCell>{site.state}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>,
      );
    }
    return shell(
      <Empty>
        <Text>{t(tk("businessData.enterprise.sections.empty"))}</Text>
      </Empty>,
    );
  }

  return shell(
    <CardGrid>
      <Card title={t(tk("businessData.enterprise.sections.enterprise"))}>
        <KV
          rows={[
            [t(tk("businessData.enterprise.details.name")), data.name],
            [t(tk("businessData.enterprise.details.description")), data.description],
            [t(tk("businessData.enterprise.details.state")), data.state],
            [t(tk("businessData.enterprise.details.dataGroup")), data.dataGroup],
          ]}
        />
      </Card>
    </CardGrid>,
  );
}
