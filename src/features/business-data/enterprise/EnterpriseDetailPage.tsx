import { useState } from "react";
import { useEnterpriseDetail } from "@/api";
import { Card, CardGrid, DetailShell, Empty, KV } from "@/components/common";
import type { DetailTab } from "@/components/common";
import { Organization24Regular } from "@/components/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { MODE_CLONE, MODE_EDIT } from "../components/wizardMode";
import { EnterpriseDialog } from "./EnterpriseDialogs";

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "detailShell.tabs.details" },
  { value: "references", labelKey: "detailShell.tabs.references" },
  { value: "history", labelKey: "detailShell.tabs.history" },
];

const LEFT_ITEMS: TranslationKey[] = [
  "businessData.enterprise.sections.details",
  "businessData.enterprise.sections.sites",
  "businessData.enterprise.sections.attributes",
  "businessData.enterprise.sections.attachments",
];

export function EnterpriseDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<string>("businessData.enterprise.sections.details");
  const [editOpen, setEditOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const { data, isLoading } = useEnterpriseDetail(name);

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
        onAskAi={() => undefined}
      >
        {content}
      </DetailShell>
      {editOpen && (
        <EnterpriseDialog mode={MODE_EDIT} initialName={name} onClose={() => setEditOpen(false)} />
      )}
      {cloneOpen && (
        <EnterpriseDialog
          mode={MODE_CLONE}
          initialName={`${name} (Copy)`}
          onClose={() => setCloneOpen(false)}
        />
      )}
    </>
  );

  if (isLoading || !data) {
    return shell(
      <Empty>
        <Text>{t("businessData.enterprise.sections.emptyBody")}</Text>
      </Empty>,
    );
  }

  if (top !== "details" || left !== "businessData.enterprise.sections.details") {
    if (left === "businessData.enterprise.sections.sites" && top === "details") {
      return shell(
        <Card title={t("businessData.enterprise.sections.sites")}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>{t("businessData.enterprise.columns.name")}</TableHeaderCell>
                <TableHeaderCell>{t("businessData.enterprise.columns.state")}</TableHeaderCell>
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
        <Text>{t("businessData.enterprise.sections.empty")}</Text>
      </Empty>,
    );
  }

  return shell(
    <CardGrid>
      <Card title={t("businessData.enterprise.sections.enterprise")}>
        <KV
          rows={[
            [t("businessData.enterprise.details.name"), data.name],
            [t("businessData.enterprise.details.description"), data.description],
            [t("businessData.enterprise.details.state"), data.state],
            [t("businessData.enterprise.details.dataGroup"), data.dataGroup],
          ]}
        />
      </Card>
    </CardGrid>,
  );
}
