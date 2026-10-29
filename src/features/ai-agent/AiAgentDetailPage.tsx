import { useState } from "react";
import { ActionBar, PageHeader, RibbonButton } from "@/components/common";
import {
  ArrowSync24Regular,
  Bot20Regular,
  Edit24Regular,
  Info20Regular,
  MoreVertical24Regular,
  PanelLeftContract20Regular,
  PanelLeftExpand20Regular,
  Sparkle20Filled,
} from "@/components/icons";
import { Body1Strong, Button, Caption1, mergeClasses, Tab, TabList, Text } from "@/components/ui";
import { useSharedStyles } from "@/styles/shared";
import { AI_AGENT_SECTIONS, aiAgentDetailFor } from "./data";
import { useDetailStyles } from "./styles";

type TopTab = "details" | "references";

interface AiAgentDetailPageProps {
  name: string;
}

function FieldRow({ label, value }: { label: string; value: string }) {
  const detailStyles = useDetailStyles();
  return (
    <div className={detailStyles.fieldRow}>
      <span className={detailStyles.fieldLabel}>{label}</span>
      <span className={detailStyles.fieldValue}>{value}</span>
    </div>
  );
}

export function AiAgentDetailPage({ name }: AiAgentDetailPageProps) {
  const sharedStyles = useSharedStyles();
  const detailStyles = useDetailStyles();
  const detail = aiAgentDetailFor(name);
  const [activeTab, setActiveTab] = useState<TopTab>("details");
  const [selectedSection, setSelectedSection] = useState("Details");
  const [isPanelVisible, setPanelVisible] = useState(true);
  const [actionBarCollapsed, setActionBarCollapsed] = useState(false);

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
                  icon={<Sparkle20Filled />}
                  label="Ask AI"
                />
              </div>
              <div className={sharedStyles.actionBarGroupLabel}>MES Copilot</div>
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
              {detail.name}
            </Text>
            <Text size={200}>({detail.state})</Text>
          </span>
        </PageHeader>
      </div>

      <div className={detailStyles.detailBody}>
        {activeTab === "details" && isPanelVisible && (
          <aside className={detailStyles.detailsPanel} aria-label="Details View">
            <div className={detailStyles.detailsPanelHeader}>
              <Body1Strong>Details View</Body1Strong>
              <Button
                size="small"
                appearance="subtle"
                icon={<PanelLeftContract20Regular />}
                aria-label="Collapse panel"
                onClick={() => setPanelVisible(false)}
              />
            </div>
            {AI_AGENT_SECTIONS.map((section) => (
              <button
                key={section}
                className={mergeClasses(
                  detailStyles.detailsPanelItem,
                  selectedSection === section && detailStyles.detailsPanelActive,
                )}
                aria-current={selectedSection === section ? "page" : undefined}
                onClick={() => setSelectedSection(section)}
              >
                {section}
              </button>
            ))}
          </aside>
        )}
        <section
          className={detailStyles.detailContent}
          aria-label={activeTab === "details" ? selectedSection : activeTab}
        >
          {activeTab === "details" && !isPanelVisible && (
            <div>
              <Button
                size="small"
                appearance="subtle"
                icon={<PanelLeftExpand20Regular />}
                onClick={() => setPanelVisible(true)}
              >
                Details View
              </Button>
            </div>
          )}
          {activeTab === "references" && (
            <div className={detailStyles.emptyState}>
              <Body1Strong>No references</Body1Strong>
              <Caption1>This record is not referenced by other objects.</Caption1>
            </div>
          )}
          {activeTab === "details" && selectedSection !== "Details" && (
            <div className={detailStyles.emptyState}>
              <Body1Strong>This section is not yet implemented</Body1Strong>
            </div>
          )}
          {activeTab === "details" && selectedSection === "Details" && (
            <div className={detailStyles.detailCards}>
              <section className={detailStyles.fieldCard} aria-label="AI Agent">
                <div className={detailStyles.fieldCardHeader}>
                  <div className={detailStyles.fieldCardIconRow}>
                    <span className={detailStyles.fieldCardIconBox}>
                      <Bot20Regular />
                    </span>
                    <Text weight="semibold" size={400}>
                      AI Agent
                    </Text>
                  </div>
                  <Button appearance="subtle" icon={<Info20Regular />} aria-label="Information" />
                </div>
                <FieldRow label="Name:" value={detail.name} />
                <FieldRow label="Description:" value={detail.description} />
                <FieldRow label="Universal State:" value={detail.state} />
                <FieldRow label="Data Group:" value={detail.dataGroup} />
              </section>
              <section className={detailStyles.fieldCard} aria-label="Information">
                <div className={detailStyles.fieldCardHeader}>
                  <Text weight="semibold" size={400}>
                    Information
                  </Text>
                </div>
                <FieldRow label="Provider:" value={detail.provider} />
                <FieldRow label="Model:" value={detail.model} />
                <FieldRow label="Runtime:" value={detail.runtime} />
                <FieldRow label="Publish To Runtime:" value={detail.publishToRuntime} />
                <FieldRow label="Synchronization Status:" value={detail.synchronizationStatus} />
              </section>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
