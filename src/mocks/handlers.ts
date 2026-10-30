import { aiAgentHandlers } from "./handlers/aiAgent";
import { areaHandlers } from "./handlers/businessData/area";
import { batchHandlers } from "./handlers/businessData/batch";
import { bomHandlers } from "./handlers/businessData/bom";
import { binConverterHandlers } from "./handlers/businessData/binConverter";
import { businessPartnerHandlers } from "./handlers/businessData/businessPartner";
import { calendarHandlers } from "./handlers/businessData/calendar";
import { certificationHandlers } from "./handlers/businessData/certification";
import { aiChatHandlers } from "./handlers/aiChat";
import { appHandlers } from "./handlers/apps";
import { configurationHandlers } from "./handlers/configuration";
import { entityTypeHandlers } from "./handlers/entityTypes";
import { genericTableHandlers } from "./handlers/genericTables";
import { mcpServerHandlers } from "./handlers/mcpServer";
import { queryHandlers } from "./handlers/queries";
import { uiPageHandlers } from "./handlers/uiPages";

export const handlers = [
  ...entityTypeHandlers,
  ...aiAgentHandlers,
  ...areaHandlers,
  ...batchHandlers,
  ...bomHandlers,
  ...binConverterHandlers,
  ...businessPartnerHandlers,
  ...calendarHandlers,
  ...certificationHandlers,
  ...aiChatHandlers,
  ...appHandlers,
  ...configurationHandlers,
  ...genericTableHandlers,
  ...uiPageHandlers,
  ...mcpServerHandlers,
  ...queryHandlers,
];
