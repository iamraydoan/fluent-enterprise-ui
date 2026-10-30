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

const tk = (key: string) => key as TranslationKey;

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "detailShell.tabs.details" },
  { value: "tracking", labelKey: tk("businessData.document.tabs.tracking") },
  { value: "contexts", labelKey: tk("businessData.document.tabs.contexts") },
  { value: "compare", labelKey: tk("businessData.document.tabs.compare") },
  { value: "references", labelKey: "detailShell.tabs.references" },
  { value: "history", labelKey: "detailShell.tabs.history" },
];

const LEFT_ITEMS: TranslationKey[] = [
  tk("businessData.document.sections.details"),
  tk("businessData.document.sections.applicableRoles"),
  tk("businessData.document.sections.attributes"),
  tk("businessData.document.sections.attachments"),
];

export function DocumentDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<string>(tk("businessData.document.sections.details"));
  const { data, isLoading } = useDocumentDetail(name);
  const booleanLabel = useBooleanLabel();

  const shell = (content: React.ReactNode) => (
    <DetailShell
      title={name}
      icon={<DocumentBulletList24Regular />}
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
        <Text>{t(tk("businessData.document.sections.emptyBody"))}</Text>
      </Empty>,
    );
  }

  if (top === "tracking") {
    return shell(
      <Card title={t(tk("businessData.document.sections.employees"))}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>{t(tk("businessData.document.columns.employee"))}</TableHeaderCell>
              <TableHeaderCell>
                {t(tk("businessData.document.columns.readAndUnderstoodDate"))}
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
        <Text>{t(tk("businessData.document.sections.empty"))}</Text>
      </Empty>,
    );
  }

  if (left !== tk("businessData.document.sections.details")) {
    return shell(
      <Empty>
        <Text>{t(tk("businessData.document.sections.empty"))}</Text>
      </Empty>,
    );
  }

  return shell(
    <CardGrid>
      <Card title={t(tk("businessData.document.sections.document"))}>
        <KV
          rows={[
            [t(tk("businessData.document.details.name")), data.name],
            [t(tk("businessData.document.details.description")), data.description],
            [t(tk("businessData.document.details.type")), data.type],
            [t(tk("businessData.document.details.state")), data.state],
            [t(tk("businessData.document.details.dataGroup")), data.dataGroup],
          ]}
        />
      </Card>
      <Card title={t(tk("businessData.document.sections.content"))}>
        <KV
          rows={[
            [t(tk("businessData.document.details.source")), data.source],
            [t(tk("businessData.document.details.file")), data.file],
            [t(tk("businessData.document.details.changeDescription")), data.changeDescription],
          ]}
        />
      </Card>
      <Card title={t(tk("businessData.document.sections.information"))}>
        <KV
          rows={[
            [t(tk("businessData.document.details.folder")), data.folder],
            [t(tk("businessData.document.details.ownerRole")), data.ownerRole],
            [t(tk("businessData.document.details.group")), data.group],
            [t(tk("businessData.document.details.author")), data.author],
            [
              t(tk("businessData.document.details.creationDate")),
              formatDateTime(data.creationDate),
            ],
            [t(tk("businessData.document.details.link")), data.link],
            [t(tk("businessData.document.details.versionLink")), data.versionLink],
            [t(tk("businessData.document.details.keywords")), data.keywords],
          ]}
        />
      </Card>
      <Card title={t(tk("businessData.document.sections.readAndUnderstand"))}>
        <KV
          rows={[
            [
              t(tk("businessData.document.details.requireSignature")),
              booleanLabel(data.requireSignature),
            ],
            [t(tk("businessData.document.details.expirationDays")), data.expirationDays],
          ]}
        />
      </Card>
    </CardGrid>,
  );
}
