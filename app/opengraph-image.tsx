import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const alt = "WVRNER | Nima Hosseini - Cloud / DevOps Engineer";

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
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0A0A0A",
          padding: "56px 64px",
          color: "#FFFFFF",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle geometric perimeter border */}
        <div
          style={{
            position: "absolute",
            inset: "24px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            pointerEvents: "none",
          }}
        />

        {/* Top Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#EDEDED",
            }}
          >
            WVRNER
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#888888",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#FFFFFF",
                display: "flex",
                marginRight: "8px",
              }}
            />
            DETERMINISTIC SYSTEMS
          </div>
        </div>

        {/* Center Main Stage */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: 14,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "#888888",
              fontWeight: 600,
            }}
          >
            PORTFOLIO &amp; LABS
          </div>
          <div
            style={{
              fontSize: 76,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.02,
              color: "#FFFFFF",
            }}
          >
            Nima Hosseini
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 500,
              color: "#A3A3A3",
              letterSpacing: "-0.02em",
            }}
          >
            Cloud / DevOps Engineer
          </div>
        </div>

        {/* Bottom Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
            paddingTop: "24px",
          }}
        >
          <div
            style={{
              fontSize: 14,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#888888",
              fontFamily: "monospace",
            }}
          >
            AWS · Terraform · Kubernetes · Docker · CI/CD
          </div>
          <div
            style={{
              fontSize: 14,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#EDEDED",
              fontWeight: 600,
            }}
          >
            wvrner.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
