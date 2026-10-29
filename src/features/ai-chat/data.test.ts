import { describe, expect, it } from "vitest";
import { CHAT_AGENTS, CHAT_EXAMPLES, SEED_CHATS } from "./data";
import type { ChatMessage, ChatSession } from "./data";

describe("ai chat data", () => {
  it("lists four agents with English titles and descriptions", () => {
    expect(CHAT_AGENTS).toHaveLength(4);
    expect(CHAT_AGENTS[0].name).toBe("CM MES Agent");
    expect(CHAT_AGENTS[0].title).toBe("MES Agent");
    expect(CHAT_AGENTS[0].description).toContain("general MES assistant");
    expect(CHAT_EXAMPLES).toHaveLength(3);
    expect(CHAT_EXAMPLES).toContain("aiChat.examples.first");
  });

  it("seeds two chats with English messages", () => {
    const seeds: ChatSession[] = SEED_CHATS;
    expect(seeds).toHaveLength(2);
    const firstMessage: ChatMessage = seeds[0].messages[0];
    expect(firstMessage.role).toBe("user");
    expect(firstMessage.text).toBe("Which documents reference the latest recipe?");
    expect(seeds[1].messages[1].text).toContain("torque check");
  });
});
