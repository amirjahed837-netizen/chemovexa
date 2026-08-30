export type MolAtom = { el: string; x: number; y: number; z: number };
export type MolBond = [number, number, 1 | 2 | 3];

export function toMolblock(title: string, atoms: MolAtom[], bonds: MolBond[]): string {
  const lines: string[] = [];
  lines.push(title.slice(0, 80));
  lines.push("  chem-portfolio");
  lines.push("");
  lines.push(
    `${String(atoms.length).padStart(3, " ")}${String(bonds.length).padStart(3, " ")}  0  0  0  0  0  0  0  0999 V2000`,
  );
  for (const a of atoms) {
    const c = (v: number) => v.toFixed(4).padStart(10, " ");
    lines.push(
      `${c(a.x)}${c(a.y)}${c(a.z)} ${a.el.padStart(3, " ")} 0  0  0  0  0  0  0  0  0  0  0  0`,
    );
  }
  for (const [i, j, order] of bonds) {
    lines.push(
      `${String(i + 1).padStart(3, " ")}${String(j + 1).padStart(3, " ")}${String(order).padStart(3, " ")}  0  0  0`,
    );
  }
  lines.push("M  END");
  return lines.join("\n");
}
