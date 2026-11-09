import { theme } from "@/styles/theme";

export function resolveSpacing(value: string | number): string {
  if (typeof value === "number") return `${value}px`;
  if (value === "none") return "0";
  return (theme.spacing as Record<string, string>)[value] ?? value;
}

export function resolveLength(value: string | number): string {
  return typeof value === "number" ? value + "px" : value;
}
