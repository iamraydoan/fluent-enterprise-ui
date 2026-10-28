import { Field, Input, Text } from "@/components/ui";

interface FieldRowProps {
  label: string;
  value: string;
}

function FieldRow({ label, value }: FieldRowProps) {
  return (
    <Field label={label}>
      <Input readOnly appearance="underline" value={value} />
    </Field>
  );
}

export function Fields() {
  return (
    <div style={{ overflow: "auto" }}>
      <div style={{ padding: "14px 4px 0" }}>
        <Text weight="semibold" size={400}>
          Details
        </Text>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: "16px 32px",
          padding: "16px 4px",
        }}
      >
        <FieldRow label="Name" value="CM MES Agent" />
        <FieldRow label="State" value="Active" />
        <FieldRow label="Model" value="Default" />
        <FieldRow label="Created by" value="Nguyen Minh Anh" />
        <FieldRow label="Created on" value="12/10/2026" />
        <FieldRow label="Last modified" value="28/10/2026" />
      </div>
    </div>
  );
}
