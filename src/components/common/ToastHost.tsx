import { useEffect, useState } from "react";
import {
  CheckmarkCircle20Filled,
  Dismiss16Regular,
  ErrorCircle20Filled,
  Info20Filled,
} from "@/components/icons";
import { useAppTranslation } from "@/i18n";
import { onToast } from "./toast";
import type { ToastMessage } from "./toast";

const LEVEL_STYLE: Record<ToastMessage["level"], { color: string; icon: React.ReactNode }> = {
  success: { color: "#107C10", icon: <CheckmarkCircle20Filled style={{ color: "#107C10" }} /> },
  error: { color: "#B10E1C", icon: <ErrorCircle20Filled style={{ color: "#B10E1C" }} /> },
  info: { color: "#0F6CBD", icon: <Info20Filled style={{ color: "#0F6CBD" }} /> },
};

export function ToastHost() {
  const { t } = useAppTranslation();
  const [list, setList] = useState<ToastMessage[]>([]);
  useEffect(
    () =>
      onToast((message) => {
        setList((prev) => [...prev.slice(-2), message]);
        setTimeout(() => setList((prev) => prev.filter((x) => x.id !== message.id)), 6000);
      }),
    [],
  );
  return (
    <div
      aria-live="polite"
      style={{
        position: "fixed",
        top: 3,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 2000000,
        display: "flex",
        flexDirection: "column",
        rowGap: 6,
        width: "min(600px, calc(100vw - 24px))",
      }}
    >
      {list.map((message) => {
        const look = LEVEL_STYLE[message.level];
        return (
          <div
            key={message.id}
            role="alert"
            style={{
              display: "flex",
              alignItems: "center",
              columnGap: 12,
              background: "#fff",
              borderLeft: `4px solid ${look.color}`,
              boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
              padding: "12px 14px",
              fontSize: 14,
              color: message.level === "error" ? look.color : "#222",
            }}
          >
            {look.icon}
            <span style={{ flexGrow: 1 }}>{message.text}</span>
            <button
              aria-label={t("common.dismissNotification")}
              onClick={() => setList((prev) => prev.filter((x) => x.id !== message.id))}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                display: "grid",
                color: "#888",
              }}
            >
              <Dismiss16Regular />
            </button>
          </div>
        );
      })}
    </div>
  );
}
