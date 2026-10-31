import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../client";

export type BarcodeEntityKind = "material" | "resource" | "container";

export interface ScannedBarcode {
  code: string;
  entityKind: BarcodeEntityKind;
  name: string;
  state: string;
}

export interface BarcodeEntityInfoRow {
  labelKey: string;
  value: string;
  link?: boolean;
}

export interface BarcodeEntityInfo {
  code: string;
  entityKind: BarcodeEntityKind;
  titleKey: string;
  rows: BarcodeEntityInfoRow[];
}

export interface BarcodeIdentificationSettings {
  barcodePropertyByEntity: Record<BarcodeEntityKind, string>;
}

export const BARCODE_ENTITIES: BarcodeEntityKind[] = ["material", "resource", "container"];

export const BARCODE_PROPERTY_OPTIONS = [
  "Name",
  "Description",
  "AssembleQuantity",
  "AssembleSecondaryQuantity",
  "BinCode",
  "BinNumber",
] as const;

export function lookupBarcode(code: string): Promise<ScannedBarcode | null> {
  return apiFetch<ScannedBarcode | null>(
    `/manufacturing/barcode-identification/lookup?code=${encodeURIComponent(code)}`,
  );
}

export function useBarcodeLookup(code: string | null) {
  return useQuery({
    queryKey: ["manufacturing", "barcode-identification", "lookup", code],
    queryFn: () => lookupBarcode(code ?? ""),
    enabled: code !== null && code.trim() !== "",
    retry: false,
  });
}

export function getBarcodeEntityInfo(code: string): Promise<BarcodeEntityInfo | null> {
  return apiFetch<BarcodeEntityInfo | null>(
    `/manufacturing/barcode-identification/info?code=${encodeURIComponent(code)}`,
  );
}

export function useBarcodeEntityInfo(code: string | null) {
  return useQuery({
    queryKey: ["manufacturing", "barcode-identification", "info", code],
    queryFn: () => getBarcodeEntityInfo(code ?? ""),
    enabled: code !== null && code.trim() !== "",
    retry: false,
  });
}

export function getBarcodeIdentificationSettings(): Promise<BarcodeIdentificationSettings> {
  return apiFetch<BarcodeIdentificationSettings>(`/manufacturing/barcode-identification/settings`);
}

export function useBarcodeIdentificationSettings() {
  return useQuery({
    queryKey: ["manufacturing", "barcode-identification", "settings"],
    queryFn: getBarcodeIdentificationSettings,
  });
}

export function updateBarcodeIdentificationSettings(
  settings: BarcodeIdentificationSettings,
): Promise<BarcodeIdentificationSettings> {
  return apiFetch<BarcodeIdentificationSettings>(`/manufacturing/barcode-identification/settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });
}

export function useUpdateBarcodeIdentificationSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBarcodeIdentificationSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(["manufacturing", "barcode-identification", "settings"], data);
    },
  });
}
