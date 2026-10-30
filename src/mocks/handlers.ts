import { aiAgentHandlers } from "./handlers/aiAgent";
import { aiChatHandlers } from "./handlers/aiChat";
import { appHandlers } from "./handlers/apps";
import { qualificationHandlers } from "./handlers/businessData/qualification";
import { qualificationCheckHandlers } from "./handlers/businessData/qualificationCheck";
import { configurationHandlers } from "./handlers/configuration";
import { entityTypeHandlers } from "./handlers/entityTypes";
import { genericTableHandlers } from "./handlers/genericTables";
import { mcpServerHandlers } from "./handlers/mcpServer";
import { queryHandlers } from "./handlers/queries";
import { uiPageHandlers } from "./handlers/uiPages";

export const handlers = [
  ...entityTypeHandlers,
  ...aiAgentHandlers,
  ...aiChatHandlers,
  ...appHandlers,
  ...configurationHandlers,
  ...genericTableHandlers,
  ...uiPageHandlers,
  ...mcpServerHandlers,
  ...queryHandlers,
  ...qualificationHandlers,
  ...qualificationCheckHandlers,
];
