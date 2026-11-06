import type { FabMaterial } from "@/api";
import type { DataColumn } from "@/components/common";
import { Text } from "@/components/ui";
import { theme } from "@/styles/theme";

export const MATERIAL_COLUMNS: DataColumn<FabMaterial>[] = [
  {
    field: "name",
    headerName: "manufacturing.fabExplorer.stepView.columns.material",
    cellRenderer: (r) => (
      <Text size={300}>
        {r.name}
        {r.subMaterialCount > 0 && (
          <span
            style={{ color: theme.color.textBrand, fontWeight: 600, marginLeft: theme.spacing.sm }}
          >
            ({r.subMaterialCount})
          </span>
        )}
      </Text>
    ),
  },
  {
    field: "qty",
    headerName: "manufacturing.fabExplorer.stepView.columns.qty",
    type: "number",
  },
  {
    field: "units",
    headerName: "manufacturing.fabExplorer.stepView.columns.units",
  },
  {
    field: "product",
    headerName: "manufacturing.fabExplorer.stepView.columns.product",
  },
  {
    field: "flow",
    headerName: "manufacturing.fabExplorer.stepView.columns.flow",
  },
  {
    field: "step",
    headerName: "manufacturing.fabExplorer.stepView.columns.step",
  },
  {
    field: "priority",
    headerName: "manufacturing.fabExplorer.stepView.columns.priority",
    type: "number",
  },
  {
    field: "state",
    headerName: "manufacturing.fabExplorer.stepView.columns.state",
  },
  {
    field: "inOffFlow",
    headerName: "manufacturing.fabExplorer.stepView.columns.inOffFlow",
    type: "boolean",
  },
];
