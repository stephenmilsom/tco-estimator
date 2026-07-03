import { C } from "../data/constants.js";

export default function TopBar({ maxWidth = 1440 }) {
  return (
    <header style={{
      background: C.white,
      borderBottom: `1px solid ${C.grey200}`,
      height: 56,
      flexShrink: 0,
    }}>
      <div style={{
        maxWidth,
        margin: "0 auto",
        height: "100%",
        display: "flex",
        alignItems: "center",
        padding: "0 40px",
        boxSizing: "border-box",
      }}>
        <svg width="60" height="22" viewBox="0 0 60 22" aria-label="Infor">
          <text x="0" y="19" fontFamily="'Inter', Arial, sans-serif" fontWeight="900" fontSize="22" fill={C.red} letterSpacing="-1">infor</text>
        </svg>
        <div style={{ width: 1, height: 22, background: C.grey300, margin: "0 16px" }} />
        <span style={{ fontSize: 14, fontWeight: 700, color: C.purple, letterSpacing: "-0.01em" }}>Value</span>
        <span style={{ fontSize: 14, fontWeight: 300, color: C.purple, letterSpacing: "0.08em", textTransform: "uppercase", marginLeft: 4 }}>Lab</span>
        <div style={{ width: 1, height: 22, background: C.grey300, margin: "0 16px" }} />
        <span style={{ fontSize: 14, fontWeight: 400, color: C.grey900 }}>TCO Estimator</span>
      </div>
    </header>
  );
}
