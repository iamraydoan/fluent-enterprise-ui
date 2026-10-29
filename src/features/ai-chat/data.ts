import type { TranslationKey } from "@/i18n";

export const CHAT_EXAMPLES: TranslationKey[] = [
  "aiChat.examples.first",
  "aiChat.examples.second",
  "aiChat.examples.third",
];

export interface ChatMessage {
  role: "user" | "bot";
  text: string;
  tools?: string[];
}

export interface ChatSession {
  id: string;
  title: string;
  agent: string;
  messages: ChatMessage[];
}

export const SEED_CHATS: ChatSession[] = [
  {
    id: "c1",
    title: "Which documents reference the latest recipe?",
    agent: "CM MES Agent",
    messages: [
      {
        role: "user",
        text: "Which documents reference the latest recipe?",
      },
      {
        role: "bot",
        text: "I found 3 documents that reference the latest recipe revision. The most recent one was updated on 28/10/2026.",
        tools: ["get_document_content"],
      },
    ],
  },
  {
    id: "c2",
    title: "Compare revision 2 and 3 of the work instruction",
    agent: "CM MES Agent",
    messages: [
      {
        role: "user",
        text: "Compare revision 2 and 3 of the work instruction",
      },
      {
        role: "bot",
        text: "Revision 3 adds a torque check at step 5 and removes the optional cleaning step.",
        tools: ["compare_entities"],
      },
    ],
  },
];
