import { aiAgentHandlers } from "./handlers/aiAgent";
import { aiChatHandlers } from "./handlers/aiChat";
import { appHandlers } from "./handlers/apps";
import { configurationHandlers } from "./handlers/configuration";
import { entityTypeHandlers } from "./handlers/entityTypes";
import { mcpServerHandlers } from "./handlers/mcpServer";

export const handlers = [
  ...entityTypeHandlers,
  ...aiAgentHandlers,
  ...aiChatHandlers,
  ...appHandlers,
  ...configurationHandlers,
  ...mcpServerHandlers,
];
