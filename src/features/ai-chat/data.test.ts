import { describe, expect, it } from "vitest";
import { CHAT_AGENTS, CHAT_EXAMPLES, pickTools, SEED_CHATS } from "./data";
import type { ChatMessage, ChatSession } from "./data";

describe("ai chat data", () => {
  it("lists four agents with MES Agent as the CM MES Agent title", () => {
    expect(CHAT_AGENTS).toHaveLength(4);
    expect(CHAT_AGENTS[0].name).toBe("CM MES Agent");
    expect(CHAT_AGENTS[0].title).toBe("MES Agent");
    expect(CHAT_EXAMPLES).toHaveLength(3);
  });

  it("seeds two chats and picks tools from the message text", () => {
    const seeds: ChatSession[] = SEED_CHATS;
    expect(seeds).toHaveLength(2);
    const firstMessage: ChatMessage = seeds[0].messages[0];
    expect(firstMessage.role).toBe("user");
    expect(pickTools("Summarize the latest attachment")).toEqual(["get_attachment_to_summarize"]);
    expect(pickTools("Compare two document revisions")).toEqual([
      "compare_entities",
      "compare_document_entity",
    ]);
    expect(pickTools("Find the entity by its name")).toEqual(["get_object_by_name"]);
  });
});
