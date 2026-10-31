import { useState } from "react";
import { BaseDialog, FormField } from "@/components/common";
import { Button, Input, Textarea, tokens } from "@/components/ui";
import { useAppTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

const L: Record<string, TranslationKey> = {
  checkInTitle: "businessData.employee.attendance.checkInTitle",
  checkOutTitle: "businessData.employee.attendance.checkOutTitle",
  clockInTitle: "businessData.employee.attendance.clockInTitle",
  clockOutTitle: "businessData.employee.attendance.clockOutTitle",
  assignSubordinatesTitle: "businessData.employee.attendance.assignSubordinatesTitle",
  unassignSubordinatesTitle: "businessData.employee.attendance.unassignSubordinatesTitle",
  assignTeamTitle: "businessData.employee.attendance.assignTeamTitle",
  resource: "businessData.employee.attendance.resource",
  certification: "businessData.employee.attendance.certification",
  subordinates: "businessData.employee.attendance.subordinates",
  team: "businessData.employee.attendance.team",
  workgroup: "businessData.employee.attendance.workgroup",
  area: "businessData.employee.attendance.area",
  comment: "businessData.employee.attendance.comment",
  reason: "businessData.employee.attendance.reason",
  cancel: "businessData.employee.attendance.cancel",
  checkIn: "businessData.employee.attendance.checkIn",
  checkOut: "businessData.employee.attendance.checkOut",
  clockIn: "businessData.employee.attendance.clockIn",
  clockOut: "businessData.employee.attendance.clockOut",
  assign: "businessData.employee.attendance.assign",
  save: "businessData.employee.attendance.save",
};

interface DialogProps {
  name: string;
  onClose: () => void;
}

export function CheckInDialog({ name, onClose }: DialogProps) {
  const { t } = useAppTranslation();
  const [resource, setResource] = useState("");
  const [certification, setCertification] = useState("");

  return (
    <BaseDialog
      open
      title={`${t(L.checkInTitle)} ${name}`}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          <Button appearance="primary" onClick={onClose} disabled={!resource.trim()}>
            {t(L.checkIn)}
          </Button>
        </>
      }
    >
      <FormField
        label={
          <>
            <span style={{ color: tokens.colorPaletteRedForeground1 }}>* </span>
            {t(L.resource)}
          </>
        }
      >
        <Input value={resource} onChange={(_, d) => setResource(d.value)} />
      </FormField>
      <FormField label={<>{t(L.certification)}</>}>
        <Input value={certification} onChange={(_, d) => setCertification(d.value)} />
      </FormField>
    </BaseDialog>
  );
}

export function CheckOutDialog({ name, onClose }: DialogProps) {
  const { t } = useAppTranslation();
  const [resource, setResource] = useState("");
  const [reason, setReason] = useState("");

  return (
    <BaseDialog
      open
      title={`${t(L.checkOutTitle)} ${name}`}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          <Button appearance="primary" onClick={onClose} disabled={!resource.trim()}>
            {t(L.checkOut)}
          </Button>
        </>
      }
    >
      <FormField
        label={
          <>
            <span style={{ color: tokens.colorPaletteRedForeground1 }}>* </span>
            {t(L.resource)}
          </>
        }
      >
        <Input value={resource} onChange={(_, d) => setResource(d.value)} />
      </FormField>
      <FormField label={<>{t(L.reason)}</>}>
        <Input value={reason} onChange={(_, d) => setReason(d.value)} />
      </FormField>
    </BaseDialog>
  );
}

export function ClockInDialog({ name, onClose }: DialogProps) {
  const { t } = useAppTranslation();

  return (
    <BaseDialog
      open
      title={t(L.clockInTitle)}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          <Button appearance="primary" onClick={onClose}>
            {t(L.clockIn)}
          </Button>
        </>
      }
    >
      <div>{name}</div>
    </BaseDialog>
  );
}

export function ClockOutDialog({ name, onClose }: DialogProps) {
  const { t } = useAppTranslation();
  const [comment, setComment] = useState("");

  return (
    <BaseDialog
      open
      title={`${t(L.clockOutTitle)} ${name}`}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          <Button appearance="primary" onClick={onClose}>
            {t(L.clockOut)}
          </Button>
        </>
      }
    >
      <FormField label={<>{t(L.comment)}</>}>
        <Textarea value={comment} onChange={(_, d) => setComment(d.value)} />
      </FormField>
    </BaseDialog>
  );
}

export function AssignSubordinatesDialog({ name, onClose }: DialogProps) {
  const { t } = useAppTranslation();
  const [subordinates, setSubordinates] = useState("");

  return (
    <BaseDialog
      open
      title={`${t(L.assignSubordinatesTitle)} ${name}`}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          <Button appearance="primary" onClick={onClose} disabled={!subordinates.trim()}>
            {t(L.assign)}
          </Button>
        </>
      }
    >
      <FormField
        label={
          <>
            <span style={{ color: tokens.colorPaletteRedForeground1 }}>* </span>
            {t(L.subordinates)}
          </>
        }
      >
        <Input value={subordinates} onChange={(_, d) => setSubordinates(d.value)} />
      </FormField>
    </BaseDialog>
  );
}

export function AssignTeamWorkgroupDialog({ name, onClose }: DialogProps) {
  const { t } = useAppTranslation();
  const [team, setTeam] = useState("");
  const [workgroup, setWorkgroup] = useState("");
  const [area, setArea] = useState("");

  return (
    <BaseDialog
      open
      title={`${t(L.assignTeamTitle)} ${name}`}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>{t(L.cancel)}</Button>
          <Button appearance="primary" onClick={onClose}>
            {t(L.save)}
          </Button>
        </>
      }
    >
      <FormField label={<>{t(L.team)}</>}>
        <Input value={team} onChange={(_, d) => setTeam(d.value)} />
      </FormField>
      <FormField label={<>{t(L.workgroup)}</>}>
        <Input value={workgroup} onChange={(_, d) => setWorkgroup(d.value)} />
      </FormField>
      <FormField label={<>{t(L.area)}</>}>
        <Input value={area} onChange={(_, d) => setArea(d.value)} />
      </FormField>
    </BaseDialog>
  );
}
