export function containsIgnoreCase(haystack: string, query: string) {
  if (query === "") return true;
  return haystack.toLowerCase().includes(query.toLowerCase());
}
