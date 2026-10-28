import { useState } from "react";
import {
  Body1Strong,
  Button,
  Caption1,
  ChevronDown20Regular,
  ChevronRight20Regular,
  ColumnTriple20Regular,
  Dismiss20Filled,
  Eye20Filled,
  MoreVertical20Regular,
  PlugConnected20Regular,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
} from "@/components/ui";
import { TOOL_GROUPS, TOTAL_TOOL_COUNT } from "../data";
import type { DetailStyles } from "../styles";

interface ToolsGridProps {
  detailStyles: DetailStyles;
}

export function ToolsGrid({ detailStyles }: ToolsGridProps) {
  const [closedGroupNames, setClosedGroupNames] = useState<Set<string>>(new Set());
  const toggleGroup = (groupName: string) =>
    setClosedGroupNames((previousClosed) => {
      const nextClosed = new Set(previousClosed);
      if (nextClosed.has(groupName)) {
        nextClosed.delete(groupName);
      } else {
        nextClosed.add(groupName);
      }
      return nextClosed;
    });
  return (
    <>
      <div className={detailStyles.titleRow}>
        <Text weight="semibold" size={400}>
          MCP Server Tools ({TOTAL_TOOL_COUNT})
        </Text>
        <div>
          <Button
            appearance="subtle"
            icon={<ColumnTriple20Regular />}
            aria-label="Choose columns"
          />
          <Button appearance="subtle" icon={<MoreVertical20Regular />} aria-label="More options" />
        </div>
      </div>
      <div className={detailStyles.tableScroll}>
        <Table
          aria-label="MCP server tools"
          style={{ tableLayout: "fixed", width: "100%", minWidth: 640 }}
        >
          <TableHeader>
            <TableRow>
              <TableHeaderCell className={detailStyles.tableHeaderCell} style={{ width: 30 }} />
              <TableHeaderCell className={detailStyles.tableHeaderCell} style={{ width: "40%" }}>
                TOOL
              </TableHeaderCell>
              <TableHeaderCell className={detailStyles.tableHeaderCell}>
                <div style={{ textAlign: "center" }}>DESCRIPTION</div>
              </TableHeaderCell>
              <TableHeaderCell className={detailStyles.tableHeaderCell}>
                <div style={{ textAlign: "center" }}>DEFERRED</div>
              </TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TOOL_GROUPS.map((g) => {
              const open = !closedGroupNames.has(g.name);
              return [
                <TableRow
                  key={g.name}
                  className={detailStyles.toolGroupRow}
                  onClick={() => toggleGroup(g.name)}
                  aria-expanded={open}
                >
                  <TableCell colSpan={4} style={{ gridColumn: "1 / -1" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        columnGap: 10,
                        color: "#1a6fc4",
                        fontSize: 13,
                      }}
                    >
                      {open ? <ChevronDown20Regular /> : <ChevronRight20Regular />}
                      <PlugConnected20Regular />
                      <span>
                        {g.name} <span style={{ color: "#444" }}>({g.tools.length} Tools)</span>
                      </span>
                    </span>
                  </TableCell>
                </TableRow>,
                ...(open
                  ? g.tools.map((t) => (
                      <TableRow key={g.name + t}>
                        <TableCell className={detailStyles.tableCell} />
                        <TableCell className={detailStyles.tableCell}>
                          <span
                            title={t}
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {t}
                          </span>
                        </TableCell>
                        <TableCell className={detailStyles.tableCell}>
                          <div style={{ display: "flex", justifyContent: "center" }}>
                            <Popover positioning="below" withArrow>
                              <PopoverTrigger disableButtonEnhancement>
                                <Button
                                  size="small"
                                  appearance="transparent"
                                  icon={<Eye20Filled />}
                                  aria-label={`View description of ${t}`}
                                />
                              </PopoverTrigger>
                              <PopoverSurface style={{ maxWidth: 320 }}>
                                <Body1Strong>{t}</Body1Strong>
                                <br />
                                <Caption1>
                                  Tool exposed by the {g.name} MCP server. Returns structured
                                  results for the requested entity.
                                </Caption1>
                              </PopoverSurface>
                            </Popover>
                          </div>
                        </TableCell>
                        <TableCell className={detailStyles.tableCell}>
                          <div style={{ display: "flex", justifyContent: "center" }}>
                            <Dismiss20Filled
                              style={{ color: "#8A8A8A" }}
                              aria-label="Not deferred"
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  : []),
              ];
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
