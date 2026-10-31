import { describe, expect, it } from "vitest";
import { CHAT_EXAMPLES, SEED_CHATS } from "./data";
import type { ChatMessage, ChatSession } from "./data";

describe("ai chat data", () => {
  it("keeps example prompts as i18n keys", () => {
    expect(CHAT_EXAMPLES).toHaveLength(3);
    expect(CHAT_EXAMPLES).toContain("aiChat.examples.first");
  });

  it("seeds two chats with English messages referencing API agent names", () => {
    const seeds: ChatSession[] = SEED_CHATS;
    expect(seeds).toHaveLength(2);
    expect(seeds[0].agent).toBe("CM MES Agent");
    const firstMessage: ChatMessage = seeds[0].messages[0];
    expect(firstMessage.role).toBe("user");
    expect(firstMessage.text).toBe("Which documents reference the latest recipe?");
    expect(seeds[1].messages[1].text).toContain("torque check");
  });
});
