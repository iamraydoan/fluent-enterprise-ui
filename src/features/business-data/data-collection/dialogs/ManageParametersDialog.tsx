import { useState } from "react";
import type { DataCollectionParameter } from "@/api";
import { BaseDialog } from "@/components/common";
import { Button } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { OperationValues } from "../../components/operationTypes";
import {
  DataCollectionParametersEditor,
  type DataCollectionParameterRow,
} from "./ParametersEditor";

export function ManageDataCollectionParametersDialog({
  open,
  parameters,
  onClose,
  onConfirm,
}: {
  open: boolean;
  parameters: DataCollectionParameter[];
  onClose: () => void;
  onConfirm: (parameters: DataCollectionParameter[]) => void;
}) {
  const { t } = useAppTranslation();
  const [values, setValues] = useState<OperationValues>({});
  const onChange = (key: string, value: string | number | boolean) =>
    setValues((prev) => ({ ...prev, [key]: value }));
  const rows = (values.parameters as unknown as DataCollectionParameterRow[] | undefined) ?? [];
  const toParameters = (): DataCollectionParameter[] =>
    rows.map((r) => ({
      parameter: r.parameter,
      dataType: r.dataType,
      isOptional: r.isOptional,
      minimumSamples: r.minimumSamples,
      maximumSamples: r.maximumSamples,
      minimumSampleReadings: r.minimumSampleReadings,
      maximumSampleReadings: r.maximumSampleReadings,
      limitChecking: r.limitChecking,
    }));
  return (
    <BaseDialog
      open={open}
      size="xl"
      title={t("businessData.dataCollection.operations.manageParametersTitle")}
      onClose={onClose}
      footer={
        <>
          <Button appearance="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button appearance="primary" onClick={() => onConfirm(toParameters())}>
            {t("businessData.dataCollection.operations.update")}
          </Button>
        </>
      }
    >
      <DataCollectionParametersEditor
        values={{
          parameters: (values.parameters ??
            parameters.map((p, idx) => ({ ...p, id: Date.now() + idx }))) as unknown as boolean,
        }}
        onChange={onChange}
      />
    </BaseDialog>
  );
}
