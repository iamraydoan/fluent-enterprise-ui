export type ToastLevel = "success" | "error" | "info";

export interface ToastMessage {
  id: number;
  level: ToastLevel;
  text: string;
}

type ToastListener = (message: ToastMessage) => void;

const listeners = new Set<ToastListener>();
let nextId = 0;

export function notify(level: ToastLevel, text: string): void {
  const message: ToastMessage = { id: ++nextId, level, text };
  listeners.forEach((listener) => listener(message));
}

export function onToast(listener: ToastListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
