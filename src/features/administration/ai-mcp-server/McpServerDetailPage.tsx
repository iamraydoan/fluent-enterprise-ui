import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMcpServer } from "@/api";
import {
  Card,
  CardGrid,
  DetailShell,
  DetailTile,
  Empty,
  HStack,
  KV,
  MenuTriggerButton,
  MiniBar,
  Panel,
} from "@/components/common";
import type { DetailTab, MiniBarGroup } from "@/components/common";
import {
  ArrowSync20Regular,
  Attach20Regular,
  Attach24Regular,
  Checkmark16Filled,
  ChevronLeft20Regular,
  ChevronRight20Regular,
  ColumnTriple20Regular,
  Info20Regular,
  MoreVertical20Regular,
} from "@/components/icons";
import {
  Body1Strong,
  Button,
  Caption1,
  makeStyles,
  Menu,
  MenuItemRadio,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
} from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import { useTabsStore } from "@/stores/tabs-store";
import { theme } from "@/styles/theme";
import { MCP_SERVER_SECTIONS } from "./data";

const useMcpDetailStyles = makeStyles({
  link: { color: theme.color.textBrand, wordBreak: "break-all" },
  titleRow: {
    padding: "10px 0 8px",
  },
  scroll: {
    overflow: "auto",
    border: `1px solid ${theme.color.borderSubtle}`,
    borderBottom: "none",
  },
  th: {
    backgroundColor: theme.color.surfaceTertiary,
    height: "36px",
    fontSize: "12px",
    fontWeight: 400,
    borderRight: `1px solid ${theme.color.borderSubtle}`,
    textTransform: "uppercase",
  },
  td: { height: "34.5px", fontSize: "13px" },
  foot: {
    padding: "8px 4px 12px",
    fontSize: "13px",
    borderTop: `1px solid ${theme.color.borderSubtle}`,
  },
});

const TOP_TABS: DetailTab[] = [
  { value: "details", labelKey: "detailShell.tabs.details" },
  { value: "references", labelKey: "detailShell.tabs.references" },
];

interface McpServerDetailPageProps {
  name: string;
}

