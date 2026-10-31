import { useState } from "react";
import { useMapDetail } from "@/api";
import { Card, CardGrid, DetailShell, Empty, KV } from "@/components/common";
import type { DetailTab } from "@/components/common";
import { Grid24Regular } from "@/components/icons";
import {
  Button,
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
import { MODE_CLONE, MODE_EDIT, TERMINATE, UNTERMINATE } from "../components/wizardMode";
import { MapDialog } from "./dialogs/MapDialog";
import { MapLinkDialog, MapUnlinkDialog } from "./dialogs/MapLinkDialog";
import { MapTerminateDialog } from "./dialogs/MapTerminateDialog";

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "detailShell.tabs.details" },
  { value: "content", labelKey: "businessData.map.tabs.content" },
  { value: "references", labelKey: "detailShell.tabs.references" },
  { value: "history", labelKey: "detailShell.tabs.history" },
];

const LEFT_ITEMS: TranslationKey[] = [
  "businessData.map.sections.details",
  "businessData.map.sections.layers",
  "businessData.map.sections.attachments",
];

export function MapDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<string>("businessData.map.sections.details");
  const [editOpen, setEditOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [unterminateOpen, setUnterminateOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [unlinkOpen, setUnlinkOpen] = useState(false);
  const { data, isLoading } = useMapDetail(name);

  const shell = (content: React.ReactNode) => (
    <>
      <DetailShell
        title={name}
        icon={<Grid24Regular />}
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
      <MapDialog
        open={editOpen}
        mode={MODE_EDIT}
        initialName={name}
        onClose={() => setEditOpen(false)}
      />
      <MapDialog
        open={cloneOpen}
        mode={MODE_CLONE}
        initialName={`${name} (Copy)`}
        onClose={() => setCloneOpen(false)}
      />
      {terminateOpen && (
        <MapTerminateDialog name={name} mode={TERMINATE} onClose={() => setTerminateOpen(false)} />
      )}
      {unterminateOpen && (
        <MapTerminateDialog
          name={name}
          mode={UNTERMINATE}
          onClose={() => setUnterminateOpen(false)}
        />
      )}
      <MapLinkDialog open={linkOpen} mapName={name} onClose={() => setLinkOpen(false)} />
      <MapUnlinkDialog open={unlinkOpen} mapName={name} onClose={() => setUnlinkOpen(false)} />
    </>
  );

  if (isLoading || !data) {
    return shell(
      <Empty>
        <Text>{t("businessData.map.sections.emptyBody")}</Text>
      </Empty>,
    );
  }

  if (top === "details" && left === "businessData.map.sections.layers") {
    return shell(
      <Card title={t("businessData.map.sections.layers")}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>{t("businessData.map.layers.name")}</TableHeaderCell>
              <TableHeaderCell>{t("businessData.map.layers.type")}</TableHeaderCell>
              <TableHeaderCell>{t("businessData.map.layers.units")}</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(data.layers ?? []).map((layer) => (
              <TableRow key={layer.name}>
                <TableCell>{layer.name}</TableCell>
                <TableCell>{layer.type}</TableCell>
                <TableCell>{layer.units}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
          <Button onClick={() => undefined}>{t("businessData.map.actions.downloadLayer")}</Button>
          <Button onClick={() => setLinkOpen(true)}>
            {t("businessData.map.actions.linkMaterial")}
          </Button>
          <Button onClick={() => setUnlinkOpen(true)}>
            {t("businessData.map.actions.unlinkMaterial")}
          </Button>
        </div>
      </Card>,
    );
  }

  if (top !== "details" || left !== "businessData.map.sections.details") {
    return shell(
      <Empty>
        <Text>{t("businessData.map.sections.empty")}</Text>
      </Empty>,
    );
  }

  return shell(
    <CardGrid>
      <Card title={t("businessData.map.sections.map")}>
        <KV
          rows={[
            [t("businessData.map.details.name"), data.name],
            [t("businessData.map.details.description"), data.description],
            [t("businessData.map.details.state"), data.state],
          ]}
        />
      </Card>
      <Card title={t("businessData.map.sections.mapDefinition")}>
        <KV rows={[[t("businessData.map.details.mapDefinition"), data.mapDefinition]]} />
      </Card>
      <Card title={t("businessData.map.sections.context")}>
        <KV
          rows={[
            [t("businessData.map.details.step"), data.step],
            [t("businessData.map.details.resource"), data.resource],
            [t("businessData.map.details.material"), data.material],
          ]}
        />
      </Card>
    </CardGrid>,
  );
}
