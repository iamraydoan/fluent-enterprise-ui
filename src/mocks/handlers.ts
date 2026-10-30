import { aiAgentHandlers } from "./handlers/aiAgent";
import { aiChatHandlers } from "./handlers/aiChat";
import { appHandlers } from "./handlers/apps";
import { configurationHandlers } from "./handlers/configuration";
import { entityTypeHandlers } from "./handlers/entityTypes";
import { genericTableHandlers } from "./handlers/genericTables";
import { mcpServerHandlers } from "./handlers/mcpServer";
import { queryHandlers } from "./handlers/queries";
import { shiftDefinitionHandlers } from "./handlers/businessData/shiftDefinition";
import { shiftLogbookHandlers } from "./handlers/businessData/shiftLogbook";
import { shiftPlanHandlers } from "./handlers/businessData/shiftPlan";
import { siteHandlers } from "./handlers/businessData/site";
import { sortRuleSetHandlers } from "./handlers/businessData/sortRuleSet";
import { stepHandlers } from "./handlers/businessData/step";
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
  ...shiftDefinitionHandlers,
  ...shiftLogbookHandlers,
  ...shiftPlanHandlers,
  ...siteHandlers,
  ...sortRuleSetHandlers,
  ...stepHandlers,
];
