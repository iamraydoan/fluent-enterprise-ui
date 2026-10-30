import { aiAgentHandlers } from "./handlers/aiAgent";
import { areaHandlers } from "./handlers/businessData/area";
import { batchHandlers } from "./handlers/businessData/batch";
import { bomHandlers } from "./handlers/businessData/bom";
import { binConverterHandlers } from "./handlers/businessData/binConverter";
import { businessPartnerHandlers } from "./handlers/businessData/businessPartner";
import { calendarHandlers } from "./handlers/businessData/calendar";
import { certificationHandlers } from "./handlers/businessData/certification";
import { changeSetHandlers } from "./handlers/businessData/changeSet";
import { chartHandlers } from "./handlers/businessData/chart";
import { checklistHandlers } from "./handlers/businessData/checklist";
import { containerHandlers } from "./handlers/businessData/container";
import { dataCollectionHandlers } from "./handlers/businessData/dataCollection";
import { dataCollectionLimitSetHandlers } from "./handlers/businessData/dataCollectionLimitSet";
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
import { maintenancePlanHandlers } from "./handlers/businessData/maintenancePlan";
import { mapHandlers } from "./handlers/businessData/map";
import { mapDefinitionHandlers } from "./handlers/businessData/mapDefinition";
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
  ...changeSetHandlers,
  ...chartHandlers,
  ...checklistHandlers,
  ...containerHandlers,
  ...dataCollectionHandlers,
  ...dataCollectionLimitSetHandlers,
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
  ...maintenancePlanHandlers,
  ...mapHandlers,
  ...mapDefinitionHandlers,
  ...genericTableHandlers,
  ...uiPageHandlers,
  ...mcpServerHandlers,
  ...queryHandlers,
];
