# Page Encapsulation Checklist

Task-management file for workstream C (page-by-page encapsulation).
Regenerate with the inventory script; update Status/Owner/Review/Commit as work lands.

## Summary

| Metric                         | Count |
| ------------------------------ | ----- |
| Page files scanned             | 158   |
| Pages carrying styling debt    | 47    |
| Pages already clean            | 94    |
| Pages calling makeStyles       | 40    |
| Pages with inline style props  | 49    |
| Pages importing theme directly | 59    |
| Pages importing config         | 0     |

Debt columns: MS = makeStyles calls, INL = inline style props, HEX = hex literals, PX = px literals, THM = imports @/styles/theme, CFG = imports config.

Provenance: the debt columns are the ORIGINAL inventory taken before workstream C started. They are a planning aid, not the live state - `eslint.page-debt.json` is authoritative for what still offends, and the two are reconciled at the end of each wave. The PX values in particular predate the matcher widening in b923a90, which now also catches px embedded inside a longer style string. A row records progress only once its Commit column holds a sha and its Review column holds a verdict; a page reaches done only after an independent review passes it, under the per-page rules in `docs/THEME_SETTINGS_PLAN.md` section 14.

The five non-page rows in `eslint.page-debt.json` are NOT page debt and must not be reported as unfinished pages. They are the `dialogs/dialogStyles.ts` and `dialogs/dialogShared.ts` modules under `src/features/**`, and their `no-restricted-syntax` entry does something different from every other row: `eslint.config.js` turns that rule OFF for any file that lists it, then turns it back ON with only the card-surface ban for exactly those files. The entry is therefore a permanent carve-out that excuses a style module from the general feature bans (hand-rolled flex/grid, raw `<button>`, hex inside makeStyles) while still forbidding a hardcoded card colour. So workstream C finishes with the ledger at five files, not zero, and those five are a deliberate, recorded exemption rather than an incomplete conversion. Closing them for real means converting the dialogs that consume them onto primitives - a separate wave, not a page conversion, and it does not shrink by moving the files.

Status legend: pending / in-progress / review / fixing / done / deferred. Review: blank / pass / fail. `deferred` means the page is left in the ledger and untouched on purpose, because converting it would need several primitives that no second consumer justifies yet; it is never a way of closing a row, and the debt stays counted.

## components/common (3 pages, 2 need work)

| #   | Page                                          | MS  | INL | HEX | PX  | THM | CFG | Status  | Owner | Review | Commit |
| --- | --------------------------------------------- | --- | --- | --- | --- | --- | --- | ------- | ----- | ------ | ------ |
| 1   | components/common/HubPage.tsx                 | 1   | 2   | 0   | 11  | 1   | 0   | pending |       |        |        |
| 2   | components/common/data-table/DataListPage.tsx | 1   | 0   | 0   | 1   | 0   | 0   | pending |       |        |        |
| 3   | components/common/ListPage.tsx                | 0   | 0   | 0   | 0   | 0   | 0   | clean   |       |        |        |

## features/administration (16 pages, 11 need work)

