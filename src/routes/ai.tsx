import { createFileRoute } from "@tanstack/react-router";
import { AiChatPage } from "@/features/ai-chat/AiChatPage";

export const Route = createFileRoute("/ai")({
  component: AiChatPage,
});
