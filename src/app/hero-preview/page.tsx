import { Molecule3D } from "@/components/home/Molecule3D";

export const metadata = {
  title: "Hero 3D Preview — CHEMOVEXA",
};

export default function HeroPreviewPage() {
  return (
    <main className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-slate-950">
      <Molecule3D className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-slate-950/70" />
      <div className="relative z-10 text-center">
        <h1 className="font-display text-5xl font-bold text-white sm:text-7xl">
          Chemistry meets <span className="text-gradient">code.</span>
        </h1>
        <p className="mt-4 text-lg text-slate-400">3D hero preview — drag/Move the pointer</p>
      </div>
    </main>
  );
}
