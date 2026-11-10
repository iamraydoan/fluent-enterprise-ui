import {
  makeStyles as fluentMakeStyles,
  mergeClasses as fluentMergeClasses,
  tokens as fluentTokens,
} from "@fluentui/react-components";

export function makeStyles<Slots extends string | number>(
  stylesBySlots: Parameters<typeof fluentMakeStyles<Slots>>[0],
) {
  return fluentMakeStyles<Slots>(stylesBySlots);
}

export function mergeClasses(...args: Parameters<typeof fluentMergeClasses>) {
  return fluentMergeClasses(...args);
}

export const tokens = fluentTokens;
