import { http, HttpResponse } from "msw";
import { buildCalendarDetail, queryCalendars } from "../../seeds/businessData/calendar";

export const calendarHandlers = [
  http.get("/business-data/calendars", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const q = params.get("q");
    const state = params.get("state");
    return HttpResponse.json(
      queryCalendars(
        Number(params.get("page") ?? 1),
        Number(params.get("limit") ?? 20),
        q === null || q === "" ? undefined : q,
        state === null || state === "" ? undefined : state,
      ),
    );
  }),
  http.get("/business-data/calendars/:name", ({ params }) =>
    HttpResponse.json(buildCalendarDetail(decodeURIComponent(params.name as string))),
  ),
];
