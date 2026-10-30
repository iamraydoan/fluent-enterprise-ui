import { useState } from "react";
import { useDocumentDetail } from "@/api";
import { Card, CardGrid, DetailShell, Empty, KV } from "@/components/common";
import type { DetailTab } from "@/components/common";
import { DocumentBulletList24Regular } from "@/components/icons";
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
import { formatDateTime } from "@/lib/formatDate";
import { useBooleanLabel } from "../propertyLabels";
import { DocumentWizardDialog } from "./DocumentWizardDialog";
import { MODE_CLONE, MODE_EDIT } from "./wizardMode";

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "detailShell.tabs.details" },
  { value: "tracking", labelKey: "businessData.document.tabs.tracking" },
  { value: "contexts", labelKey: "businessData.document.tabs.contexts" },
  { value: "compare", labelKey: "businessData.document.tabs.compare" },
  { value: "references", labelKey: "detailShell.tabs.references" },
  { value: "history", labelKey: "detailShell.tabs.history" },
];

const LEFT_ITEMS: TranslationKey[] = [
  "businessData.document.sections.details",
  "businessData.document.sections.applicableRoles",
  "businessData.document.sections.attributes",
  "businessData.document.sections.attachments",
];

export function DocumentDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const [top, setTop] = useState("details");
  const [editOpen, setEditOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [left, setLeft] = useState<string>("businessData.document.sections.details");
  const { data, isLoading } = useDocumentDetail(name);
  const booleanLabel = useBooleanLabel();

  const shell = (content: React.ReactNode) => (
    <>
      <DetailShell
        title={name}
        icon={<DocumentBulletList24Regular />}
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
      {editOpen && data && (
        <DocumentWizardDialog
          mode={MODE_EDIT}
          initialName={data.name}
          initialDescription={data.description}
          initialType={data.type}
          onClose={() => setEditOpen(false)}
        />
      )}
      {cloneOpen && data && (
        <DocumentWizardDialog
          mode={MODE_CLONE}
          initialName={`${data.name} (Copy)`}
          initialDescription={data.description}
          initialType={data.type}
          onClose={() => setCloneOpen(false)}
        />
      )}
    </>
  );

  if (isLoading || !data) {
    return shell(
      <Empty>
        <Text>{t("businessData.document.sections.emptyBody")}</Text>
      </Empty>,
    );
  }

  if (top === "tracking") {
    return shell(
      <Card title={t("businessData.document.sections.employees")}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>{t("businessData.document.columns.employee")}</TableHeaderCell>
              <TableHeaderCell>
                {t("businessData.document.columns.readAndUnderstoodDate")}
              </TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.tracking.map((entry) => (
              <TableRow key={entry.employee}>
                <TableCell>{entry.employee}</TableCell>
                <TableCell>{formatDateTime(entry.readAndUnderstoodDate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>,
    );
  }

  if (top !== "details") {
    return shell(
      <Empty>
        <Text>{t("businessData.document.sections.empty")}</Text>
      </Empty>,
    );
  }

  if (left !== "businessData.document.sections.details") {
    return shell(
      <Empty>
        <Text>{t("businessData.document.sections.empty")}</Text>
      </Empty>,
    );
  }

  return shell(
    <CardGrid>
      <Card title={t("businessData.document.sections.document")}>
        <KV
          rows={[
            [t("businessData.document.details.name"), data.name],
            [t("businessData.document.details.description"), data.description],
            [t("businessData.document.details.type"), data.type],
            [t("businessData.document.details.state"), data.state],
            [t("businessData.document.details.dataGroup"), data.dataGroup],
          ]}
        />
      </Card>
      <Card title={t("businessData.document.sections.content")}>
        <KV
          rows={[
            [t("businessData.document.details.source"), data.source],
            [t("businessData.document.details.file"), data.file],
            [t("businessData.document.details.changeDescription"), data.changeDescription],
          ]}
        />
      </Card>
      <Card title={t("businessData.document.sections.information")}>
        <KV
          rows={[
            [t("businessData.document.details.folder"), data.folder],
            [t("businessData.document.details.ownerRole"), data.ownerRole],
            [t("businessData.document.details.group"), data.group],
            [t("businessData.document.details.author"), data.author],
            [t("businessData.document.details.creationDate"), formatDateTime(data.creationDate)],
            [t("businessData.document.details.link"), data.link],
            [t("businessData.document.details.versionLink"), data.versionLink],
            [t("businessData.document.details.keywords"), data.keywords],
          ]}
        />
      </Card>
      <Card title={t("businessData.document.sections.readAndUnderstand")}>
        <KV
          rows={[
            [
              t("businessData.document.details.requireSignature"),
              booleanLabel(data.requireSignature),
            ],
            [t("businessData.document.details.expirationDays"), data.expirationDays],
          ]}
        />
      </Card>
    </CardGrid>,
  );
}
