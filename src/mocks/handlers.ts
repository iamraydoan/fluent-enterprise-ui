import { aiAgentHandlers } from "./handlers/aiAgent";
import { aiChatHandlers } from "./handlers/aiChat";
import { appHandlers } from "./handlers/apps";
import { qualificationHandlers } from "./handlers/businessData/qualification";
import { qualificationCheckHandlers } from "./handlers/businessData/qualificationCheck";
import { reasonHandlers } from "./handlers/businessData/reason";
import { recipeHandlers } from "./handlers/businessData/recipe";
import { resourceHandlers } from "./handlers/businessData/resource";
import { resourceJobHandlers } from "./handlers/businessData/resourceJob";
import { samplingPatternHandlers } from "./handlers/businessData/samplingPattern";
import { samplingPlanHandlers } from "./handlers/businessData/samplingPlan";
import { scheduleHandlers } from "./handlers/businessData/schedule";
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
  ...reasonHandlers,
  ...recipeHandlers,
  ...resourceHandlers,
  ...resourceJobHandlers,
  ...samplingPatternHandlers,
  ...samplingPlanHandlers,
  ...scheduleHandlers,
];
