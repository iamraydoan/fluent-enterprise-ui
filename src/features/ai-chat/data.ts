import type { TranslationKey } from "@/i18n";

export interface ChatAgent {
  id: string;
  name: string;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
}

export const CHAT_AGENTS: ChatAgent[] = [
  {
    id: "cm",
    name: "CM MES Agent",
    titleKey: "aiChat.agents.cm.title",
    descriptionKey: "aiChat.agents.cm.description",
  },
  {
    id: "qa",
    name: "Quality Assistant",
    titleKey: "aiChat.agents.qa.title",
    descriptionKey: "aiChat.agents.qa.description",
  },
  {
    id: "doc",
    name: "Document Summarizer",
    titleKey: "aiChat.agents.doc.title",
    descriptionKey: "aiChat.agents.doc.description",
  },
  {
    id: "mp",
    name: "Maintenance Planner",
    titleKey: "aiChat.agents.mp.title",
    descriptionKey: "aiChat.agents.mp.description",
  },
];

export const CHAT_EXAMPLES: TranslationKey[] = [
  "aiChat.examples.first",
  "aiChat.examples.second",
  "aiChat.examples.third",
];

export function pickTools(text: string): string[] {
  const lower = text.toLowerCase();
  if (lower.includes("summar") || lower.includes("attachment")) {
    return ["get_attachment_to_summarize"];
  }
  if (lower.includes("compare")) {
    return ["compare_entities", "compare_document_entity"];
  }
  if (lower.includes("document")) {
    return ["get_document_content"];
  }
  return ["get_object_by_name"];
}

export interface ChatMessage {
  role: "user" | "bot";
  text: string;
  textKey?: TranslationKey;
  tools?: string[];
}

export interface ChatSession {
  id: string;
  title: string;
  titleKey?: TranslationKey;
  agent: string;
  messages: ChatMessage[];
}

export const SEED_CHATS: ChatSession[] = [
  {
    id: "c1",
    title: "",
    titleKey: "aiChat.seeds.first.title",
    agent: "cm",
    messages: [
      {
        role: "user",
        text: "",
        textKey: "aiChat.seeds.first.userText",
      },
      {
        role: "bot",
        text: "",
        textKey: "aiChat.seeds.first.botText",
        tools: ["get_document_content"],
      },
    ],
  },
  {
    id: "c2",
    title: "",
    titleKey: "aiChat.seeds.second.title",
    agent: "cm",
    messages: [
      {
        role: "user",
        text: "",
        textKey: "aiChat.seeds.second.userText",
      },
      {
        role: "bot",
        text: "",
        textKey: "aiChat.seeds.second.botText",
        tools: ["compare_entities"],
      },
    ],
  },
];
