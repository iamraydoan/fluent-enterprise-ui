export function formatDateTime(epochMs: number): string {
  const date = new Date(epochMs);
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  const hour24 = date.getUTCHours();
  const hour = hour24 % 12 || 12;
  const minute = String(date.getUTCMinutes()).padStart(2, "0");
  const second = String(date.getUTCSeconds()).padStart(2, "0");
  const suffix = hour24 >= 12 ? "PM" : "AM";
  return `${month}/${day}/${year} ${hour}:${minute}:${second} ${suffix}`;
}
