"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { profile } from "@/config/profile";
import { GlassCard } from "@/components/ui/GlassCard";
import { useI18n } from "@/lib/i18n";

type GhUser = {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  followers: number;
  following: number;
  public_repos: number;
  location: string | null;
  blog: string | null;
};

type GhRepo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  fork: boolean;
  homepage: string | null;
};

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  "Jupyter Notebook": "#DA5B0B",
  Java: "#b07219",
  C: "#555555",
};

function handle(): string {
  return profile.github.replace(/^https?:\/\/github\.com\//, "").replace(/\/$/, "");
}

export function GithubProfile() {
  const { t, fmt: interpolate } = useI18n();
  const g = t.pages.github;
  const [user, setUser] = useState<GhUser | null>(null);
  const [repos, setRepos] = useState<GhRepo[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const username = handle();

    async function load() {
      try {
        const [uRes, rRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(
            `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
          ),
        ]);
        if (cancelled) return;

        if (uRes.status === 404 || rRes.status === 404) {
          setError("not-found");
          return;
        }
        if (uRes.status === 403 || rRes.status === 403) {
          setError("rate-limit");
          return;
        }
        if (!uRes.ok || !rRes.ok) {
          setError("network");
          return;
        }

        const u = (await uRes.json()) as GhUser;
        const all = (await rRes.json()) as GhRepo[];
        if (cancelled) return;

        setUser(u);
        setRepos(
          all
            .filter((r) => !r.fork)
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 6),
        );
      } catch {
        if (!cancelled) setError("network");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  function relativeTime(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const days = Math.floor(diff / 86_400_000);
    if (days < 1) return g.today;
    if (days === 1) return g.yesterday;
    if (days < 30) return interpolate(g.daysAgo, { n: days });
    const months = Math.floor(days / 30);
    if (months < 12) return interpolate(g.monthsAgo, { n: months });
    return interpolate(g.yearsAgo, { n: Math.floor(months / 12) });
  }

  if (error) {
    return (
      <GlassCard className="mx-auto max-w-xl p-8 text-center">
        <span className="mb-4 inline-flex size-12 items-center justify-center rounded-full border border-amber-400/25 bg-amber-400/10 text-2xl">
          ⚠
        </span>
        <h3 className="font-display text-lg font-semibold text-white">
          {error === "not-found"
            ? g.errNotFound
            : error === "rate-limit"
              ? g.errRate
              : g.errNetwork}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {error === "not-found"
            ? interpolate(g.errNotFoundDesc, { user: handle() })
            : error === "rate-limit"
              ? g.errRateDesc
              : g.errNetworkDesc}
        </p>
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-400/40 hover:text-cyan-200"
        >
          {interpolate(g.openOnGithub, { user: handle() })}
        </a>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-10">
      {/* profile card */}
      <GlassCard className="flex flex-col items-start gap-6 p-7 sm:flex-row sm:items-center">
        {user ? (
          <>
            <Image
              src={user.avatar_url}
              alt={`${user.login} avatar`}
              width={88}
              height={88}
              unoptimized
              className="size-[88px] rounded-2xl border border-white/15"
            />
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-xl font-bold text-white">
                {user.name ?? user.login}
              </h2>
              <p className="font-mono text-sm text-cyan-300/90">@{user.login}</p>
              {user.bio && <p className="mt-2 max-w-lg text-sm text-slate-400">{user.bio}</p>}
            </div>
            <dl className="flex gap-7 font-mono text-sm">
              {[
                [g.repos, user.public_repos],
                [g.followers, user.followers],
                [g.following, user.following],
              ].map(([label, value]) => (
                <div key={label as string} className="text-center">
                  <dt className="order-2 text-[11px] uppercase tracking-wider text-slate-500">
                    {label}
                  </dt>
                  <dd className="order-1 font-display text-xl font-bold text-white">{value}</dd>
                </div>
              ))}
            </dl>
          </>
        ) : (
          <>
            <div className="size-[88px] animate-pulse rounded-2xl bg-white/5" />
            <div className="flex-1 space-y-2.5">
              <div className="h-5 w-44 animate-pulse rounded bg-white/5" />
              <div className="h-3.5 w-64 animate-pulse rounded bg-white/5" />
            </div>
          </>
        )}
      </GlassCard>

      {/* repos */}
      <section>
        <h3 className="mb-5 flex items-center gap-2.5 font-mono text-xs uppercase tracking-widest text-slate-500">
          <span className="inline-block size-1.5 rounded-full bg-cyan-300" />
          {g.topRepos}
        </h3>

        {repos === null && !error ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <GlassCard key={i} className="space-y-3 p-6">
                <div className="h-4 w-32 animate-pulse rounded bg-white/5" />
                <div className="h-3 w-full animate-pulse rounded bg-white/5" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-white/5" />
              </GlassCard>
            ))}
          </div>
        ) : repos && repos.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {repos.map((repo) => (
              <a key={repo.id} href={repo.html_url} target="_blank" rel="noopener noreferrer" className="group block h-full">
                <GlassCard interactive className="flex h-full flex-col p-5">
                  <h4 className="break-all font-mono text-sm font-semibold text-slate-100 transition-colors group-hover:text-cyan-300">
                    {repo.name}
                  </h4>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">
                    {repo.description ?? g.noDescription}
                  </p>
                  <div className="mt-auto flex items-center gap-4 pt-4 font-mono text-[11px] text-slate-500">
                    {repo.language && (
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className="size-2.5 rounded-full"
                          style={{ backgroundColor: LANGUAGE_COLORS[repo.language] ?? "#94a3b8" }}
                        />
                        {repo.language}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">★ {repo.stargazers_count}</span>
                    <span className="ml-auto">{relativeTime(repo.updated_at)}</span>
                  </div>
                </GlassCard>
              </a>
            ))}
          </div>
        ) : (
          repos && <p className="text-sm text-slate-500">{g.noRepos}</p>
        )}
      </section>

      <p className="text-center font-mono text-[11px] text-slate-600">{g.footer}</p>
    </div>
  );
}
