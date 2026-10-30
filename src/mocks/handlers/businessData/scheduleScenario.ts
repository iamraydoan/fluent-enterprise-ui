import { http, HttpResponse } from "msw";
import {
  buildScheduleScenarioDetail,
  queryScheduleScenarios,
} from "../../seeds/businessData/scheduleScenario";

export const scheduleScenarioHandlers = [
  http.get("/business-data/schedule-scenarios", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryScheduleScenarios(
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/schedule-scenarios/:name", ({ params }) =>
    HttpResponse.json(buildScheduleScenarioDetail(decodeURIComponent(params.name as string))),
  ),
];
