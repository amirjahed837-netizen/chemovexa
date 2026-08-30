import type { Domain } from "@/config/site";
import type { Tool } from "@/config/site";

/** Minimal inline icon set (stroke-based, 24×24). */
export function DomainIcon({
  name,
  className,
}: {
  name: Domain["icon"] | Tool["icon"];
  className?: string;
}) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    viewBox: "0 0 24 24",
    className,
    "aria-hidden": true,
  };

  switch (name) {
    case "flask":
      return (
        <svg {...common}>
          <path d="M9 3h6M10 3v5.2a2 2 0 0 1-.34 1.11L4.6 17.4A2 2 0 0 0 6.28 20.5h11.44a2 2 0 0 0 1.68-3.1L14.34 9.3A2 2 0 0 1 14 8.2V3" />
          <path d="M7.5 14.5h9" />
        </svg>
      );
    case "code":
      return (
        <svg {...common}>
          <path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16" />
        </svg>
      );
    case "book":
      return (
        <svg {...common}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13Z" />
          <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
          <path d="M9 8h7M9 11.5h5" />
        </svg>
      );
    case "spark":
      return (
        <svg {...common}>
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
          <circle cx="12" cy="12" r="3.2" />
        </svg>
      );
    case "calc":
      return (
        <svg {...common}>
          <rect x="5" y="3" width="14" height="18" rx="2" />
          <path d="M8.5 7h7M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 16h.01M12 16h.01M15.5 16h.01" />
        </svg>
      );
    case "molecule":
      return (
        <svg {...common}>
          <circle cx="12" cy="5" r="2" />
          <circle cx="5" cy="17" r="2" />
          <circle cx="19" cy="17" r="2" />
          <circle cx="12" cy="13" r="2.4" />
          <path d="M10.8 11.2 9.5 6.8M13.2 11.2l1.3-4.4M10 14.4 6.4 16.2M14 14.4l3.6 1.8" />
        </svg>
      );
    case "lab":
      return (
        <svg {...common}>
          <path d="M11 21c-4 0-7-1-7-2.5S7 16 11 16s7 1 7 2.5S15 21 11 21Z" />
          <path d="M4.2 18.5C3.5 16.8 4 13 7 9c1.5-2 2-3.5 2-5h4c0 1.5.5 3 2 5 3 4 3.5 7.8 2.8 9.5" />
          <path d="M9 4V2h4v2" />
        </svg>
      );
  }
}

/** Brand mark: benzene-style hexagon with orbiting electron dot. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
      </defs>
      <polygon
        points="20,4 33.86,12 33.86,28 20,36 6.14,28 6.14,12"
        fill="none"
        stroke="url(#logo-g)"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="20" r="3.2" fill="url(#logo-g)" />
      <ellipse
        cx="20"
        cy="20"
        rx="12"
        ry="5"
        fill="none"
        stroke="#22d3ee"
        strokeOpacity="0.5"
        strokeWidth="1.2"
        transform="rotate(-30 20 20)"
      />
      <circle cx="31" cy="14.5" r="1.8" fill="#67e8f9" />
    </svg>
  );
}
