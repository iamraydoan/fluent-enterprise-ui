import {
  makeStyles as fluentMakeStyles,
  mergeClasses as fluentMergeClasses,
  tokens as fluentTokens,
} from "@fluentui/react-components";

export function makeStyles(...args: Parameters<typeof fluentMakeStyles>) {
  return fluentMakeStyles(...args);
}

export function mergeClasses(...args: Parameters<typeof fluentMergeClasses>) {
  return fluentMergeClasses(...args);
}

export const tokens = fluentTokens;
