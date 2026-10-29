import { afterAll, afterEach, beforeAll } from "vitest";
import { worker } from "./mocks/browser";

beforeAll(async () => {
  await worker.start({ onUnhandledFrame: "bypass" });
});

afterEach(() => {
  worker.resetHandlers();
});

afterAll(() => {
  worker.stop();
});
