import { useState } from "react";
import { useParameterDetail } from "@/api";
import type { DetailMoreMenuItem } from "@/components/common";
import { DetailShell, KV } from "@/components/common";
import { Box24Regular } from "@/components/icons";
import { Text, makeStyles } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { useSharedStyles } from "@/styles/shared";
import {
  CloneParameterDialog,
  CreateParameterDialog,
  EditParameterDialog,
  TerminateParameterDialog,
  UnterminateParameterDialog,
} from "./ParameterOperations";

const useStyles = makeStyles({
  cards: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" },
  sectionTitle: { marginBottom: "8px" },
});

export function ParameterDetailPage({ name }: { name: string }) {
  const { t } = useAppTranslation();
  const styles = useStyles();
  const shared = useSharedStyles();
  const { data: detail } = useParameterDetail(name);

  const [top, setTop] = useState("details");
  const [left, setLeft] = useState<string>("businessData.parameter.left.details");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [cloneOpen, setCloneOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [unterminateOpen, setUnterminateOpen] = useState(false);

  if (!detail) {
    return <Text>{t("businessData.parameter.pageLabel")}</Text>;
  }

  const isTerminated = detail.state === "Terminated";

  const topTabs = [
    { value: "details", labelKey: "businessData.parameter.tabs.details" as TranslationKey },
    { value: "references", labelKey: "businessData.parameter.tabs.references" as TranslationKey },
    { value: "history", labelKey: "businessData.parameter.tabs.history" as TranslationKey },
  ];

  const leftItems: TranslationKey[] = [
    "businessData.parameter.left.details",
    "businessData.parameter.left.attributes",
    "businessData.parameter.left.attachments",
  ];

  const moreMenuItems: DetailMoreMenuItem[] = [
    {
      key: "clone",
      labelKey: "businessData.parameter.operations.clone.title" as TranslationKey,
      onClick: () => setCloneOpen(true),
    },
    ...(isTerminated
      ? [
          {
            key: "unterminate",
            labelKey: "businessData.parameter.operations.unterminate.title" as TranslationKey,
            onClick: () => setUnterminateOpen(true),
          },
        ]
      : [
          {
            key: "terminate",
            labelKey: "businessData.parameter.operations.terminate.title" as TranslationKey,
            onClick: () => setTerminateOpen(true),
          },
        ]),
  ];

  return (
    <>
    <DetailShell
      title={detail.name}
      icon={<Box24Regular />}
      topTabs={topTabs}
      top={top}
      onTop={setTop}
      leftItems={leftItems}
      left={left}
      onLeft={setLeft}
      onEdit={() => setEditOpen(true)}
      onAskAi={() => undefined}
      showState={false}
      moreMenuItems={moreMenuItems}
    >
      <div className={styles.cards}>
        <div className={shared.contentCard} style={{ padding: "14px 16px" }}>
          <Text weight="semibold" size={400} className={styles.sectionTitle}>
            {t("businessData.parameter.detail.generalData")}
          </Text>
          <KV
            rows={[
              [t("businessData.parameter.detail.fields.name"), detail.name],
              [t("businessData.parameter.detail.fields.description"), detail.description],
              [t("businessData.parameter.detail.fields.dataType"), detail.dataType],
              [t("businessData.parameter.detail.fields.value"), detail.value],
              [t("businessData.parameter.detail.fields.state"), detail.state],
            ]}
          />
        </div>
      </div>
    </DetailShell>

      <CreateParameterDialog open={createOpen} onClose={() => setCreateOpen(false)} />
      <EditParameterDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initialName={detail.name}
      />
      <CloneParameterDialog open={cloneOpen} onClose={() => setCloneOpen(false)} />
      <TerminateParameterDialog
        open={terminateOpen}
        onClose={() => setTerminateOpen(false)}
      />
      <UnterminateParameterDialog
        open={unterminateOpen}
        onClose={() => setUnterminateOpen(false)}
      />
    </>
  );
}
