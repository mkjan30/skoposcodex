import { ImageResponse } from "next/og";

import { site } from "@/content/site";

export const ogSize = { width: 1200, height: 630 };

// Shared Open Graph card: logo mark, eyebrow, page title, cyan→blue underline (Design Brief §7).
export function renderOgImage({ eyebrow, title }: { eyebrow: string; title: string }) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "radial-gradient(circle at 85% 0%, #0a2a5c 0%, #050816 60%)",
        color: "#fafafa",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <svg width="98" height="56" viewBox="470 135 596 340">
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#19e3ff" />
              <stop offset="1" stopColor="#0a6cff" />
            </linearGradient>
          </defs>
          <g fill="url(#g)">
            <polygon points="700,310 740,350 545,475 470,475" />
            <polygon points="745,352 791,352 870,475 666,475" />
            <polygon points="836,310 796,350 991,475 1066,475" />
            <polygon points="745,200 791,200 791,345 745,345" />
            <polygon points="768,135 905,290 845,290 768,213 691,290 631,290" />
          </g>
        </svg>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
          <span style={{ fontSize: 34, fontWeight: 800, letterSpacing: 1 }}>SKOPOS</span>
          <span style={{ fontSize: 20, letterSpacing: 12, marginTop: 6 }}>CODEX</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span
          style={{ fontSize: 26, color: "#19e3ff", letterSpacing: 4, textTransform: "uppercase" }}
        >
          {eyebrow}
        </span>
        <span style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.1, marginTop: 16 }}>
          {title}
        </span>
        <div
          style={{
            width: 180,
            height: 8,
            marginTop: 32,
            borderRadius: 4,
            background: "linear-gradient(90deg, #19e3ff, #2b8cff)",
          }}
        />
      </div>
      <span style={{ fontSize: 22, color: "#9fb3c8" }}>{site.url.replace(/^https?:\/\//, "")}</span>
    </div>,
    ogSize,
  );
}
