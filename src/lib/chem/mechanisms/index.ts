import type { Mechanism } from "./types";
import { FOUNDATION_MECHANISMS } from "./foundations";
import { ALKENE_MECHANISMS } from "./alkenes-alkynes";
import { AROMATIC_MECHANISMS } from "./aromatics";
import { CARBONYL_MECHANISMS } from "./carbonyl";
import { ACYL_MECHANISMS } from "./acyl";
import type { FamilyId, TopicId } from "./types";

export type { Mechanism, FamilyId, TopicId } from "./types";
export * from "./types";

export const MECHANISMS: Mechanism[] = [
  ...FOUNDATION_MECHANISMS,
  ...ALKENE_MECHANISMS,
  ...AROMATIC_MECHANISMS,
  ...CARBONYL_MECHANISMS,
  ...ACYL_MECHANISMS,
];

export const getMechanism = (id: string) => MECHANISMS.find((m) => m.id === id);

export const TOPIC_ORDER: TopicId[] = [
  "foundations",
  "alkenes",
  "alkynes",
  "aromatics",
  "carbonyl",
  "acyl",
];

export const FAMILY_ORDER: FamilyId[] = [
  "electrophilic-addition",
  "nucleophilic-addition",
  "eas",
  "acyl-substitution",
  "substitution",
  "elimination",
  "radical",
  "enolate",
  "redox",
  "acidbase",
];

export const byTopic = (t: TopicId) => MECHANISMS.filter((m) => m.topic === t);

export const byFamily = (f: FamilyId) => MECHANISMS.filter((m) => m.family === f);

/** localized accessors */
export const mechTitle = (m: Mechanism, locale: string) =>
  locale === "fa" ? m.fa.title : m.en.title;
export const mechSummary = (m: Mechanism, locale: string) =>
  locale === "fa" ? m.fa.summary : m.en.summary;
export const mechSteps = (m: Mechanism, locale: string) =>
  locale === "fa" ? m.fa.steps : m.en.steps;
export const mechKeyPoints = (m: Mechanism, locale: string) =>
  locale === "fa" ? m.fa.keyPoints : m.en.keyPoints;
export const mechConditions = (m: Mechanism, locale: string) =>
  locale === "fa" ? m.fa.conditions : m.en.conditions;
export const mechSource = (m: Mechanism, locale: string) =>
  locale === "fa" ? m.source.fa : m.source.en;
