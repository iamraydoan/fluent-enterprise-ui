import { Avatar as FluentAvatar } from "@fluentui/react-components";
import { forwardRef } from "react";
import type { ComponentProps, ComponentRef } from "react";

export type AvatarProps = ComponentProps<typeof FluentAvatar>;

export const Avatar = forwardRef<ComponentRef<typeof FluentAvatar>, AvatarProps>(
  function Avatar(props, ref) {
    return <FluentAvatar ref={ref} {...props} />;
  },
);
