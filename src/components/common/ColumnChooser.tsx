import type { Dispatch, SetStateAction } from "react";
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

export interface ChooserColumnDefinition {
  labelKey: TranslationKey;
  locked?: boolean;
}

export interface ColumnVisibility<TKey extends string> {
  key: TKey;
  visible: boolean;
}

interface ColumnChooserProps<TKey extends string> {
  columns: ColumnVisibility<TKey>[];
  definitions: Record<TKey, ChooserColumnDefinition>;
  setColumns: Dispatch<SetStateAction<ColumnVisibility<TKey>[]>>;
}

export function ColumnChooser<TKey extends string>({
  columns,
  definitions,
  setColumns,
}: ColumnChooserProps<TKey>) {
  const { t } = useAppTranslation();
  const moveColumn = (index: number, direction: number) =>
    setColumns((previousColumns) => {
      const nextColumns = [...previousColumns];
      [nextColumns[index], nextColumns[index + direction]] = [
        nextColumns[index + direction],
        nextColumns[index],
      ];
      return nextColumns;
    });
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
          {columns.map((column, index) => {
            const definition = definitions[column.key];
            return (
              <div
                key={column.key}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <Checkbox
                  label={t(definition.labelKey)}
                  checked={column.visible}
                  disabled={definition.locked}
                  onChange={(_, eventData) =>
                    setColumns((previousColumns) =>
                      previousColumns.map((columnState, columnIndex) =>
                        columnIndex === index
                          ? { ...columnState, visible: !!eventData.checked }
                          : columnState,
                      ),
                    )
                  }
                />
                <span>
                  <Button
                    size="small"
                    appearance="subtle"
                    icon={<ArrowUp20Regular />}
                    aria-label={t("common.moveUp")}
                    disabled={index <= 1}
                    onClick={() => moveColumn(index, -1)}
                  />
                  <Button
                    size="small"
                    appearance="subtle"
                    icon={<ArrowDown20Regular />}
                    aria-label={t("common.moveDown")}
                    disabled={definition.locked || index === columns.length - 1}
                    onClick={() => moveColumn(index, 1)}
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
