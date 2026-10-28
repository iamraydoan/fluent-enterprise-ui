import { Tab as FluentTab, TabList as FluentTabList } from "@fluentui/react-components";
import { forwardRef } from "react";
import type { ComponentProps, ComponentRef } from "react";

export type TabProps = ComponentProps<typeof FluentTab>;

export const Tab = forwardRef<ComponentRef<typeof FluentTab>, TabProps>(function Tab(props, ref) {
  return <FluentTab ref={ref} {...props} />;
});

export type TabListProps = ComponentProps<typeof FluentTabList>;

export const TabList = forwardRef<ComponentRef<typeof FluentTabList>, TabListProps>(
  function TabList(props, ref) {
    return <FluentTabList ref={ref} {...props} />;
  },
);
