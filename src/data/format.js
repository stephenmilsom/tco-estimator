// Compact: €2.3m, €450k — used for summary cards and totals
export function fmt(v, symbol = "€") {
  if (v === 0) return "—";
  const abs = Math.abs(v);
  let str;
  if (abs >= 1_000_000)  str = symbol + (abs / 1_000_000).toFixed(1) + "m";
  else if (abs >= 1_000) str = symbol + Math.round(abs / 1_000) + "k";
  else                   str = symbol + Math.round(abs).toLocaleString("en-GB");
  return v < 0 ? `(${str})` : str;
}

// Full integer: €612,840 — used for table row cells
export function fmtFull(v, symbol = "€") {
  if (v === 0) return "—";
  const abs = Math.abs(v);
  const str = symbol + Math.round(abs).toLocaleString("en-GB");
  return v < 0 ? `(${str})` : str;
}
