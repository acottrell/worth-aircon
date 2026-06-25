import { ImageResponse } from "next/og";

export const alt =
  "Worth Aircon? — See how many nights are too warm to sleep where you live.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(145deg, #faf6f0 0%, #f5ede0 50%, #f0e4d0 100%)",
          padding: "60px 80px",
        }}
      >
        <svg viewBox="0 0 32 32" width="72" height="72" fill="none">
          <rect
            x="12"
            y="3"
            width="8"
            height="18"
            rx="4"
            fill="#D9770620"
            stroke="#D97706"
            stroke-width="1.5"
          />
          <rect x="14" y="8" width="4" height="11" rx="2" fill="#D97706" />
          <circle cx="16" cy="24" r="5" fill="#D97706" />
          <path
            d="M24 8 C25.5 7 25.5 5 24 4"
            stroke="#D9770680"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <path
            d="M26 11 C27.5 10 27.5 8 26 7"
            stroke="#D9770650"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>

        <div
          style={{
            display: "flex",
            fontSize: "72px",
            fontWeight: 800,
            color: "#2d2418",
            letterSpacing: "-2px",
            lineHeight: 1,
            marginTop: "24px",
          }}
        >
          Worth Aircon
          <span style={{ color: "#D97706" }}>?</span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "28px",
            color: "#7a6b58",
            textAlign: "center",
            lineHeight: 1.4,
            maxWidth: "700px",
            marginTop: "20px",
          }}
        >
          See how many nights are too warm to sleep where you live
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "32px",
            marginTop: "48px",
            fontSize: "18px",
            color: "#a0916e",
          }}
        >
          <span>6 years of data</span>
          <span style={{ color: "#D97706" }}>·</span>
          <span>Free</span>
          <span style={{ color: "#D97706" }}>·</span>
          <span>Independent</span>
        </div>

        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: "32px",
            right: "48px",
            fontSize: "20px",
            fontWeight: 800,
            color: "#D97706",
            letterSpacing: "-0.5px",
          }}
        >
          worthaircon.com
        </div>
      </div>
    ),
    { ...size }
  );
}
