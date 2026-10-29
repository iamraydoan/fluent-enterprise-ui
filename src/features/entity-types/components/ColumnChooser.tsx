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
import { ENTITY_COLUMN_BY_KEY } from "../data";
import type { VisibleColumn } from "../types";

interface ColumnChooserProps {
  columns: VisibleColumn[];
  setColumns: Dispatch<SetStateAction<VisibleColumn[]>>;
}

export function ColumnChooser({ columns, setColumns }: ColumnChooserProps) {
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
        <Button appearance="subtle" icon={<ColumnTriple20Regular />} aria-label="Choose columns" />
      </PopoverTrigger>
      <PopoverSurface style={{ padding: 0, width: 260 }}>
        <div style={{ padding: "10px 14px" }}>
          <Text weight="semibold">Columns</Text>
        </div>
        <Divider />
        <div style={{ padding: "4px 8px" }}>
          {columns.map((column, index) => {
            const columnDefinition = ENTITY_COLUMN_BY_KEY[column.key];
            return (
              <div
                key={column.key}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <Checkbox
                  label={
                    columnDefinition.label.charAt(0) + columnDefinition.label.slice(1).toLowerCase()
                  }
                  checked={column.visible}
                  disabled={columnDefinition.locked}
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
                    aria-label="Move up"
                    disabled={index <= 1}
                    onClick={() => moveColumn(index, -1)}
                  />
                  <Button
                    size="small"
                    appearance="subtle"
                    icon={<ArrowDown20Regular />}
                    aria-label="Move down"
                    disabled={columnDefinition.locked || index === columns.length - 1}
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
