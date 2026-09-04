/**
 * Mechanism Library — data model.
 * Every organic reaction mechanism distilled from the reference material
 * (Persian lecture notes: alkenes/alkynes, benzene & aromatics, aldehydes &
 * ketones, carboxylic acids & derivatives — plus McMurry 11e chapters).
 * All human text is bilingual inline: { en, fa }.
 */

export type Bi = { en: string; fa: string };
export type BiList = { en: string[]; fa: string[] };

export type MechStep = {
  label: Bi;
  detail: Bi;
};

export type MechExample = {
  name: Bi;
  /** Plain-text equation, always rendered LTR */
  equation: string;
};

export type FamilyId =
  | "electrophilic-addition"
  | "nucleophilic-addition"
  | "eas"
  | "acyl-substitution"
  | "substitution"
  | "elimination"
  | "radical"
  | "enolate"
  | "redox"
  | "acidbase";

export type TopicId =
  | "foundations"
  | "alkenes"
  | "alkynes"
  | "aromatics"
  | "carbonyl"
  | "acyl";

export type Mechanism = {
  id: string;
  family: FamilyId;
  topic: TopicId;
  source: Bi;
  tags: BiList;
  en: {
    title: string;
    summary: string;
    /** General (generic) equation of the mechanism */
    general: string;
    steps: { label: string; detail: string }[];
    keyPoints: string[];
    conditions: string;
  };
  fa: {
    title: string;
    summary: string;
    general: string;
    steps: { label: string; detail: string }[];
    keyPoints: string[];
    conditions: string;
  };
  examples: MechExample[];
  /** ids in src/lib/chem/book-reactions.ts that run by this mechanism */
  related?: string[];
};

export const FAMILY_LABEL: Record<FamilyId, Bi> = {
  "electrophilic-addition": { en: "Electrophilic addition", fa: "افزایش الکترون‌خواهی" },
  "nucleophilic-addition": { en: "Nucleophilic addition (C=O)", fa: "افزایش هسته‌خواهی به C=O" },
  eas: { en: "Electrophilic aromatic substitution", fa: "جانشینی الکترون‌خواهی آروماتیک" },
  "acyl-substitution": { en: "Nucleophilic acyl substitution", fa: "جانشینی هسته‌خواهی اسیدیل" },
  substitution: { en: "Substitution (SN1/SN2)", fa: "جانشینی (SN1/SN2)" },
  elimination: { en: "Elimination (E1/E2)", fa: "حذف (E1/E2)" },
  radical: { en: "Radical", fa: "رادیکالی" },
  enolate: { en: "Enol / enolate", fa: "انول / انولات" },
  redox: { en: "Oxidation–reduction", fa: "اکسایش–کاهش" },
  acidbase: { en: "Acid–base", fa: "اسید–باز" },
};

export const TOPIC_LABEL: Record<TopicId, Bi> = {
  foundations: { en: "Foundations — alkyl halides", fa: "مبانی — هالیدهای آلکیل" },
  alkenes: { en: "Alkenes", fa: "آلکن‌ها" },
  alkynes: { en: "Alkynes", fa: "آلکین‌ها" },
  aromatics: { en: "Benzene & aromatics", fa: "بنزن و ترکیبات آروماتیک" },
  carbonyl: { en: "Aldehydes & ketones", fa: "آلدهید و کتون‌ها" },
  acyl: { en: "Carboxylic acids & derivatives", fa: "کربوکسیلیک اسیدها و مشتقات" },
};

export const FAMILY_COLOR: Record<FamilyId, string> = {
  "electrophilic-addition": "text-cyan-300 border-cyan-400/30 bg-cyan-400/10",
  "nucleophilic-addition": "text-violet-300 border-violet-400/30 bg-violet-400/10",
  eas: "text-amber-300 border-amber-400/30 bg-amber-400/10",
  "acyl-substitution": "text-emerald-300 border-emerald-400/30 bg-emerald-400/10",
  substitution: "text-sky-300 border-sky-400/30 bg-sky-400/10",
  elimination: "text-rose-300 border-rose-400/30 bg-rose-400/10",
  radical: "text-orange-300 border-orange-400/30 bg-orange-400/10",
  enolate: "text-fuchsia-300 border-fuchsia-400/30 bg-fuchsia-400/10",
  redox: "text-lime-300 border-lime-400/30 bg-lime-400/10",
  acidbase: "text-teal-300 border-teal-400/30 bg-teal-400/10",
};
