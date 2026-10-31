import type { DataCollectionParameter } from "@/api";
import { useAppTranslation } from "@/i18n";
import type { OperationValues } from "../../components/operationTypes";
import { DataValuesEditor } from "./DataValuesEditor";
import {
  DataCollectionParametersEditor,
  type DataCollectionParameterRow,
} from "./ParametersEditor";
import { useDialogStyles } from "./dialogStyles";

export function PerformImmediateParametersStep({
  values,
  onChange,
  dcParameters,
}: {
  values: OperationValues;
  onChange: (key: string, value: string | number | boolean) => void;
  dcParameters: DataCollectionParameter[];
}) {
  const { t } = useAppTranslation();
  const styles = useDialogStyles();
  const adHoc = values.adHoc === true;
  if (!adHoc) {
    return (
      <div>
        <div className={styles.hint}>
          {t("businessData.dataCollection.operations.useDcParametersHint")}
        </div>
        {dcParameters.length === 0 && (
          <div className={styles.empty}>
            {t("businessData.dataCollection.operations.noParameters")}
          </div>
        )}
        {dcParameters.map((p) => (
          <div key={p.parameter} className={styles.kvRow}>
            <span className={styles.kvLabel}>{p.parameter}:</span>
            <span>{p.dataType}</span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <DataCollectionParametersEditor
      values={values}
      onChange={onChange}
      fieldKey="adHocParameters"
    />
  );
}

export function PerformImmediateDataStep({
  values,
  onChange,
  dcParameters,
}: {
  values: OperationValues;
  onChange: (key: string, value: string | number | boolean) => void;
  dcParameters: DataCollectionParameter[];
}) {
  const adHoc = values.adHoc === true;
  const adHocParams =
    (values.adHocParameters as unknown as DataCollectionParameterRow[] | undefined) ?? [];
  const parameters = adHoc
    ? adHocParams.map((p) => ({ parameter: p.parameter, isOptional: p.isOptional }))
    : dcParameters.map((p) => ({ parameter: p.parameter, isOptional: p.isOptional }));
  return <DataValuesEditor parameters={parameters} values={values} onChange={onChange} />;
}