| #   | Page                                                              | MS  | INL | HEX | PX  | THM | CFG | Status   | Owner       | Review | Commit  |
| --- | ----------------------------------------------------------------- | --- | --- | --- | --- | --- | --- | -------- | ----------- | ------ | ------- |
| 4   | features/administration/queries/QueryDetailPage.tsx               | 1   | 0   | 0   | 26  | 1   | 0   | deferred |             |        |         |
| 5   | features/administration/entity-types/EntityTypeDetailPage.tsx     | 1   | 3   | 0   | 17  | 1   | 0   | pending  |             |        |         |
| 6   | features/administration/ai-agent/AiAgentDetailPage.tsx            | 1   | 14  | 0   | 5   | 1   | 0   | pending  |             |        |         |
| 7   | features/administration/ai-mcp-server/McpServerDetailPage.tsx     | 1   | 10  | 0   | 6   | 1   | 0   | pending  |             |        |         |
| 8   | features/administration/ui-pages/UIPagesPage.tsx                  | 1   | 2   | 0   | 14  | 1   | 0   | pending  |             |        |         |
| 9   | features/administration/PlaceholderPage.tsx                       | 1   | 2   | 0   | 0   | 1   | 0   | pending  |             |        |         |
| 10  | features/administration/tables/GenericTableDetailPage.tsx         | 1   | 0   | 0   | 2   | 1   | 0   | done     | page-worker | pass   | 1e782dd |
| 11  | features/administration/queries/QueriesPage.tsx                   | 1   | 0   | 0   | 1   | 1   | 0   | done     | page-worker | pass   | c15f988 |
| 12  | features/administration/configuration/ConfigurationDetailPage.tsx | 0   | 2   | 0   | 0   | 0   | 0   | done     | page-worker | pass   | aba427f |
| 13  | features/administration/configuration/ConfigurationListPage.tsx   | 0   | 1   | 0   | 1   | 0   | 0   | done     | page-worker | pass   | 90b1a8d |
| 14  | features/administration/tables/TablesHubPage.tsx                  | 1   | 0   | 0   | 1   | 0   | 0   | done     | page-worker | pass   | 51de5c3 |
| 15  | features/administration/AdministrationHubPage.tsx                 | 0   | 0   | 0   | 0   | 0   | 0   | clean    |             |        |         |
| 16  | features/administration/ai-agent/AiAgentListPage.tsx              | 0   | 0   | 0   | 0   | 0   | 0   | clean    |             |        |         |
| 17  | features/administration/ai-mcp-server/McpServerListPage.tsx       | 0   | 0   | 0   | 0   | 0   | 0   | clean    |             |        |         |
| 18  | features/administration/apps/AppsListPage.tsx                     | 0   | 0   | 0   | 0   | 0   | 0   | clean    |             |        |         |
| 19  | features/administration/entity-types/EntityTypesListPage.tsx      | 0   | 0   | 0   | 0   | 0   | 0   | clean    |             |        |         |

## features/ai (1 pages, 1 need work)

| #   | Page                            | MS  | INL | HEX | PX  | THM | CFG | Status  | Owner | Review | Commit |
| --- | ------------------------------- | --- | --- | --- | --- | --- | --- | ------- | ----- | ------ | ------ |
| 20  | features/ai/chat/AiChatPage.tsx | 1   | 10  | 7   | 42  | 1   | 0   | pending |       |        |        |

## features/business-data (131 pages, 47 need work)

