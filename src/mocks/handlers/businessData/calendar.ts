import { http, HttpResponse } from "msw";
import {
  buildCalendarDetail,
  createCalendarDetail,
  queryCalendars,
  updateCalendarDetail,
} from "../../seeds/businessData/calendar";
import type { CalendarUpsertInput } from "../../seeds/businessData/calendar";

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
  http.post("/business-data/calendars", async ({ request }) => {
    const input = (await request.json()) as CalendarUpsertInput;
    if (!input.name) {
      return HttpResponse.json({ message: "Name is required" }, { status: 400 });
    }
    return HttpResponse.json(createCalendarDetail(input), { status: 201 });
  }),
  http.put("/business-data/calendars/:name", async ({ params, request }) => {
    const name = decodeURIComponent(params.name as string);
    const input = (await request.json()) as Partial<CalendarUpsertInput>;
    const updated = updateCalendarDetail(name, input);
    if (!updated) {
      return HttpResponse.json({ message: "Calendar not found" }, { status: 404 });
    }
    return HttpResponse.json(updated);
  }),
  http.patch("/business-data/calendars/:name/state", async ({ params, request }) => {
    const name = decodeURIComponent(params.name as string);
    const body = (await request.json()) as { state?: string };
    const updated = updateCalendarDetail(name, body.state ? { state: body.state } : {});
    if (!updated) {
      return HttpResponse.json({ message: "Calendar not found" }, { status: 404 });
    }
    return HttpResponse.json(updated);
  }),
];
