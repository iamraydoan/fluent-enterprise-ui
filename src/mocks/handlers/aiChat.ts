import { delay, http, HttpResponse } from "msw";
import { pickTools } from "../seeds/aiChat";

export function answerChat(message: string): string[] {
  return pickTools(message);
}

interface ChatRequestBody {
  message: string;
  agentId: string;
}

export const aiChatHandlers = [
  http.post("/ai/chat", async ({ request }) => {
    const body = (await request.json()) as ChatRequestBody;
    await delay(900);
    return HttpResponse.json({ tools: answerChat(body.message) });
  }),
];
