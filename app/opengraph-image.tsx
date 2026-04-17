import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Meridian — One account for every kind of money";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function og() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#FAFAF7",
          color: "#0A0A0A",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 2, textTransform: "uppercase", opacity: 0.6 }}>Meridian</div>
        <div style={{ fontSize: 88, lineHeight: 1.05, fontWeight: 700, maxWidth: 900 }}>
          One account for <span style={{ fontStyle: "italic", color: "#0B8A4A" }}>every</span> kind of money.
        </div>
        <div style={{ fontSize: 24, opacity: 0.7 }}>Treasury · Trading · Crypto — in a single ledger</div>
      </div>
    ),
    { ...size }
  );
}
