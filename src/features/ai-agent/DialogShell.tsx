import { useState } from "react";
import type { ReactNode } from "react";
import {
  Bot20Regular,
  ChevronDown20Regular,
  ChevronUp20Regular,
  QuestionCircle20Regular,
} from "@/components/icons";
import { Button, makeStyles, Text, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";

const useDialogShellStyles = makeStyles({
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "grid",
    placeItems: "center",
    padding: "24px",
    boxSizing: "border-box",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  surface: {
    width: "calc(100vw - 48px)",
    height: "calc(100vh - 48px)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    borderRadius: "12px",
    backgroundColor: "#FAFAFA",
  },
  head: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "48px",
    padding: "0 16px",
    backgroundColor: "#DDE1E7",
    flexShrink: 0,
  },
  headTitle: { display: "flex", alignItems: "center", columnGap: "10px" },
  sub: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: "#FAFAFA",
    flexShrink: 0,
    fontSize: "13px",
  },
  link: {
    color: "#1a6fc4",
    display: "inline-flex",
    alignItems: "center",
    columnGap: "6px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "13px",
    padding: 0,
  },
  body: { flexGrow: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "auto" },
  comments: { borderTop: `1px solid ${tokens.colorNeutralStroke2}`, flexShrink: 0 },
  commentsBtn: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 40px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "13px",
    color: "#444",
  },
  foot: {
    display: "flex",
    justifyContent: "flex-end",
    columnGap: "10px",
    padding: "10px 20px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: "#F3F4F6",
    flexShrink: 0,
  },
});

interface DialogShellProps {
  title: string;
  icon: ReactNode;
  onClose: () => void;
  sub?: ReactNode;
  footer: ReactNode;
  showComments?: boolean;
  children: ReactNode;
}

export function DialogShell({
  title,
  icon,
  onClose,
  sub,
  footer,
  showComments = true,
  children,
}: DialogShellProps) {
  const dialogShellStyles = useDialogShellStyles();
  const { t } = useAppTranslation();
  const [commentsOpen, setCommentsOpen] = useState(false);
  return (
    <div
      className={dialogShellStyles.overlay}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={dialogShellStyles.surface} role="dialog" aria-modal="true" aria-label={title}>
        <div className={dialogShellStyles.head}>
          <span className={dialogShellStyles.headTitle}>
            {icon}
            <Text size={500}>{title}</Text>
          </span>
          <Button
            appearance="subtle"
            shape="circular"
            icon={<QuestionCircle20Regular />}
            aria-label={t("dialogs.help")}
          />
        </div>
        {sub}
        <div className={dialogShellStyles.body}>{children}</div>
        {showComments && (
          <div className={dialogShellStyles.comments}>
            <button
              className={dialogShellStyles.commentsBtn}
              onClick={() => setCommentsOpen((open) => !open)}
              aria-expanded={commentsOpen}
            >
              {t("dialogs.commentsLabel")}
              {commentsOpen ? <ChevronDown20Regular /> : <ChevronUp20Regular />}
            </button>
            {commentsOpen && (
              <div style={{ padding: "0 40px 12px" }}>
                <textarea
                  aria-label={t("dialogs.comments")}
                  rows={3}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                    fontSize: 13,
                    padding: 8,
                  }}
                />
              </div>
            )}
          </div>
        )}
        <div className={dialogShellStyles.foot}>{footer}</div>
      </div>
    </div>
  );
}

export function DialogAgentSub({
  agentName,
  agentDescription,
}: {
  agentName: string;
  agentDescription?: string;
}) {
  const dialogShellStyles = useDialogShellStyles();
  return (
    <div className={dialogShellStyles.sub}>
      <span style={{ display: "inline-flex", alignItems: "center", columnGap: 10, minWidth: 0 }}>
        <span className={dialogShellStyles.link}>
          <Bot20Regular />
          {agentName}
        </span>
        {agentDescription && <span style={{ color: "#333" }}>{` / ${agentDescription}`}</span>}
      </span>
      <ChevronDown20Regular style={{ color: "#1a6fc4" }} />
    </div>
  );
}
