import { Tab as FluentTab, TabList as FluentTabList } from "@fluentui/react-components";
import { forwardRef } from "react";
import type { ComponentRef, CSSProperties, ReactNode } from "react";
import { SIZE_MAP } from "./types";
import type { ComponentSize } from "./types";

export type TabSize = ComponentSize;

export interface TabProps {
  value: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export const Tab = forwardRef<ComponentRef<typeof FluentTab>, TabProps>(function Tab(props, ref) {
  return <FluentTab ref={ref} {...props} />;
});

export interface TabListProps {
  selectedValue?: string;
  onTabSelect?: (value: string) => void;
  size?: TabSize;
  vertical?: boolean;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
  children?: ReactNode;
}

export const TabList = forwardRef<ComponentRef<typeof FluentTabList>, TabListProps>(
  function TabList({ onTabSelect, size, ...rest }, ref) {
    return (
      <FluentTabList
        ref={ref}
        size={size ? SIZE_MAP[size] : undefined}
        onTabSelect={onTabSelect ? (_, data) => onTabSelect(String(data.value)) : undefined}
        {...rest}
      />
    );
  },
);
