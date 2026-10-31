import { BaseDialog, DialogFooter } from "@/components/common";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

const L: Record<string, TranslationKey> = {
  setEffectiveTitle: "businessData.maintenancePlan.terminateDialog.setEffectiveTitle",
  setEffectiveMessage: "businessData.maintenancePlan.terminateDialog.setEffectiveMessage",
  setEffective: "businessData.maintenancePlan.terminateDialog.setEffective",
};

export function SetMaintenancePlanEffectiveDialog({
  open,
  name,
  onClose,
}: {
  open: boolean;
  name: string;
  onClose: () => void;
}) {
  const { t } = useAppTranslation();

  return (
    <BaseDialog
      open={open}
      title={t(L.setEffectiveTitle)}
      onClose={onClose}
      size="sm"
      footer={
        <DialogFooter
          onCancel={onClose}
          onConfirm={onClose}
          confirmLabel={t(L.setEffective)}
        />
      }
    >
      <div>{t(L.setEffectiveMessage, { name })}</div>
    </BaseDialog>
  );
}
