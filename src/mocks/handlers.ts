import { aiAgentHandlers } from "./handlers/aiAgent";
import { aiChatHandlers } from "./handlers/aiChat";
import { appHandlers } from "./handlers/apps";
import { configurationHandlers } from "./handlers/configuration";
import { entityTypeHandlers } from "./handlers/entityTypes";
import { genericTableHandlers } from "./handlers/genericTables";
import { mcpServerHandlers } from "./handlers/mcpServer";
import { queryHandlers } from "./handlers/queries";
import { uiPageHandlers } from "./handlers/uiPages";
import { materialHandlers } from "./handlers/businessData/material";
import { materialTransferHandlers } from "./handlers/businessData/materialTransfer";
import { notificationHandlers } from "./handlers/businessData/notification";
import { packageHandlers } from "./handlers/businessData/package";
import { parameterHandlers } from "./handlers/businessData/parameter";
import { productHandlers } from "./handlers/businessData/product";
import { productionOrderHandlers } from "./handlers/businessData/productionOrder";
import { protocolHandlers } from "./handlers/businessData/protocol";
import { periodicInventoryHandlers } from "./handlers/businessData/periodicInventory";
import { pickListHandlers } from "./handlers/businessData/pickList";
import { planHandlers } from "./handlers/businessData/plan";
import { printableDocumentHandlers } from "./handlers/businessData/printableDocument";
import { productGroupHandlers } from "./handlers/businessData/productGroup";

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
  ...materialHandlers,
  ...materialTransferHandlers,
  ...notificationHandlers,
  ...packageHandlers,
  ...parameterHandlers,
  ...productHandlers,
  ...productionOrderHandlers,
  ...protocolHandlers,
  ...periodicInventoryHandlers,
  ...pickListHandlers,
  ...planHandlers,
  ...printableDocumentHandlers,
  ...productGroupHandlers,
];
