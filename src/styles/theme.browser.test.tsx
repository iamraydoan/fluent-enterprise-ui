import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { FluentProvider, makeStyles } from "@/components/ui";
import { initI18n } from "@/i18n";
import { theme } from "@/styles/theme";
import { theme as appTheme } from "@/theme";

const SPACING: [keyof typeof theme.spacing, string][] = [
  ["xs", "4px"],
  ["sm", "8px"],
  ["md", "12px"],
  ["lg", "16px"],
  ["xl", "24px"],
  ["2xl", "32px"],
];

const useProbeStyles = makeStyles({
  box: {
    paddingBottom: theme.spacing.md,
    marginTop: theme.spacing.xl,
    borderTop: `1px solid ${theme.color.borderSubtle}`,
    fontWeight: theme.font.weightSemibold,
  },
});

function Probe() {
  const styles = useProbeStyles();
  return <div className={styles.box} data-testid="make-styles" />;
}

function mount(ui: React.ReactNode) {
  localStorage.setItem("fluent-enterprise-ui:language", "en");
  initI18n();
  return render(<FluentProvider theme={appTheme}>{ui}</FluentProvider>);
}

function query(testId: string): Element {
  const el = document.querySelector(`[data-testid="${testId}"]`);
  if (!el) throw new Error(`missing ${testId}`);
  return el;
}

test("semantic theme tokens resolve to the pre-wave-1 literal values", async () => {
  await mount(
    <div>
      {SPACING.map(([key]) => (
        <div key={key} data-testid={`spacing-${key}`} style={{ paddingTop: theme.spacing[key] }} />
      ))}
      <div data-testid="radius" style={{ borderRadius: theme.radius.md }} />
      <div data-testid="border" style={{ borderTop: `1px solid ${theme.color.borderSubtle}` }} />
      <span data-testid="weight" style={{ fontWeight: theme.font.weightSemibold }} />
    </div>,
  );

  for (const [key, expected] of SPACING) {
    expect(getComputedStyle(query(`spacing-${key}`)).paddingTop, `spacing.${key}`).toBe(expected);
  }
  expect(getComputedStyle(query("radius")).borderTopLeftRadius).toBe("4px");
  const borderColor = getComputedStyle(query("border")).borderTopColor;
  expect(borderColor).toMatch(/^rgb/);
  expect(borderColor).not.toContain("var(");
  expect(getComputedStyle(query("weight")).fontWeight).toBe("600");
});

test("makeStyles spacing, border and weight compute to concrete values", async () => {
  await mount(<Probe />);
  const styles = getComputedStyle(query("make-styles"));
  expect(styles.paddingBottom).toBe("12px");
  expect(styles.marginTop).toBe("24px");
  expect(styles.borderTopColor).toMatch(/^rgb/);
  expect(styles.fontWeight).toBe("600");
});