| #   | Page                                                                                     | MS  | INL | HEX | PX  | THM | CFG | Status  | Owner       | Review | Commit  |
| --- | ---------------------------------------------------------------------------------------- | --- | --- | --- | --- | --- | --- | ------- | ----------- | ------ | ------- |
| 21  | features/business-data/data-collection/DataCollectionDetailPage.tsx                      | 0   | 0   | 0   | 0   | 0   | 0   | done    | page-worker | pass   | 63d6056 |
| 22  | features/business-data/checklist/ChecklistDetailPage.tsx                                 | 0   | 0   | 0   | 0   | 0   | 0   | done    | page-worker | pass   | 7523da3 |
| 23  | features/business-data/calendar/CalendarDetailPage.tsx                                   | 1   | 3   | 0   | 18  | 1   | 0   | pending |             |        |         |
| 24  | features/business-data/container/ContainerDetailPage.tsx                                 | 0   | 0   | 0   | 0   | 0   | 0   | done    | test-worker | pass   | 6b2a75b |
| 25  | features/business-data/product-group/ProductGroupDetailPage.tsx                          | 1   | 9   | 0   | 1   | 1   | 0   | pending |             |        |         |
| 26  | features/business-data/chart/ChartDetailPage.tsx                                         | 0   | 0   | 0   | 0   | 0   | 0   | done    | test-worker | pass   | 3e94d5e |
| 27  | features/business-data/shift-plan/ShiftPlanDetailPage.tsx                                | 0   | 7   | 0   | 3   | 1   | 0   | pending |             |        |         |
| 28  | features/business-data/business-partner/BusinessPartnerDetailPage.tsx                    | 0   | 0   | 0   | 0   | 0   | 0   | done    | test-worker | pass   | 0d566b6 |
| 29  | features/business-data/certification/CertificationDetailPage.tsx                         | 0   | 0   | 0   | 0   | 0   | 0   | done    | test-worker | pass   | 0d566b6 |
| 30  | features/business-data/change-set/ChangeSetDetailPage.tsx                                | 0   | 0   | 0   | 0   | 0   | 0   | done    | test-worker | pass   | 63f7855 |
| 31  | features/business-data/package/PackageDetailPage.tsx                                     | 1   | 5   | 0   | 1   | 1   | 0   | pending |             |        |         |
| 32  | features/business-data/shift-logbook/ShiftLogbookDetailPage.tsx                          | 0   | 6   | 0   | 1   | 1   | 0   | pending |             |        |         |
| 33  | features/business-data/step/StepDetailPage.tsx                                           | 0   | 6   | 0   | 1   | 1   | 0   | pending |             |        |         |
| 34  | features/business-data/area/AreaDetailPage.tsx                                           | 0   | 0   | 0   | 0   | 0   | 0   | done    | test-worker | pass   | 19b36b2 |
| 35  | features/business-data/batch/BatchDetailPage.tsx                                         | 0   | 0   | 0   | 0   | 0   | 0   | done    | test-worker | pass   | 0d566b6 |
| 36  | features/business-data/bin-converter/BinConverterDetailPage.tsx                          | 0   | 0   | 0   | 0   | 0   | 0   | done    | test-worker | pass   | 0d566b6 |
| 37  | features/business-data/bom/BomDetailPage.tsx                                             | 0   | 0   | 0   | 0   | 0   | 0   | done    | test-worker | pass   | 0d566b6 |
| 38  | features/business-data/data-collection-limit-set/DataCollectionLimitSetDetailPage.tsx    | 0   | 0   | 0   | 0   | 0   | 0   | done    | test-worker | pass   | ed1cd8c |
| 39  | features/business-data/employee/EmployeeDetailPage.tsx                                   | 0   | 3   | 0   | 3   | 1   | 0   | pending |             |        |         |
| 40  | features/business-data/notification/NotificationDetailPage.tsx                           | 1   | 4   | 0   | 1   | 1   | 0   | pending |             |        |         |
| 41  | features/business-data/substrate-map/SubstrateMapDetailPage.tsx                          | 0   | 4   | 0   | 2   | 1   | 0   | pending |             |        |         |
| 42  | features/business-data/site/SiteDetailPage.tsx                                           | 0   | 4   | 0   | 1   | 1   | 0   | pending |             |        |         |
| 43  | features/business-data/material/MaterialDetailPage.tsx                                   | 1   | 1   | 0   | 2   | 1   | 0   | pending |             |        |         |
| 44  | features/business-data/sort-rule-set/SortRuleSetDetailPage.tsx                           | 0   | 3   | 0   | 1   | 1   | 0   | pending |             |        |         |
| 45  | features/business-data/transfer-order/TransferOrderDetailPage.tsx                        | 0   | 3   | 0   | 1   | 1   | 0   | pending |             |        |         |
| 46  | features/business-data/transfer-requirement/TransferRequirementDetailPage.tsx            | 0   | 3   | 0   | 1   | 1   | 0   | pending |             |        |         |
| 47  | features/business-data/workgroup/WorkgroupDetailPage.tsx                                 | 0   | 4   | 0   | 0   | 1   | 0   | pending |             |        |         |
| 48  | features/business-data/maintenance-plan/MaintenancePlanDetailPage.tsx                    | 0   | 2   | 0   | 2   | 0   | 0   | pending |             |        |         |
| 49  | features/business-data/material-transfer/MaterialTransferDetailPage.tsx                  | 1   | 1   | 0   | 1   | 1   | 0   | pending |             |        |         |
| 50  | features/business-data/parameter/ParameterDetailPage.tsx                                 | 1   | 1   | 0   | 1   | 1   | 0   | pending |             |        |         |
| 51  | features/business-data/periodic-inventory/PeriodicInventoryDetailPage.tsx                | 1   | 1   | 0   | 1   | 1   | 0   | pending |             |        |         |
| 52  | features/business-data/pick-list/PickListDetailPage.tsx                                  | 1   | 1   | 0   | 1   | 1   | 0   | pending |             |        |         |
| 53  | features/business-data/plan/PlanDetailPage.tsx                                           | 1   | 1   | 0   | 1   | 1   | 0   | pending |             |        |         |
| 54  | features/business-data/printable-document/PrintableDocumentDetailPage.tsx                | 1   | 1   | 0   | 1   | 1   | 0   | pending |             |        |         |
| 55  | features/business-data/product/ProductDetailPage.tsx                                     | 1   | 1   | 0   | 1   | 1   | 0   | pending |             |        |         |
| 56  | features/business-data/production-order/ProductionOrderDetailPage.tsx                    | 1   | 1   | 0   | 1   | 1   | 0   | pending |             |        |         |
| 57  | features/business-data/protocol/ProtocolDetailPage.tsx                                   | 1   | 1   | 0   | 1   | 1   | 0   | pending |             |        |         |
| 58  | features/business-data/shift-definition/ShiftDefinitionDetailPage.tsx                    | 0   | 3   | 0   | 0   | 1   | 0   | pending |             |        |         |
| 59  | features/business-data/substrate-map-mask/SubstrateMapMaskDetailPage.tsx                 | 0   | 2   | 0   | 1   | 1   | 0   | pending |             |        |         |
| 60  | features/business-data/team/TeamDetailPage.tsx                                           | 0   | 3   | 0   | 0   | 1   | 0   | pending |             |        |         |
| 61  | features/business-data/flow/FlowDetailPage.tsx                                           | 0   | 2   | 0   | 0   | 1   | 0   | pending |             |        |         |
| 62  | features/business-data/inspection-plan/InspectionPlanDetailPage.tsx                      | 0   | 1   | 0   | 1   | 1   | 0   | pending |             |        |         |
| 63  | features/business-data/maintenance-activity-order/MaintenanceActivityOrderDetailPage.tsx | 0   | 1   | 0   | 1   | 1   | 0   | pending |             |        |         |
| 64  | features/business-data/map/MapDetailPage.tsx                                             | 0   | 1   | 0   | 1   | 1   | 0   | pending |             |        |         |
| 65  | features/business-data/task/TaskDetailPage.tsx                                           | 0   | 2   | 0   | 0   | 1   | 0   | pending |             |        |         |
| 66  | features/business-data/experiment-definition/ExperimentDefinitionDetailPage.tsx          | 0   | 1   | 0   | 0   | 1   | 0   | pending |             |        |         |
| 67  | features/business-data/facility/FacilityDetailPage.tsx                                   | 0   | 1   | 0   | 0   | 1   | 0   | pending |             |        |         |
| 68  | features/business-data/area/AreaListPage.tsx                                             | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 69  | features/business-data/batch/BatchListPage.tsx                                           | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 70  | features/business-data/bin-converter/BinConverterListPage.tsx                            | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 71  | features/business-data/bom/BomListPage.tsx                                               | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 72  | features/business-data/business-partner/BusinessPartnerListPage.tsx                      | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 73  | features/business-data/BusinessDataHubPage.tsx                                           | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 74  | features/business-data/calendar/CalendarListPage.tsx                                     | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 75  | features/business-data/certification/CertificationListPage.tsx                           | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 76  | features/business-data/change-set/ChangeSetListPage.tsx                                  | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 77  | features/business-data/chart/ChartListPage.tsx                                           | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 78  | features/business-data/checklist/ChecklistListPage.tsx                                   | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 79  | features/business-data/container/ContainerListPage.tsx                                   | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 80  | features/business-data/data-collection-limit-set/DataCollectionLimitSetListPage.tsx      | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 81  | features/business-data/data-collection/DataCollectionListPage.tsx                        | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 82  | features/business-data/data-silo/DataSiloDetailPage.tsx                                  | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 83  | features/business-data/data-silo/DataSiloListPage.tsx                                    | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 84  | features/business-data/document/DocumentDetailPage.tsx                                   | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 85  | features/business-data/document/DocumentListPage.tsx                                     | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 86  | features/business-data/employee/EmployeeListPage.tsx                                     | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 87  | features/business-data/enterprise/EnterpriseDetailPage.tsx                               | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 88  | features/business-data/enterprise/EnterpriseListPage.tsx                                 | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 89  | features/business-data/experiment-definition/ExperimentDefinitionListPage.tsx            | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 90  | features/business-data/facility/FacilityListPage.tsx                                     | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 91  | features/business-data/flow/FlowListPage.tsx                                             | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 92  | features/business-data/inspection-plan/InspectionPlanListPage.tsx                        | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 93  | features/business-data/kpi/KpiDetailPage.tsx                                             | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 94  | features/business-data/kpi/KpiListPage.tsx                                               | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 95  | features/business-data/maintenance-activity-order/MaintenanceActivityOrderListPage.tsx   | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 96  | features/business-data/maintenance-plan/MaintenancePlanListPage.tsx                      | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 97  | features/business-data/map-definition/MapDefinitionDetailPage.tsx                        | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 98  | features/business-data/map-definition/MapDefinitionListPage.tsx                          | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 99  | features/business-data/map/MapListPage.tsx                                               | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 100 | features/business-data/material-transfer/MaterialTransferListPage.tsx                    | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 101 | features/business-data/material/MaterialListPage.tsx                                     | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 102 | features/business-data/notification/NotificationListPage.tsx                             | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 103 | features/business-data/package/PackageListPage.tsx                                       | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 104 | features/business-data/parameter/ParameterListPage.tsx                                   | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 105 | features/business-data/periodic-inventory/PeriodicInventoryListPage.tsx                  | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 106 | features/business-data/pick-list/PickListListPage.tsx                                    | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 107 | features/business-data/plan/PlanListPage.tsx                                             | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 108 | features/business-data/printable-document/PrintableDocumentListPage.tsx                  | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 109 | features/business-data/product-group/ProductGroupListPage.tsx                            | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 110 | features/business-data/product/ProductListPage.tsx                                       | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 111 | features/business-data/production-order/ProductionOrderListPage.tsx                      | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 112 | features/business-data/protocol/ProtocolListPage.tsx                                     | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 113 | features/business-data/qualification-check/QualificationCheckDetailPage.tsx              | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 114 | features/business-data/qualification-check/QualificationCheckListPage.tsx                | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 115 | features/business-data/qualification/QualificationDetailPage.tsx                         | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 116 | features/business-data/qualification/QualificationListPage.tsx                           | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 117 | features/business-data/reason/ReasonDetailPage.tsx                                       | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 118 | features/business-data/reason/ReasonListPage.tsx                                         | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 119 | features/business-data/recipe/RecipeDetailPage.tsx                                       | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 120 | features/business-data/recipe/RecipeListPage.tsx                                         | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 121 | features/business-data/resource-job/ResourceJobDetailPage.tsx                            | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 122 | features/business-data/resource-job/ResourceJobListPage.tsx                              | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 123 | features/business-data/resource/ResourceDetailPage.tsx                                   | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 124 | features/business-data/resource/ResourceListPage.tsx                                     | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 125 | features/business-data/sampling-pattern/SamplingPatternDetailPage.tsx                    | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 126 | features/business-data/sampling-pattern/SamplingPatternListPage.tsx                      | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 127 | features/business-data/sampling-plan/SamplingPlanDetailPage.tsx                          | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 128 | features/business-data/sampling-plan/SamplingPlanListPage.tsx                            | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 129 | features/business-data/schedule-scenario/ScheduleScenarioDetailPage.tsx                  | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 130 | features/business-data/schedule-scenario/ScheduleScenarioListPage.tsx                    | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 131 | features/business-data/schedule/ScheduleDetailPage.tsx                                   | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 132 | features/business-data/schedule/ScheduleListPage.tsx                                     | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 133 | features/business-data/send-ahead-run/SendAheadRunDetailPage.tsx                         | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 134 | features/business-data/send-ahead-run/SendAheadRunListPage.tsx                           | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 135 | features/business-data/service/ServiceDetailPage.tsx                                     | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 136 | features/business-data/service/ServiceListPage.tsx                                       | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 137 | features/business-data/setup-matrix/SetupMatrixDetailPage.tsx                            | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 138 | features/business-data/setup-matrix/SetupMatrixListPage.tsx                              | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 139 | features/business-data/shift-definition/ShiftDefinitionListPage.tsx                      | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 140 | features/business-data/shift-logbook/ShiftLogbookListPage.tsx                            | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 141 | features/business-data/shift-plan/ShiftPlanListPage.tsx                                  | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 142 | features/business-data/site/SiteListPage.tsx                                             | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 143 | features/business-data/sort-rule-set/SortRuleSetListPage.tsx                             | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 144 | features/business-data/step/StepListPage.tsx                                             | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 145 | features/business-data/substrate-map-mask/SubstrateMapMaskListPage.tsx                   | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 146 | features/business-data/substrate-map/SubstrateMapListPage.tsx                            | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 147 | features/business-data/task/TaskListPage.tsx                                             | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 148 | features/business-data/team/TeamListPage.tsx                                             | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 149 | features/business-data/transfer-order/TransferOrderListPage.tsx                          | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 150 | features/business-data/transfer-requirement/TransferRequirementListPage.tsx              | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |
| 151 | features/business-data/workgroup/WorkgroupListPage.tsx                                   | 0   | 0   | 0   | 0   | 0   | 0   | clean   |             |        |         |

