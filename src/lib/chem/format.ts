const SUP: Record<string, string> = {
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",
  "-": "⁻",
};

export function sup(value: number | string): string {
  return String(value)
    .split("")
    .map((ch) => SUP[ch] ?? ch)
    .join("");
}

export function fmt(x: number, sig = 4): string {
  if (!Number.isFinite(x)) return "—";
  if (x === 0) return "0";
  const abs = Math.abs(x);
  if (abs >= 1e6 || abs < 1e-4) {
    const exp = Math.floor(Math.log10(abs));
    const mant = x / 10 ** exp;
    return `${mant.toPrecision(sig).replace(/\.?0+$/, "")} × 10${sup(exp)}`;
  }
  const rounded = Number(x.toPrecision(sig));
  return rounded.toLocaleString("en-US", { maximumFractionDigits: 12 });
}

export function num(input: string): number | null {
  const v = parseFloat(input.replace(",", "."));
  return Number.isFinite(v) ? v : null;
}
