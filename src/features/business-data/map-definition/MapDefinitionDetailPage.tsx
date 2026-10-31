import { useState } from "react";
import { useMapDefinitionDetail } from "@/api";
import { Card, CardGrid, DetailShell, Empty, KV } from "@/components/common";
import type { DetailTab } from "@/components/common";
import { Grid24Regular } from "@/components/icons";
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
import { useBooleanLabel } from "../components/propertyLabels";
import { MODE_CLONE, MODE_EDIT } from "../components/wizardMode";
import { MapDefinitionWizardDialog } from "./MapDefinitionDialogs";

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "detailShell.tabs.details" },
  { value: "references", labelKey: "detailShell.tabs.references" },
  { value: "history", labelKey: "detailShell.tabs.history" },
];

const LEFT_ITEMS: TranslationKey[] = [
  "businessData.mapDefinition.sections.details",
  "businessData.mapDefinition.sections.layers",
  "businessData.mapDefinition.sections.regions",
  "businessData.mapDefinition.sections.attachments",
];

export function MapDefinitionDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<string>("businessData.mapDefinition.sections.details");
  const [editOpen, setEditOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const { data, isLoading } = useMapDefinitionDetail(name);
  const booleanLabel = useBooleanLabel();

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
      onEdit={() => setEditOpen(true)}
      onAskAi={() => undefined}
    >
      {content}
    </DetailShell>
  );

  if (isLoading || !data) {
    return shell(
      <Empty>
        <Text>{t("businessData.mapDefinition.sections.emptyBody")}</Text>
      </Empty>,
    );
  }

  if (left === "businessData.mapDefinition.sections.layers" && top === "details") {
    return shell(
      <>
        <Card title={t("businessData.mapDefinition.sections.layers")}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>
                  {t("businessData.mapDefinition.wizard.layerName")}
                </TableHeaderCell>
                <TableHeaderCell>
                  {t("businessData.mapDefinition.wizard.layerType")}
                </TableHeaderCell>
                <TableHeaderCell>{t("businessData.mapDefinition.wizard.dataType")}</TableHeaderCell>
                <TableHeaderCell>
                  {t("businessData.mapDefinition.wizard.isDefault")}
                </TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.layers.map((layer) => (
                <TableRow key={layer.name}>
                  <TableCell>{layer.name}</TableCell>
                  <TableCell>{layer.layerType}</TableCell>
                  <TableCell>{layer.dataType}</TableCell>
                  <TableCell>{booleanLabel(layer.isDefault)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
        <MapDefinitionWizardDialog
          open={editOpen}
          mode={MODE_EDIT}
          initialName={data.name}
          initialDescription={data.description}
          initialType={data.type}
          initialLayers={data.layers}
          onClose={() => setEditOpen(false)}
        />
      </>,
    );
  }

  if (top !== "details" || left !== "businessData.mapDefinition.sections.details") {
    return shell(
      <Empty>
        <Text>{t("businessData.mapDefinition.sections.empty")}</Text>
      </Empty>,
    );
  }

  return shell(
    <>
      <CardGrid>
        <Card title={t("businessData.mapDefinition.sections.mapDefinition")}>
          <KV
            rows={[
              [t("businessData.mapDefinition.details.name"), data.name],
              [t("businessData.mapDefinition.details.description"), data.description],
              [t("businessData.mapDefinition.details.type"), data.type],
              [t("businessData.mapDefinition.details.state"), data.state],
            ]}
          />
        </Card>
        <Card title={t("businessData.mapDefinition.sections.options")}>
          <KV
            rows={[
              [t("businessData.mapDefinition.details.rulerMode"), data.rulerMode],
              [
                t("businessData.mapDefinition.details.showRulerByDefault"),
                booleanLabel(data.showRulerByDefault),
              ],
              [t("businessData.mapDefinition.details.notch"), data.notch],
              [t("businessData.mapDefinition.details.defaultRotation"), data.defaultRotation],
              [t("businessData.mapDefinition.details.materialUnits"), data.materialUnits],
            ]}
          />
        </Card>
        <Card title={t("businessData.mapDefinition.sections.information")}>
          <KV
            rows={[
              [t("businessData.mapDefinition.details.layoutType"), data.layoutType],
              [t("businessData.mapDefinition.details.height"), String(data.height)],
              [t("businessData.mapDefinition.details.width"), String(data.width)],
              [t("businessData.mapDefinition.details.dimensionUnits"), data.dimensionUnits],
              [t("businessData.mapDefinition.details.rows"), String(data.rows)],
              [t("businessData.mapDefinition.details.columns"), String(data.columns)],
              [t("businessData.mapDefinition.details.maskFile"), data.maskFile],
              [t("businessData.mapDefinition.details.backgroundFile"), data.backgroundFile],
            ]}
          />
        </Card>
        <Card title={t("businessData.mapDefinition.sections.colors")}>
          <KV
            rows={[
              [t("businessData.mapDefinition.details.emptyUnitsColor"), data.emptyUnitsColor],
              [t("businessData.mapDefinition.details.gridLinesColor"), data.gridLinesColor],
              [
                t("businessData.mapDefinition.details.showGridLinesByDefault"),
                booleanLabel(data.showGridLinesByDefault),
              ],
            ]}
          />
        </Card>
      </CardGrid>
      <MapDefinitionWizardDialog
        open={editOpen}
        mode={MODE_EDIT}
        initialName={data.name}
        initialDescription={data.description}
        initialType={data.type}
        initialLayers={data.layers}
        onClose={() => setEditOpen(false)}
      />
      <MapDefinitionWizardDialog
        open={cloneOpen}
        mode={MODE_CLONE}
        initialName={`${data.name} (Copy)`}
        initialDescription={data.description}
        initialType={data.type}
        initialLayers={data.layers}
        onClose={() => setCloneOpen(false)}
      />
    </>,
  );
}