## features/manufacturing (7 pages, 3 need work)

| #   | Page                                                                        | MS  | INL | HEX | PX  | THM | CFG | Status  | Owner | Review | Commit |
| --- | --------------------------------------------------------------------------- | --- | --- | --- | --- | --- | --- | ------- | ----- | ------ | ------ |
| 152 | features/manufacturing/my-workgroup/MyWorkgroupPage.tsx                     | 0   | 6   | 0   | 7   | 1   | 0   | pending |       |        |        |
| 153 | features/manufacturing/augmented-reality/AugmentedRealityPage.tsx           | 1   | 4   | 0   | 7   | 1   | 0   | pending |       |        |        |
| 154 | features/manufacturing/barcode-identification/BarcodeIdentificationPage.tsx | 1   | 2   | 0   | 8   | 1   | 0   | pending |       |        |        |
| 155 | features/manufacturing/fab-explorer/FabExplorerPage.tsx                     | 0   | 0   | 0   | 0   | 0   | 0   | clean   |       |        |        |
| 156 | features/manufacturing/fab-lives/FabLiveDetailPage.tsx                      | 0   | 0   | 0   | 0   | 0   | 0   | clean   |       |        |        |
| 157 | features/manufacturing/fab-lives/FabLiveListPage.tsx                        | 0   | 0   | 0   | 0   | 0   | 0   | clean   |       |        |        |
| 158 | features/manufacturing/ManufacturingHubPage.tsx                             | 0   | 0   | 0   | 0   | 0   | 0   | clean   |       |        |        |
