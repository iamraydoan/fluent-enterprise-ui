import { aiAgentHandlers } from "./handlers/aiAgent";
import { aiChatHandlers } from "./handlers/aiChat";
import { appHandlers } from "./handlers/apps";
import { areaHandlers } from "./handlers/businessData/area";
import { batchHandlers } from "./handlers/businessData/batch";
import { binConverterHandlers } from "./handlers/businessData/binConverter";
import { bomHandlers } from "./handlers/businessData/bom";
import { businessPartnerHandlers } from "./handlers/businessData/businessPartner";
import { calendarHandlers } from "./handlers/businessData/calendar";
import { certificationHandlers } from "./handlers/businessData/certification";
import { changeSetHandlers } from "./handlers/businessData/changeSet";
import { chartHandlers } from "./handlers/businessData/chart";
import { checklistHandlers } from "./handlers/businessData/checklist";
import { containerHandlers } from "./handlers/businessData/container";
import { dataCollectionHandlers } from "./handlers/businessData/dataCollection";
import { dataCollectionLimitSetHandlers } from "./handlers/businessData/dataCollectionLimitSet";
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
import { materialHandlers } from "./handlers/businessData/material";
import { materialTransferHandlers } from "./handlers/businessData/materialTransfer";
import { notificationHandlers } from "./handlers/businessData/notification";
import { packageHandlers } from "./handlers/businessData/package";
import { parameterHandlers } from "./handlers/businessData/parameter";
import { periodicInventoryHandlers } from "./handlers/businessData/periodicInventory";
import { pickListHandlers } from "./handlers/businessData/pickList";
import { planHandlers } from "./handlers/businessData/plan";
import { printableDocumentHandlers } from "./handlers/businessData/printableDocument";
import { productHandlers } from "./handlers/businessData/product";
import { productGroupHandlers } from "./handlers/businessData/productGroup";
import { productionOrderHandlers } from "./handlers/businessData/productionOrder";
import { protocolHandlers } from "./handlers/businessData/protocol";
import { qualificationHandlers } from "./handlers/businessData/qualification";
import { qualificationCheckHandlers } from "./handlers/businessData/qualificationCheck";
import { reasonHandlers } from "./handlers/businessData/reason";
import { recipeHandlers } from "./handlers/businessData/recipe";
import { resourceHandlers } from "./handlers/businessData/resource";
import { resourceJobHandlers } from "./handlers/businessData/resourceJob";
import { samplingPatternHandlers } from "./handlers/businessData/samplingPattern";
import { samplingPlanHandlers } from "./handlers/businessData/samplingPlan";
import { scheduleHandlers } from "./handlers/businessData/schedule";
import { scheduleScenarioHandlers } from "./handlers/businessData/scheduleScenario";
import { sendAheadRunHandlers } from "./handlers/businessData/sendAheadRun";
import { serviceHandlers } from "./handlers/businessData/service";
import { setupMatrixHandlers } from "./handlers/businessData/setupMatrix";
import { shiftDefinitionHandlers } from "./handlers/businessData/shiftDefinition";
import { shiftLogbookHandlers } from "./handlers/businessData/shiftLogbook";
import { shiftPlanHandlers } from "./handlers/businessData/shiftPlan";
import { siteHandlers } from "./handlers/businessData/site";
import { sortRuleSetHandlers } from "./handlers/businessData/sortRuleSet";
import { stepHandlers } from "./handlers/businessData/step";
import { substrateMapHandlers } from "./handlers/businessData/substrateMap";
import { substrateMapMaskHandlers } from "./handlers/businessData/substrateMapMask";
import { taskHandlers } from "./handlers/businessData/task";
import { teamHandlers } from "./handlers/businessData/team";
import { transferOrderHandlers } from "./handlers/businessData/transferOrder";
import { transferRequirementHandlers } from "./handlers/businessData/transferRequirement";
import { workgroupHandlers } from "./handlers/businessData/workgroup";
import { configurationHandlers } from "./handlers/configuration";
import { entityTypeHandlers } from "./handlers/entityTypes";
import { genericTableHandlers } from "./handlers/genericTables";
import { mcpServerHandlers } from "./handlers/mcpServer";
import { myWorkgroupHandlers } from "./handlers/myWorkgroup";
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
  ...myWorkgroupHandlers,
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

  ...qualificationHandlers,
  ...qualificationCheckHandlers,
  ...reasonHandlers,
  ...recipeHandlers,
  ...resourceHandlers,
  ...resourceJobHandlers,
  ...samplingPatternHandlers,
  ...samplingPlanHandlers,
  ...scheduleHandlers,
  ...scheduleScenarioHandlers,
  ...sendAheadRunHandlers,
  ...serviceHandlers,
  ...setupMatrixHandlers,

  ...shiftDefinitionHandlers,
  ...shiftLogbookHandlers,
  ...shiftPlanHandlers,
  ...siteHandlers,
  ...sortRuleSetHandlers,
  ...stepHandlers,
  ...substrateMapHandlers,
  ...substrateMapMaskHandlers,
  ...taskHandlers,
  ...teamHandlers,
  ...transferOrderHandlers,
  ...transferRequirementHandlers,
  ...workgroupHandlers,
];
