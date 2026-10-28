import { Body1Strong, Button, mergeClasses, PanelLeftContract20Regular } from "@/components/ui";
import { DETAILS_PANEL_ITEMS } from "../data";
import type { DetailStyles } from "../styles";

interface DetailsViewProps {
  detailStyles: DetailStyles;
  selectedPanel: string;
  onSelect: (panelName: string) => void;
  onCollapse: () => void;
}

export function DetailsView({
  detailStyles,
  selectedPanel,
  onSelect,
  onCollapse,
}: DetailsViewProps) {
  return (
    <aside className={detailStyles.detailsPanel} aria-label="Details View">
      <div className={detailStyles.detailsPanelHeader}>
        <Body1Strong>Details View</Body1Strong>
        <Button
          size="small"
          appearance="subtle"
          icon={<PanelLeftContract20Regular />}
          aria-label="Collapse panel"
          onClick={onCollapse}
        />
      </div>
      {DETAILS_PANEL_ITEMS.map((panelName) => (
        <button
          key={panelName}
          className={mergeClasses(
            detailStyles.detailsPanelItem,
            selectedPanel === panelName && detailStyles.detailsPanelActive,
          )}
          aria-current={selectedPanel === panelName ? "page" : undefined}
          onClick={() => onSelect(panelName)}
        >
          {panelName}
        </button>
      ))}
    </aside>
  );
}
