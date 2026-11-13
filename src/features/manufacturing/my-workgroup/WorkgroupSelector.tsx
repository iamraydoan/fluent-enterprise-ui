import { MenuTriggerButton } from "@/components/common";
import { ChevronDown16Regular } from "@/components/icons";
import { Menu, MenuItemRadio, MenuList, MenuPopover, MenuTrigger } from "@/components/ui";

interface WorkgroupSelectorProps {
  workgroup: string;
  workgroups: { name: string }[];
  label: string;
  onSelect: (value: string) => void;
}

export function WorkgroupSelector({
  workgroup,
  workgroups,
  label,
  onSelect,
}: WorkgroupSelectorProps) {
  return (
    <Menu
      checkedValues={{ workgroup: [workgroup] }}
      onCheckedValueChange={(checkedItems) => {
        const next = checkedItems[0];
        if (next !== undefined) onSelect(next);
      }}
    >
      <MenuTrigger disableButtonEnhancement>
        <MenuTriggerButton size="md" ariaLabel={label}>
          {workgroup}
          <ChevronDown16Regular />
        </MenuTriggerButton>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          {workgroups.map((wg) => (
            <MenuItemRadio key={wg.name} name="workgroup" value={wg.name}>
              {wg.name}
            </MenuItemRadio>
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
}
