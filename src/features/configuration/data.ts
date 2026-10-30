import type { ConfigurationEntry } from "@/api";
import type { TranslationKey } from "@/i18n";

export const CONFIG_ENTRY_TYPES = [
  "Boolean",
  "DateTime",
  "Decimal",
  "Enum",
  "Int16",
  "Int32",
  "Int64",
  "String",
];

export const CONFIG_ENTRY_TYPE_LABELS: Record<string, TranslationKey> = {
  Boolean: "configuration.entryTypes.boolean",
  DateTime: "configuration.entryTypes.dateTime",
  Decimal: "configuration.entryTypes.decimal",
  Enum: "configuration.entryTypes.enum",
  Int16: "configuration.entryTypes.int16",
  Int32: "configuration.entryTypes.int32",
  Int64: "configuration.entryTypes.int64",
  String: "configuration.entryTypes.string",
};

export function entryName(path: string): string {
  if (path === "/") return "Root";
  const trimmed = path.endsWith("/") ? path.slice(0, -1) : path;
  return trimmed.slice(trimmed.lastIndexOf("/") + 1);
}

function parentPath(path: string): string | null {
  if (path === "/") return null;
  const trimmed = path.endsWith("/") ? path.slice(0, -1) : path;
  return `${trimmed.slice(0, trimmed.lastIndexOf("/"))}/`;
}

export function maskedValue(entry: ConfigurationEntry): string {
  return entry.confidential && entry.value !== "" ? "*******" : entry.value;
}

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

export interface TreeNode {
  path: string;
  children: TreeNode[];
}

export function buildTree(branchPaths: string[]): TreeNode[] {
  const nodes = new Map<string, TreeNode>();
  for (const path of branchPaths) {
    nodes.set(path, { path, children: [] });
  }
  const roots: TreeNode[] = [];
  for (const path of branchPaths) {
    const node = nodes.get(path);
    if (!node) continue;
    const parent = parentPath(path);
    const parentNode = parent === null ? undefined : nodes.get(parent);
    if (parentNode) {
      parentNode.children.push(node);
    } else {
      roots.push(node);
    }
  }
  const byName = (a: TreeNode, b: TreeNode) => entryName(a.path).localeCompare(entryName(b.path));
  for (const node of nodes.values()) {
    node.children.sort(byName);
  }
  roots.sort(byName);
  return roots;
}
