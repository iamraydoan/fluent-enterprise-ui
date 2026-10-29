export interface ChatAgent {
  id: string;
  name: string;
  title: string;
  description: string;
}

export const CHAT_AGENTS: ChatAgent[] = [
  {
    id: "cm",
    name: "CM MES Agent",
    title: "MES Agent",
    description:
      "Acts as a general MES assistant, a starting point for questions about products, resources or documents, guiding to the right answer.",
  },
  {
    id: "qa",
    name: "Quality Assistant",
    title: "Quality Assistant",
    description:
      "Helps review non-conformance reports and inspection results, and points to the records that matter.",
  },
  {
    id: "doc",
    name: "Document Summarizer",
    title: "Document Summarizer",
    description: "Summarizes documents and attachments and extracts the key points you ask for.",
  },
  {
    id: "mp",
    name: "Maintenance Planner",
    title: "Maintenance Planner",
    description: "Suggests maintenance schedules and finds equipment history for a resource.",
  },
];

export const CHAT_EXAMPLES: string[] = [
  "Summarize the latest attachment",
  "Compare two document revisions",
  "Find the entity by its name",
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
    agent: "cm",
    messages: [
      { role: "user", text: "Which documents reference the latest recipe?" },
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
    agent: "cm",
    messages: [
      { role: "user", text: "Compare revision 2 and 3 of the work instruction" },
      {
        role: "bot",
        text: "Revision 3 adds a torque check at step 5 and removes the optional cleaning step.",
        tools: ["compare_entities"],
      },
    ],
  },
];
