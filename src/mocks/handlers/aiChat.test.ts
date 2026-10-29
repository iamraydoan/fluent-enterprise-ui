import { describe, expect, test } from "vitest";
import { answerChat } from "./aiChat";

describe("answerChat", () => {
  test("matches summar and attachment keywords", () => {
    expect(answerChat("Summarize the latest attachment")).toEqual(["get_attachment_to_summarize"]);
    expect(answerChat("Please SUMMARIZE this")).toEqual(["get_attachment_to_summarize"]);
    expect(answerChat("Check the attachment")).toEqual(["get_attachment_to_summarize"]);
  });

  test("matches the compare keyword", () => {
    expect(answerChat("Compare two document revisions")).toEqual([
      "compare_entities",
      "compare_document_entity",
    ]);
  });

  test("matches the document keyword", () => {
    expect(answerChat("Find the document content")).toEqual(["get_document_content"]);
  });

  test("falls back to get_object_by_name", () => {
    expect(answerChat("Find the entity by its name")).toEqual(["get_object_by_name"]);
  });
});
