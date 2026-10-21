export type Stat = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
};

/** Formats a stat like "+327%", "1,284" or "4.9" with fixed decimals and thousands separators. */
export function formatStat({ value, prefix = "", suffix = "", decimals = 0 }: Stat): string {
  const n = value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${prefix}${n}${suffix}`;
}
