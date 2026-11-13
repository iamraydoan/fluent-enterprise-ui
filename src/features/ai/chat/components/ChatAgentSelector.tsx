import type { AiAgentRecord } from "@/api";
import { MenuTriggerButton } from "@/components/common";
import { Bot20Regular, ChevronDown16Regular } from "@/components/icons";
import { Menu, MenuItemRadio, MenuList, MenuPopover, MenuTrigger } from "@/components/ui";
import { theme } from "@/styles/theme";

interface ChatAgentSelectorProps {
  agents: AiAgentRecord[];
  value: string;
  onChange: (checkedItems: string[]) => void;
}

export function ChatAgentSelector({ agents, value, onChange }: ChatAgentSelectorProps) {
  return (
    <Menu checkedValues={{ agent: [value] }} onCheckedValueChange={onChange}>
      <MenuTrigger disableButtonEnhancement>
        <MenuTriggerButton>
          <Bot20Regular />
          {value}
          <ChevronDown16Regular style={{ color: theme.color.textBrand }} />
        </MenuTriggerButton>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          {agents.map((candidate) => (
            <MenuItemRadio key={candidate.name} name="agent" value={candidate.name}>
              {candidate.name}
            </MenuItemRadio>
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
}
