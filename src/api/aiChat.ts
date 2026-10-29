import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "./client";

export interface SendChatRequest {
  message: string;
  agentId: string;
}

export interface SendChatResponse {
  tools: string[];
}

export function sendChatMessage(request: SendChatRequest): Promise<SendChatResponse> {
  return apiFetch<SendChatResponse>("/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
}

export function useSendChat() {
  return useMutation({ mutationFn: sendChatMessage });
}
