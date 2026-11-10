import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { expect, test } from "vitest";
import { pageFingerprint, renderWithAppTheme } from "@/test-utils";
import { AiChatPage } from "./AiChatPage";
import parity from "./AiChatPage.parity.json";

const AGENT = "CM MES Agent";
const DRAFT = "compare the two revisions";
const REPLY = "Here is what I found";
const THINKING = "is thinking";
const CHAT_PATH = "/ai/chat";
const SKIP_TAGS = ["SCRIPT", "STYLE", "TEMPLATE", "NOSCRIPT", "LINK", "META", "TITLE"];

async function frames(count: number) {
  for (let index = 0; index < count; index += 1) {
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
  }
}

async function waitFor(check: () => boolean, label: string) {
  const deadline = Date.now() + 8000;
  while (Date.now() < deadline) {
    if (check()) return;
    await new Promise((resolve) => setTimeout(resolve, 30));
  }
  throw new Error("timed out waiting for " + label);
}

function control(ariaLabel: string) {
  const found = Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find(
    (element) => element.getAttribute("aria-label") === ariaLabel,
  );
  if (!found) throw new Error("control not found: " + ariaLabel);
  return found;
}

function buttonByText(text: string) {
  const found = Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find((element) =>
    (element.textContent ?? "").includes(text),
  );
  if (!found) throw new Error("button not found: " + text);
  return found;
}

function ownText(element: Element) {
  return Array.from(element.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent ?? "")
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

function renderable() {
  return Array.from(document.querySelectorAll<HTMLElement>("body *")).filter(
    (element) => !SKIP_TAGS.includes(element.tagName),
  );
}

function pageTexts() {
  const allowed = new Map<string, number>();
  for (const element of renderable()) {
    const text = ownText(element);
    if (text === "") continue;
    const key = text.slice(0, 40);
    allowed.set(key, (allowed.get(key) ?? 0) + 1);
  }
  const base = pageFingerprint();
  return base.texts.filter((entry) => {
    const key = String(entry[0]);
    const remaining = allowed.get(key) ?? 0;
    if (remaining === 0) return false;
    allowed.set(key, remaining - 1);
    return true;
  });
}

function textInventory() {
  const entries: [string, number, number, number, number][] = [];
  for (const element of renderable()) {
    const text = ownText(element);
    if (text === "") continue;
    const box = element.getBoundingClientRect();
    entries.push([
      text,
      Math.round(box.left),
      Math.round(box.top),
      Math.round(box.width),
      Math.round(box.height),
    ]);
  }
  return entries;
}

function rectOf(element: Element | null) {
  if (element === null) return null;
  const box = element.getBoundingClientRect();
  return [Math.round(box.left), Math.round(box.top), Math.round(box.width), Math.round(box.height)];
}

function chrome() {
  const textarea = document.querySelector("textarea");
  const composer = textarea?.parentElement ?? null;
  const rail = control("Toggle history").closest("div");
  const divider = rail?.querySelector("div") ?? null;
  return {
    composer: rectOf(composer),
    composerOuter: rectOf(composer?.parentElement ?? null),
    history: rectOf(document.querySelector("aside[aria-label]")),
    rail: rectOf(rail),
    divider: rectOf(divider),
    dividerBorder: divider === null ? null : getComputedStyle(divider).borderTopColor,
  };
}

function controlInventory() {
  const fields = Array.from(
    document.querySelectorAll<HTMLTextAreaElement | HTMLInputElement>("textarea, input"),
  ).map((element) => ({
    kind: "field",
    tag: element.tagName,
    value: element.value,
    placeholder: element.getAttribute("placeholder"),
    disabled: element.disabled,
    box: rectOf(element),
  }));
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>("button")).map(
    (element) => ({
      kind: "button",
      label: element.getAttribute("aria-label") ?? "",
      disabled: element.disabled,
      pressed: element.getAttribute("aria-pressed"),
      box: rectOf(element),
    }),
  );
  return [...fields, ...buttons];
}

function inventory() {
  return {
    fingerprint: { ...pageFingerprint(), texts: pageTexts() },
    texts: textInventory(),
    chrome: chrome(),
    controls: controlInventory(),
  };
}

function gateChatReply() {
  const original = globalThis.fetch;
  let open: () => void = () => undefined;
  const gate = new Promise<void>((resolve) => {
    open = resolve;
  });
  let released = false;
  let intercepted = false;
  globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === "string" ? input : input instanceof Request ? input.url : String(input);
    if (!url.includes(CHAT_PATH)) return original(input, init);
    intercepted = true;
    return gate.then(() => original(input, init));
  }) as typeof fetch;
  return {
    intercepted: () => intercepted,
    release: () => {
      if (released) return;
      released = true;
      globalThis.fetch = original;
      open();
    },
  };
}

async function captureView(expected?: unknown, attempts = 4) {
  await frames(2);
  let captured = inventory();
  if (expected === undefined) return captured;
  const target = JSON.stringify(expected);
  for (let attempt = 0; attempt < attempts && JSON.stringify(captured) !== target; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    captured = inventory();
  }
  return captured;
}

async function captureViews(expected?: Record<string, unknown>) {
  const screen = await renderWithAppTheme(
    <QueryClientProvider client={new QueryClient()}>
      <AiChatPage />
    </QueryClientProvider>,
  );
  await waitFor(() => (document.body.textContent ?? "").includes(AGENT), "the agent list");
  const views: Record<string, unknown> = {};
  views.empty = await captureView(expected?.empty);
  control("Toggle history").click();
  views.history = await captureView(expected?.history);
  buttonByText("Compare revision 2 and 3").click();
  views.session = await captureView(expected?.session);
  await screen.getByRole("textbox").fill(DRAFT);
  views.draft = await captureView(expected?.draft);
  const gate = gateChatReply();
  try {
    control("Send").click();
    await waitFor(() => (document.body.textContent ?? "").includes(THINKING), "the thinking line");
    views.sent = await captureView(expected?.sent, 1);
    if (!gate.intercepted()) throw new Error("the chat request bypassed the reply gate");
    gate.release();
    await waitFor(() => (document.body.textContent ?? "").includes(REPLY), "the bot reply");
    views.reply = await captureView(expected?.reply);
  } finally {
    gate.release();
  }
  return views;
}

test("keeps every chat region, session and composer field in place", async () => {
  expect(await captureViews(parity)).toEqual(parity);
});
