import type { QuantumElement } from "@/lib/chem/quantum-elements";

export const SPEC_MIN_NM = 200;
export const SPEC_MAX_NM = 850;
export const SPEC_SPAN_NM = SPEC_MAX_NM - SPEC_MIN_NM;

export type SpectralBand = "UV" | "Violet" | "Blue" | "Green" | "Yellow" | "Orange" | "Red" | "NearIR";

export function bandName(nm: number): "uv" | "violet" | "blue" | "green" | "yellow" | "orange" | "red" | "nir" {
  if (nm < 380) return "uv";
  if (nm < 450) return "violet";
  if (nm < 495) return "blue";
  if (nm < 570) return "green";
  if (nm < 590) return "yellow";
  if (nm < 620) return "orange";
  if (nm <= 750) return "red";
  return "nir";
}

/** physical emission wavelength (200–850 nm) → approximate visible RGB */
export function wavelengthToRGB(nm: number): { r: number; g: number; b: number; css: string } {
  let r = 0;
  let g = 0;
  let b = 0;
  let factor = 1.0;

  if (nm >= 200 && nm < 380) {
    // ultraviolet — rendered as a deep violet indicator
    r = 0.62;
    g = 0.18;
    b = 0.98;
    factor = 0.65 + 0.25 * ((nm - 200) / 180);
  } else if (nm < 440) {
    r = -(nm - 440) / 60;
    g = 0;
    b = 1;
    factor = 0.45 + (0.55 * (nm - 380)) / 60;
  } else if (nm < 490) {
    r = 0;
    g = (nm - 440) / 50;
    b = 1;
  } else if (nm < 510) {
    r = 0;
    g = 1;
    b = -(nm - 510) / 20;
  } else if (nm < 580) {
    r = (nm - 510) / 70;
    g = 1;
    b = 0;
  } else if (nm < 645) {
    r = 1;
    g = -(nm - 645) / 65;
    b = 0;
  } else if (nm <= 750) {
    r = 1;
    g = 0;
    b = 0;
    if (nm > 700) factor = 0.55 + (0.45 * (750 - nm)) / 50;
  } else {
    // near-infrared — rendered as a deep crimson indicator
    r = 0.95;
    g = 0.16;
    b = 0.28;
    factor = 0.68;
  }

  const R = Math.round(255 * Math.pow(Math.max(0, r * factor), 0.85));
  const G = Math.round(255 * Math.pow(Math.max(0, g * factor), 0.85));
  const B = Math.round(255 * Math.pow(Math.max(0, b * factor), 0.85));
  return { r: R, g: G, b: B, css: `rgb(${R}, ${G}, ${B})` };
}

export function photonEnergyEv(nm: number): number {
  return 1239.842 / nm;
}

/** NIST-backed emission-line canvas, 200–850 nm (UV → visible → NIR) */
export function drawSpectrum(
  canvas: HTMLCanvasElement,
  element: QuantumElement,
  highlightNm: number | null = null,
): void {
  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0) return;
  const width = Math.max(260, rect.width);
  const height = Math.max(36, rect.height);
  canvas.width = width * (window.devicePixelRatio || 1);
  canvas.height = height * (window.devicePixelRatio || 1);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

  ctx.fillStyle = "#040711";
  ctx.fillRect(0, 0, width, height);

  // faint continuous-spectrum background strip
  for (let x = 0; x < width; x++) {
    const nm = SPEC_MIN_NM + (x / width) * (SPEC_MAX_NM - SPEC_MIN_NM);
    const c = wavelengthToRGB(nm);
    ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, 0.08)`;
    ctx.fillRect(x, 0, 1, height);
    ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, 0.45)`;
    ctx.fillRect(x, height - 3, 1, 3);
  }

  ctx.strokeStyle = "rgba(148, 163, 184, 0.14)";
  ctx.lineWidth = 1;
  for (let nm = 250; nm <= 800; nm += 50) {
    const x = ((nm - SPEC_MIN_NM) / (SPEC_MAX_NM - SPEC_MIN_NM)) * width;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height - 4);
    ctx.stroke();
  }

  if (!element.lines || element.lines.length === 0) {
    ctx.fillStyle = "rgba(15, 23, 42, 0.82)";
    ctx.fillRect(0, 0, width, height - 3);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "600 10px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("no experimental optical lines yet", width / 2, height / 2 - 1);
    return;
  }

  for (const nm of element.lines) {
    if (nm < SPEC_MIN_NM || nm > SPEC_MAX_NM) continue;
    const x = ((nm - SPEC_MIN_NM) / (SPEC_MAX_NM - SPEC_MIN_NM)) * width;
    const c = wavelengthToRGB(nm);
    const hovered = highlightNm !== null && Math.abs(nm - highlightNm) < 0.15;

    const grad = ctx.createLinearGradient(x - 7, 0, x + 7, 0);
    grad.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, 0)`);
    grad.addColorStop(0.5, `rgba(${c.r}, ${c.g}, ${c.b}, ${hovered ? 0.75 : 0.4})`);
    grad.addColorStop(1, `rgba(${c.r}, ${c.g}, ${c.b}, 0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(x - 7, 0, 14, height - 3);

    ctx.strokeStyle = hovered ? "#ffffff" : c.css;
    ctx.lineWidth = hovered ? 2.8 : 1.9;
    ctx.beginPath();
    ctx.moveTo(x, 1);
    ctx.lineTo(x, height - 3);
    ctx.stroke();
  }
}

