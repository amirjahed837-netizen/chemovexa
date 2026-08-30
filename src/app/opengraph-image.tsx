import { ImageResponse } from "next/og";
import { profile } from "@/config/profile";

export const alt = `${profile.name} — Chemistry meets Code`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

const ACCENT = "#22d3ee";
const ACCENT2 = "#60a5fa";
const ACCENT3 = "#818cf8";
const BG = "#04070f";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: `radial-gradient(ellipse at 20% 0%, ${ACCENT}15, transparent 50%), radial-gradient(ellipse at 100% 100%, ${ACCENT2}15, transparent 50%), ${BG}`,
          color: "#f0fdff",
          fontFamily: "sans-serif",
          padding: 64,
        }}
      >
        {/* top bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <svg
            viewBox="0 0 40 40"
            width="48"
            height="48"
            style={{ display: "block" }}
          >
            <defs>
              <linearGradient id="og-g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={ACCENT} />
                <stop offset="100%" stopColor={ACCENT2} />
              </linearGradient>
            </defs>
            <polygon
              points="20,4 33.86,12 33.86,28 20,36 6.14,28 6.14,12"
              fill="none"
              stroke="url(#og-g)"
              strokeWidth="2.6"
              strokeLinejoin="round"
            />
            <circle cx="20" cy="20" r="3.4" fill="url(#og-g)" />
            <ellipse
              cx="20"
              cy="20"
              rx="12"
              ry="5"
              fill="none"
              stroke={ACCENT}
              strokeOpacity="0.6"
              strokeWidth="1.4"
              transform="rotate(-30 20 20)"
            />
            <circle cx="31" cy="14.5" r="1.9" fill={ACCENT} />
          </svg>
          <div style={{ display: "flex", fontSize: 22, color: "#cbd5e1" }}>
            {profile.name.split(" ")[0]}.lab
          </div>
        </div>

        {/* main headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "auto",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 96,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              color: "#ffffff",
            }}
          >
            Chemistry meets{" "}
            <span
              style={{
                background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT2})`,
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Code.
            </span>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 28,
              color: "#94a3b8",
              maxWidth: 1000,
            }}
          >
            {profile.tagline}
          </div>
        </div>

        {/* bottom domain chips */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: "auto",
          }}
        >
          {[
            { label: "Chemistry", color: ACCENT },
            { label: "Programming", color: ACCENT2 },
            { label: "Research", color: ACCENT3 },
            { label: "AI", color: "#c084fc" },
          ].map((c) => (
            <div
              key={c.label}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 22px",
                borderRadius: 999,
                fontSize: 22,
                fontWeight: 500,
                color: c.color,
                background: `${c.color}18`,
                border: `1.5px solid ${c.color}50`,
              }}
            >
              {c.label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
