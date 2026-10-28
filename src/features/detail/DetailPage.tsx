import { useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { ActionBar } from "@/components/common/ActionBar";
import { PageHeader } from "@/components/common/PageHeader";
import { RibbonButton } from "@/components/common/RibbonButton";
import {
  ArrowSync20Regular,
  ArrowSync24Regular,
  Attach20Regular,
  Body1Strong,
  Bot20Regular,
  Button,
  Caption1,
  Edit24Regular,
  MoreVertical20Regular,
  MoreVertical24Regular,
  PanelLeftExpand20Regular,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TabList,
  Text,
  Textarea,
} from "@/components/ui";
import { useSharedStyles } from "@/styles/shared";
import { DetailsView } from "./components/DetailsView";
import { Fields } from "./components/Fields";
import { ToolsGrid } from "./components/ToolsGrid";
import { HISTORY_ENTRIES } from "./data";
import { useDetailStyles } from "./styles";

type TopTab = "details" | "references" | "history";

interface MiniBtnProps {
  icon: ReactElement;
  label: string;
}

function MiniBtn({ icon, label }: MiniBtnProps) {
  return (
    <Button appearance="subtle" icon={icon}>
      {label}
    </Button>
  );
}

interface DetailPageProps {
  title: string;
}

export function DetailPage({ title }: DetailPageProps) {
  const sharedStyles = useSharedStyles();
  const detailStyles = useDetailStyles();
  const [activeTab, setActiveTab] = useState<TopTab>("details");
  const [selectedPanel, setSelectedPanel] = useState("MCP Servers");
  const [isDetailsPanelVisible, setDetailsPanelVisible] = useState(true);
  const [actionBarCollapsed, setActionBarCollapsed] = useState(false);

  let rightContent: ReactNode;
  if (activeTab === "references") {
    rightContent = (
      <div className={detailStyles.emptyState}>
        <Body1Strong>No references</Body1Strong>
        <Caption1>This record is not referenced by other objects.</Caption1>
      </div>
    );
  } else if (activeTab === "history") {
    rightContent = (
      <>
        <div className={detailStyles.titleRow}>
          <Text weight="semibold" size={400}>
            History ({HISTORY_ENTRIES.length})
          </Text>
        </div>
        <div className={detailStyles.tableScroll}>
          <Table aria-label="History" style={{ tableLayout: "fixed", width: "100%" }}>
            <TableHeader>
              <TableRow>
                {["DATE", "USER", "ACTION", "DETAILS"].map((h) => (
                  <TableHeaderCell key={h} className={detailStyles.tableHeaderCell}>
                    {h}
                  </TableHeaderCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {HISTORY_ENTRIES.map((r) => (
                <TableRow key={r[0]}>
                  {r.map((c, i) => (
                    <TableCell key={i} className={detailStyles.tableCell}>
                      {c}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </>
    );
  } else if (selectedPanel === "MCP Servers") {
    rightContent = (
      <>
        <div className={detailStyles.detailToolbar}>
          <div className={detailStyles.detailToolbarGroup}>
            <div style={{ display: "flex" }}>
              <MiniBtn icon={<ArrowSync20Regular />} label="Refresh" />
            </div>
            <div className={detailStyles.detailToolbarLabel} />
          </div>
          <div className={detailStyles.detailToolbarGroup}>
            <div style={{ display: "flex" }}>
              <MiniBtn icon={<MoreVertical20Regular />} label="More" />
            </div>
            <div className={detailStyles.detailToolbarLabel}>Actions</div>
          </div>
        </div>
        <ToolsGrid detailStyles={detailStyles} />
      </>
    );
  } else if (selectedPanel === "Details") {
    rightContent = <Fields />;
  } else if (selectedPanel === "Instructions") {
    rightContent = (
      <div
        style={{
          padding: "14px 4px",
          display: "flex",
          flexDirection: "column",
          rowGap: 10,
          flexGrow: 1,
        }}
      >
        <Text weight="semibold" size={400}>
          Instructions
        </Text>
        <Textarea
          readOnly
          resize="none"
          style={{ flexGrow: 1, minHeight: 160 }}
          value={
            "You are the CM MES Agent.\nUse the CM MES tools to read documents, attachments and entity revisions.\nAlways cite the entity name and revision you used in your answer."
          }
        />
      </div>
    );
  } else {
    rightContent = (
      <div className={detailStyles.emptyState}>
        <Attach20Regular />
        <Body1Strong>No attachments</Body1Strong>
        <Caption1>Files added to this agent will appear here.</Caption1>
      </div>
    );
  }

  const shouldShowDetailsPanel = activeTab === "details";

  return (
    <>
      <div className={sharedStyles.headerBlock}>
        <div className={detailStyles.detailTabsRow}>
          <TabList
            size="small"
            selectedValue={activeTab}
            onTabSelect={(_, d) => setActiveTab(d.value as TopTab)}
          >
            <Tab value="details">Details</Tab>
            <Tab value="references">References</Tab>
            <Tab value="history">History</Tab>
          </TabList>
        </div>
        {!actionBarCollapsed && (
          <ActionBar style={{ paddingTop: 8 }}>
            <div className={sharedStyles.actionBarGroup}>
              <div className={sharedStyles.actionBarGroupButtons}>
                <RibbonButton
                  sharedStyles={sharedStyles}
                  icon={<ArrowSync24Regular />}
                  label="Refresh"
                />
                <RibbonButton sharedStyles={sharedStyles} icon={<Edit24Regular />} label="Edit" />
              </div>
              <div className={sharedStyles.actionBarGroupLabel}>General</div>
            </div>
            <div className={sharedStyles.actionBarGroup}>
              <div className={sharedStyles.actionBarGroupButtons}>
                <RibbonButton
                  sharedStyles={sharedStyles}
                  icon={<MoreVertical24Regular />}
                  label="More"
                />
              </div>
              <div className={sharedStyles.actionBarGroupLabel}>Actions</div>
            </div>
          </ActionBar>
        )}
        <PageHeader
          collapsed={actionBarCollapsed}
          onToggle={() => setActionBarCollapsed((v) => !v)}
        >
          <span style={{ display: "inline-flex", alignItems: "center", columnGap: 8 }}>
            <Bot20Regular />
            <Text size={300} weight="semibold">
              {title}
            </Text>
            <Text size={200}>(Active)</Text>
          </span>
        </PageHeader>
      </div>

      <div className={detailStyles.detailBody}>
        {shouldShowDetailsPanel && isDetailsPanelVisible && (
          <DetailsView
            detailStyles={detailStyles}
            selectedPanel={selectedPanel}
            onSelect={setSelectedPanel}
            onCollapse={() => setDetailsPanelVisible(false)}
          />
        )}
        <section
          className={detailStyles.detailContent}
          aria-label={activeTab === "details" ? selectedPanel : activeTab}
        >
          {shouldShowDetailsPanel && !isDetailsPanelVisible && (
            <div>
              <Button
                size="small"
                appearance="subtle"
                icon={<PanelLeftExpand20Regular />}
                onClick={() => setDetailsPanelVisible(true)}
              >
                Details View
              </Button>
            </div>
          )}
          {rightContent}
        </section>
      </div>
    </>
  );
}
