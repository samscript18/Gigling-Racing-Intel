import { ImageResponse } from "next/og";

import { appEnv } from "@/lib/config/env";

export const alt = "Gigling Racing Intel dashboard preview";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          backgroundColor: "#05070d",
          backgroundImage:
            "radial-gradient(circle at 18% 18%, rgba(32,247,255,0.28), transparent 30%), radial-gradient(circle at 82% 16%, rgba(168,85,247,0.25), transparent 28%), radial-gradient(circle at 78% 82%, rgba(255,138,31,0.22), transparent 30%)",
          color: "white",
          display: "flex",
          fontFamily: "Arial, sans-serif",
          height: "100%",
          justifyContent: "center",
          padding: 64,
          width: "100%"
        }}
      >
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.16)",
            borderRadius: 24,
            boxShadow: "0 40px 120px rgba(0,0,0,0.35)",
            display: "flex",
            flexDirection: "column",
            gap: 28,
            height: "100%",
            justifyContent: "space-between",
            padding: 52,
            width: "100%"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div
              style={{
                alignItems: "center",
                border: "1px solid rgba(32,247,255,0.45)",
                borderRadius: 16,
                color: "#20F7FF",
                display: "flex",
                fontSize: 28,
                fontWeight: 900,
                height: 82,
                justifyContent: "center",
                letterSpacing: 6,
                width: 82
              }}
            >
              GRI
            </div>
            <div
              style={{
                border: "1px solid rgba(255,138,31,0.4)",
                borderRadius: 999,
                color: "#FF8A1F",
                fontSize: 22,
                fontWeight: 800,
                padding: "18px 26px"
              }}
            >
              GIGATHON 1
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ color: "#20F7FF", fontSize: 28, fontWeight: 800 }}>
              The intelligence layer for Gigling Racing.
            </div>
            <div style={{ fontSize: 78, fontWeight: 950, lineHeight: 0.95 }}>
              {appEnv.appName}
            </div>
            <div style={{ color: "rgba(255,255,255,0.72)", fontSize: 30, lineHeight: 1.35 }}>
              Inspect Giglings. Analyze races. Predict outcomes. Track rivals.
            </div>
          </div>
          <div style={{ display: "flex", gap: 18 }}>
            {["Race Intel", "Meta Shifts", "Stable Manager", "Reports"].map((label) => (
              <div
                key={label}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  borderRadius: 14,
                  color: "rgba(255,255,255,0.78)",
                  fontSize: 22,
                  fontWeight: 800,
                  padding: "16px 18px"
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}
