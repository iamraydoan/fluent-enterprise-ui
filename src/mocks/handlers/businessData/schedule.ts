import { http, HttpResponse } from "msw";
import { buildScheduleDetail, querySchedules } from "../../seeds/businessData/schedule";

export const scheduleHandlers = [
  http.get("/business-data/schedules", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      querySchedules(
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/schedules/:name", ({ params }) =>
    HttpResponse.json(buildScheduleDetail(decodeURIComponent(params.name as string))),
  ),
];
