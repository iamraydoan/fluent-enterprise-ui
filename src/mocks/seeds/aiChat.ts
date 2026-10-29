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
