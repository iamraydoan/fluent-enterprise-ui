import { aiAgentHandlers } from "./handlers/aiAgent";
import { aiChatHandlers } from "./handlers/aiChat";
import { appHandlers } from "./handlers/apps";
import { dataSiloHandlers } from "./handlers/businessData/dataSilo";
import { documentHandlers } from "./handlers/businessData/document";
import { employeeHandlers } from "./handlers/businessData/employee";
import { enterpriseHandlers } from "./handlers/businessData/enterprise";
import { experimentDefinitionHandlers } from "./handlers/businessData/experimentDefinition";
import { facilityHandlers } from "./handlers/businessData/facility";
import { flowHandlers } from "./handlers/businessData/flow";
import { inspectionPlanHandlers } from "./handlers/businessData/inspectionPlan";
import { kpiHandlers } from "./handlers/businessData/kpi";
import { maintenanceActivityOrderHandlers } from "./handlers/businessData/maintenanceActivityOrder";
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
  ...dataSiloHandlers,
  ...documentHandlers,
  ...employeeHandlers,
  ...enterpriseHandlers,
  ...experimentDefinitionHandlers,
  ...facilityHandlers,
  ...flowHandlers,
  ...inspectionPlanHandlers,
  ...kpiHandlers,
  ...maintenanceActivityOrderHandlers,
  ...genericTableHandlers,
  ...uiPageHandlers,
  ...mcpServerHandlers,
  ...queryHandlers,
];
