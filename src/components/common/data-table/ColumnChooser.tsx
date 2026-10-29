import type { ReactTable, RowData } from "@tanstack/react-table";
import type { DataTableFeatures } from "@/components/common/data-table/tableFeatures";
import { ArrowDown20Regular, ArrowUp20Regular, ColumnTriple20Regular } from "@/components/icons";
import {
  Button,
  Checkbox,
  Divider,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  Text,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

export interface DataTableMeta {
  labelKey?: TranslationKey;
  locked?: boolean;
  width?: string;
  centered?: boolean;
}

interface ColumnChooserProps<TRow extends RowData> {
  table: ReactTable<DataTableFeatures, TRow>;
}

export function ColumnChooser<TRow extends RowData>({ table }: ColumnChooserProps<TRow>) {
  const { t } = useAppTranslation();
  const stateOrder = table.state.columnOrder;
  const allIds = table.getAllLeafColumns().map((column) => column.id);
  const orderedIds = stateOrder.length > 0 ? stateOrder : allIds;
  const moveColumn = (id: string, direction: -1 | 1) => {
    const next = [...orderedIds];
    const index = next.indexOf(id);
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    table.setColumnOrder(next);
  };
  return (
    <Popover positioning="below-end" withArrow={false}>
      <PopoverTrigger disableButtonEnhancement>
        <Button
          appearance="subtle"
          icon={<ColumnTriple20Regular />}
          aria-label={t("common.chooseColumns")}
        />
      </PopoverTrigger>
      <PopoverSurface style={{ padding: 0, width: 260 }}>
        <div style={{ padding: "10px 14px" }}>
          <Text weight="semibold">{t("common.columns")}</Text>
        </div>
        <Divider />
        <div style={{ padding: "4px 8px" }}>
          {orderedIds.map((id, index) => {
            const column = table.getColumn(id);
            if (!column) return null;
            const meta = column.columnDef.meta as DataTableMeta | undefined;
            const locked = meta?.locked ?? false;
            return (
              <div
                key={id}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <Checkbox
                  label={meta?.labelKey ? t(meta.labelKey) : id}
                  checked={column.getIsVisible()}
                  disabled={locked}
                  onChange={(_, eventData) => column.toggleVisibility(!!eventData.checked)}
                />
                <span>
                  <Button
                    size="small"
                    appearance="subtle"
                    icon={<ArrowUp20Regular />}
                    aria-label={t("common.moveUp")}
                    disabled={index <= 1 || locked}
                    onClick={() => moveColumn(id, -1)}
                  />
                  <Button
                    size="small"
                    appearance="subtle"
                    icon={<ArrowDown20Regular />}
                    aria-label={t("common.moveDown")}
                    disabled={locked || index === orderedIds.length - 1}
                    onClick={() => moveColumn(id, 1)}
                  />
                </span>
              </div>
            );
          })}
        </div>
      </PopoverSurface>
    </Popover>
  );
}
