import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "BC Automations";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0D1B3E",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top header bar */}
        <div
          style={{
            width: "100%",
            height: "72px",
            display: "flex",
            alignItems: "center",
            padding: "0 56px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <span
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "rgba(255,255,255,0.9)",
              letterSpacing: "-0.02em",
            }}
          >
            master team
          </span>
          <span
            style={{
              marginLeft: "auto",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.45)",
            }}
          >
            AUTOMATION TEMPLATES
          </span>
        </div>

        {/* Main content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 56px",
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "2px",
                background: "#4A5AE8",
                borderRadius: "2px",
              }}
            />
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                color: "#4A5AE8",
              }}
            >
              BUSINESS CONSULTING
            </span>
          </div>

          {/* Title */}
          <div
            style={{
              display: "flex",
              fontSize: "52px",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              marginBottom: "16px",
            }}
          >
            <span style={{ color: "#FFFFFF" }}>BC </span>
            <span style={{ color: "#4A5AE8" }}>Automations</span>
          </div>

          {/* Subtitle */}
          <span
            style={{
              fontSize: "18px",
              fontWeight: 400,
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.6,
              maxWidth: "500px",
              marginBottom: "48px",
            }}
          >
            AI-powered automation templates for user manuals, test cases, notifications, and business process documentation.
          </span>

          {/* Gradient divider */}
          <div
            style={{
              width: "56px",
              height: "3px",
              background: "linear-gradient(90deg, #3540DA 0%, #4A5AE8 100%)",
              borderRadius: "3px",
              marginBottom: "32px",
            }}
          />

          {/* Meta grid */}
          <div
            style={{
              display: "flex",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "16px 24px",
                borderRight: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", marginBottom: "6px" }}>
                TEMPLATES
              </span>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
                24 Automations
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "16px 24px",
                borderRight: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", marginBottom: "6px" }}>
                AUTHOR
              </span>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
                Khalil
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "16px 24px",
              }}
            >
              <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", marginBottom: "6px" }}>
                POWERED BY
              </span>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
                Claude AI
              </span>
            </div>
          </div>
        </div>

        {/* Footer bar */}
        <div
          style={{
            width: "100%",
            height: "48px",
            display: "flex",
            alignItems: "center",
            padding: "0 56px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <span style={{ fontSize: "11px", fontWeight: 500, color: "rgba(255,255,255,0.35)" }}>
            2026 Master team. All rights reserved.
          </span>
          <span style={{ marginLeft: "auto", fontSize: "11px", fontWeight: 500, color: "rgba(255,255,255,0.35)" }}>
            bc-automations.click
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
