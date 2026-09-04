"use client";

import { profile } from "@/config/profile";
import {
  EDUCATION,
  EXPERIENCE,
  SKILL_GROUPS,
  CERTIFICATIONS,
  LANGUAGES,
  INTERESTS,
} from "@/config/cv";
import { useI18n } from "@/lib/i18n";
import { SKILL_NAME_FA } from "@/lib/i18n/data-fa";

function CvSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <h2 className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyan-300/90">
        {title}
      </h2>
      <div className="cv-line mt-3 border-t pt-4">{children}</div>
    </section>
  );
}

function CvEntry({
  period,
  title,
  org,
  detail,
  current,
  currentLabel,
}: {
  period: string;
  title: string;
  org: string;
  detail?: string;
  current?: boolean;
  currentLabel?: string;
}) {
  return (
    <article className="mb-5 last:mb-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h3 className="font-semibold text-[15px] cv-strong">{title}</h3>
        <span className="font-mono text-xs cv-muted">{period}</span>
      </div>
      <p className="mt-0.5 text-sm cv-muted">
        {org}
        {current && <span className="cv-accent ml-2 text-xs font-medium">● {currentLabel}</span>}
      </p>
      {detail && <p className="mt-1.5 text-[13px] leading-relaxed cv-muted">{detail}</p>}
    </article>
  );
}

export function CVDocument() {
  const { t, locale } = useI18n();
  const d = t.pages.cv.doc;

  // Persian locale uses translated CV content; English uses the config data
  const education = locale === "fa" ? t.cvData.education : EDUCATION;
  const experience = locale === "fa" ? t.cvData.experience : EXPERIENCE;
  const certFa: Record<string, string> = {
    "Laboratory Safety Training": "آموزش ایمنی آزمایشگاه",
    "English Proficiency — C1": "تسلط به زبان انگلیسی — C1",
  };
  const interestsFa = [
    "شیمی محاسباتی",
    "کموانفورماتیک",
    "هوش مصنوعی برای علوم",
    "تجسم مولکولی",
    "متن‌باز",
    "علم‌رسانی",
  ];
  const interests = locale === "fa" ? interestsFa : INTERESTS;

  return (
    <div className="cv-doc glass rounded-2xl border border-white/10 p-8 shadow-2xl sm:p-11">
      {/* header */}
      <header>
        <h1 className="font-display text-3xl font-bold tracking-tight cv-strong sm:text-4xl">
          {profile.name}
        </h1>
        <p className="font-display mt-1.5 text-base font-medium uppercase tracking-[0.18em] cv-accent">
          {profile.role}
        </p>
        <p className="mt-3 flex flex-wrap gap-x-2 gap-y-1 font-mono text-xs cv-muted">
          <span>{profile.email}</span>
          <span aria-hidden>·</span>
          <span>{profile.github.replace("https://", "")}</span>
          <span aria-hidden>·</span>
          <span>{profile.location}</span>
        </p>
      </header>

      <CvSection title={d.profile}>
        <p className="text-sm leading-relaxed cv-muted">{profile.bio.join(" ")}</p>
      </CvSection>

      <CvSection title={d.education}>
        {education.map((item) => (
          <CvEntry
            key={item.title + item.period}
            {...item}
            currentLabel={d.current}
          />
        ))}
      </CvSection>

      <CvSection title={d.experience}>
        {experience.map((item) => (
          <CvEntry
            key={item.title + item.period}
            {...item}
            currentLabel={d.current}
          />
        ))}
      </CvSection>

      <CvSection title={d.skills}>
        <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {SKILL_GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider cv-strong">
                {locale === "fa"
                  ? ({
                      Chemistry: "شیمی",
                      Programming: "برنامه‌نویسی",
                      "Data & AI": "داده و هوش مصنوعی",
                      "Scientific Tools": "ابزارهای علمی",
                    }[group.title] ?? group.title)
                  : group.title}
              </h3>
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {group.tiles.map((tile) => (
                  <li
                    key={tile.symbol}
                    className={`rounded px-2 py-0.5 text-xs cv-chip ${
                      tile.level === "core" ? "cv-accent font-medium" : ""
                    }`}
                  >
                    {locale === "fa" ? (SKILL_NAME_FA[tile.name] ?? tile.name) : tile.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CvSection>

      <CvSection title={d.certifications}>
        <ul className="space-y-1.5">
          {CERTIFICATIONS.map((cert) => (
            <li key={cert.title} className="flex flex-wrap items-baseline justify-between gap-x-4 text-sm">
              <span>
                <span className="cv-strong">
                  {locale === "fa" ? (certFa[cert.title] ?? cert.title) : cert.title}
                </span>{" "}
                <span className="cv-muted">— {cert.issuer}</span>
              </span>
              <span className="font-mono text-xs cv-muted">{cert.year}</span>
            </li>
          ))}
        </ul>
      </CvSection>

      <CvSection title={d.languages}>
        <ul className="flex flex-wrap gap-x-6 gap-y-1.5">
          {LANGUAGES.map((lang) => (
            <li key={lang.name} className="text-sm">
              <span className="cv-strong">
                {locale === "fa"
                  ? ({ Persian: "فارسی", English: "انگلیسی" }[lang.name] ?? lang.name)
                  : lang.name}
              </span>{" "}
              <span className="cv-muted">
                ·{" "}
                {locale === "fa"
                  ? ({ Native: "زبان مادری", "Professional — C1": "حرفه‌ای — C1" }[lang.level] ??
                    lang.level)
                  : lang.level}
              </span>
            </li>
          ))}
        </ul>
      </CvSection>

      <CvSection title={d.interests}>
        <p className="text-sm cv-muted">{interests.join(locale === "fa" ? " · " : " · ")}</p>
      </CvSection>

      <footer className="cv-line mt-9 border-t pt-4">
        <p className="font-mono text-[10px] cv-muted">{d.footer}</p>
      </footer>
    </div>
  );
}
