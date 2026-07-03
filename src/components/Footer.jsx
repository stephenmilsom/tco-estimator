import { C } from "../data/constants.js";

export default function Footer({ maxWidth = 1440 }) {
  return (
    <footer style={{
      borderTop: `1px solid ${C.grey200}`,
      height: 40,
      flexShrink: 0,
      background: C.white,
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
        <span style={{ fontSize: 12, color: C.grey400 }}>
          © 2026 Infor Value Engineering. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