export function McpServerDetailPage({ name }: McpServerDetailPageProps) {
  const mcpDetailStyles = useMcpDetailStyles();
  const { t } = useAppTranslation();
  const openRoute = useTabsStore((state) => state.openRoute);
  const navigate = useNavigate();
  const { data: detail, isLoading } = useMcpServer(name);
  const [top, setTop] = useState("details");
  const [left, setLeft] = useState("mcpServer.sections.details");
  const [pageSize, setPageSize] = useState(100);
  const [lastSyncOverride, setLastSyncOverride] = useState<string | null>(null);
  const synchronize = () => {
    const now = new Date();
    const pad = (value: number) => String(value).padStart(2, "0");
    const hour = now.getHours() % 12 || 12;
    setLastSyncOverride(
      `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(hour)}:${pad(now.getMinutes())} ${now.getHours() >= 12 ? "PM" : "AM"}`,
    );
  };
  if (isLoading || detail === undefined) {
    return null;
  }
  const lastSync = lastSyncOverride ?? detail.lastSync;
  const askAi = () => {
    openRoute("/ai");
    navigate({ to: "/ai" });
  };
  const toolsBarGroups: MiniBarGroup[] = [
    {
      buttons: [
        { icon: <ArrowSync20Regular />, label: t("mcpServer.synchronize"), onClick: synchronize },
      ],
    },
  ];
  const detailLink = (label: string) => (
    <a className={mcpDetailStyles.link} href="#" onClick={(event) => event.preventDefault()}>
      {label}
    </a>
  );

  let content;
  if (top === "references") {
    content = (
      <Panel>
        <Empty>
          <Body1Strong>{t("mcpServer.noReferences")}</Body1Strong>
          <Caption1>{t("mcpServer.noReferencesBody")}</Caption1>
        </Empty>
      </Panel>
    );
  } else if (left === "mcpServer.sections.details") {
    content = (
      <CardGrid>
        <Card title={t("mcpServer.cards.server")}>
          <HStack gap={18} align="flex-start">
            <DetailTile icon={<Attach24Regular />} />
            <div style={{ flexGrow: 1, minWidth: 0 }}>
              <KV
                rows={[
                  [t("mcpServer.fields.name"), name],
                  [t("mcpServer.fields.description"), detail.description],
                  [t("mcpServer.fields.universalState"), t("common.active")],
                  [t("mcpServer.fields.dataGroup"), ""],
                ]}
              />
            </div>
            <Info20Regular
              style={{ color: theme.color.textBrand, margin: "6px 4px" }}
              aria-label={t("common.information")}
            />
          </HStack>
        </Card>
        <Card title={t("mcpServer.cards.information")}>
          <KV
            rows={[
              [t("mcpServer.fields.initTimeout"), String(detail.init)],
              [t("mcpServer.fields.instructions"), ""],
              [t("mcpServer.fields.reqTimeout"), String(detail.req)],
              [t("mcpServer.fields.url"), detailLink(detail.url)],
              [
                t("mcpServer.fields.syncStatus"),
                t(detail.sync === "Completed" ? "common.syncCompleted" : "common.syncPending"),
              ],
              [t("mcpServer.fields.protocolVersion"), detail.protocol],
              [
                t("mcpServer.fields.isSystem"),
                detail.isSystem ? (
                  <span style={{ display: "inline-flex", alignItems: "center", columnGap: 6 }}>
                    <Checkmark16Filled />
                    {t("common.yes")}
                  </span>
                ) : (
                  t("common.no")
                ),
              ],
            ]}
          />
        </Card>
        <Card title={t("mcpServer.cards.authentication")}>
          <KV
            rows={[
              [t("mcpServer.fields.authMode"), detail.auth.mode],
              [t("mcpServer.fields.clientId"), detail.auth.clientId],
              [t("mcpServer.fields.authUrl"), detailLink(detail.auth.authUrl)],
              [t("mcpServer.fields.tokenUrl"), detailLink(detail.auth.tokenUrl)],
              [t("mcpServer.fields.scope"), detail.auth.scope],
            ]}
          />
        </Card>
      </CardGrid>
    );
  } else if (left === "mcpServer.sections.tools") {
    content = (
      <Panel>
        <MiniBar groups={toolsBarGroups} />
        <div style={{ padding: "12px 12px 0", fontSize: 13, color: theme.color.textSecondary }}>
          {t("mcpServer.lastSync")}{" "}
          <span style={{ color: theme.color.textPrimary, marginLeft: 6 }}>{lastSync}</span>
        </div>
        <HStack align="center" justify="between" gap="none" className={mcpDetailStyles.titleRow}>
          <Text size={400}>{t("mcpServer.toolsTitle", { count: detail.tools.length })}</Text>
          <div>
            <Button
              variant="subtle"
              icon={<ColumnTriple20Regular />}
              aria-label={t("common.chooseColumns")}
            />
            <Button
              variant="subtle"
              icon={<MoreVertical20Regular />}
              aria-label={t("common.moreOptions")}
            />
          </div>
        </HStack>
        <div className={mcpDetailStyles.scroll}>
          <Table
            aria-label={t("mcpServer.sections.tools")}
            style={{ tableLayout: "fixed", width: "100%", minWidth: 560 }}
          >
            <TableHeader>
              <TableRow>
                <TableHeaderCell className={mcpDetailStyles.th} style={{ width: "30%" }}>
                  {t("mcpServer.toolsColumns.name")}
                </TableHeaderCell>
                <TableHeaderCell className={mcpDetailStyles.th}>
                  {t("mcpServer.toolsColumns.description")}
                </TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detail.tools.slice(0, pageSize).map(([toolName, toolDescription]) => (
                <TableRow key={toolName}>
                  <TableCell className={mcpDetailStyles.td}>{toolName}</TableCell>
                  <TableCell className={mcpDetailStyles.td}>
                    <span title={toolDescription}>{toolDescription}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <HStack align="center" justify="end" gap="28px" className={mcpDetailStyles.foot}>
          <span style={{ display: "inline-flex", alignItems: "center", columnGap: 6 }}>
            {t("common.rowsPerPage")}
            <Menu
              checkedValues={{ size: [String(pageSize)] }}
              onCheckedValueChange={(checkedItems) => setPageSize(Number(checkedItems[0]))}
            >
              <MenuTrigger disableButtonEnhancement>
                <MenuTriggerButton ariaLabel={t("common.rowsPerPage")}>
                  {pageSize}
                  <span style={{ fontSize: 8, color: theme.color.textBrand }}>▼</span>
                </MenuTriggerButton>
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  {[10, 25, 50, 100].map((size) => (
                    <MenuItemRadio key={size} name="size" value={String(size)}>
                      {size}
                    </MenuItemRadio>
                  ))}
                </MenuList>
              </MenuPopover>
            </Menu>
          </span>
          <div style={{ lineHeight: "17px" }}>
            {t("common.pageOf", { page: 1, pages: 1 })}
            <br />
            {t("common.records", { count: detail.tools.length })}
          </div>
          <div>
            <Button
              variant="subtle"
              icon={<ChevronLeft20Regular />}
              disabled
              aria-label={t("common.previousPage")}
            />
            <Button
              variant="subtle"
              icon={<ChevronRight20Regular />}
              disabled
              aria-label={t("common.nextPage")}
            />
          </div>
        </HStack>
      </Panel>
    );
  } else {
    content = (
      <Panel>
        <Empty>
          <Attach20Regular />
          <Body1Strong>{t("mcpServer.noAttachments")}</Body1Strong>
          <Caption1>{t("mcpServer.noAttachmentsBody")}</Caption1>
        </Empty>
      </Panel>
    );
  }

  return (
    <DetailShell
      title={name}
      icon={<Attach20Regular />}
      topTabs={TOP_TABS}
      top={top}
      onTop={setTop}
      leftItems={MCP_SERVER_SECTIONS}
      left={left}
      onLeft={setLeft}
      onEdit={() => {}}
      onAskAi={askAi}
    >
      {content}
    </DetailShell>
  );
}
