import type { ReactNode } from "react";
import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { BaseDialog, DialogFooter } from "@/components/common/BaseDialog";
import { FluentProvider } from "@/components/ui";
import { initI18n } from "@/i18n";

function renderDialog(ui: ReactNode) {
  localStorage.setItem("fluent-enterprise-ui:language", "en");
  initI18n();
  return render(<FluentProvider>{ui}</FluentProvider>);
}

test("renders nothing when closed", async () => {
  await renderDialog(
    <BaseDialog open={false} title="Edit record" onClose={() => {}}>
      <span>dialog body</span>
    </BaseDialog>,
  );
  expect(document.body.innerText).not.toContain("Edit record");
  expect(document.body.innerText).not.toContain("dialog body");
});

test("renders title and children when open", async () => {
  const screen = await renderDialog(
    <BaseDialog open title="Edit record" onClose={() => {}}>
      <span>dialog body</span>
    </BaseDialog>,
  );
  await expect.element(screen.getByText("Edit record")).toBeVisible();
  await expect.element(screen.getByText("dialog body")).toBeVisible();
});

test("close button calls onClose", async () => {
  const onClose = vi.fn();
  const screen = await renderDialog(
    <BaseDialog open title="Edit record" onClose={onClose}>
      <span>dialog body</span>
    </BaseDialog>,
  );
  await screen.getByRole("button", { name: "Close" }).click();
  expect(onClose).toHaveBeenCalledTimes(1);
});

test("clicking the overlay calls onClose", async () => {
  const onClose = vi.fn();
  await renderDialog(
    <BaseDialog open title="Edit record" onClose={onClose}>
      <span>dialog body</span>
    </BaseDialog>,
  );
  const dialog = document.querySelector('[role="dialog"]');
  expect(dialog).not.toBeNull();
  (dialog!.parentElement as HTMLElement).click();
  expect(onClose).toHaveBeenCalledTimes(1);
});

test("footer renders confirm and cancel actions", async () => {
  const onCancel = vi.fn();
  const onConfirm = vi.fn();
  const screen = await renderDialog(
    <BaseDialog
      open
      title="Edit record"
      onClose={() => {}}
      footer={
        <DialogFooter onCancel={onCancel} onConfirm={onConfirm} confirmLabel="Save changes" />
      }
    >
      <span>dialog body</span>
    </BaseDialog>,
  );
  await screen.getByText("Save changes").click();
  expect(onConfirm).toHaveBeenCalledTimes(1);
  await screen.getByText("Cancel").click();
  expect(onCancel).toHaveBeenCalledTimes(1);
});
