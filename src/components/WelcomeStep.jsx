import { C } from "../data/constants.js";

const HERO_IMG = "https://dam.infor.com/api/public/content/a9848c2935ed4351a44843d4c6abcaf8?v=02e68387";

export default function WelcomeStep({ maxWidth = 1440 }) {
  return (
    // Outer: full bleed background
    <div style={{
      width: "100%",
      minHeight: "inherit",
      background: C.grey50,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background image fills full bleed — visual goes edge to edge */}
      <img
        src={HERO_IMG}
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0, right: 0,
          height: "100%", width: "65%",
          objectFit: "cover",
          objectPosition: "left center",
        }}
      />

      {/* Fade gradient */}
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(90deg, ${C.grey50} 38%, ${C.grey50}cc 52%, transparent 68%)`,
        zIndex: 1,
      }} />

      {/* Inner: constrained to maxWidth, centred */}
      <div style={{
        maxWidth,
        margin: "0 auto",
        minHeight: "inherit",
        position: "relative",
        zIndex: 2,
        display: "flex",
        alignItems: "center",
        padding: "0 40px",
        boxSizing: "border-box",
      }}>
        {/* Left content */}
        <div style={{ width: "52%", padding: "60px 0" }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: C.red,
            letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20,
          }}>
            IT Benchmarking Suite · Infor Value Lab
          </div>

          <h1 style={{
            fontSize: 52, fontWeight: 900, color: C.black,
            lineHeight: 1.05, letterSpacing: "-0.03em", margin: "0 0 28px",
          }}>
            Build a credible,{" "}
            <span style={{ color: C.purple }}>data-driven TCO</span>{" "}
            in minutes.
          </h1>

          <p style={{ fontSize: 18, color: C.grey700, lineHeight: 1.7, marginBottom: 16, maxWidth: 520 }}>
            Use Gartner IT spend benchmarks to model your prospect's on-premise
            costs — then compare them directly against your Infor CloudSuite proposal.
          </p>
          <p style={{ fontSize: 18, color: C.grey700, lineHeight: 1.7, marginBottom: 44, maxWidth: 520 }}>
            Five tabs. Five minutes. A board-ready TCO.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 24px", maxWidth: 520 }}>
            {[
              "Prospect revenue & industry",
              "Proposed Infor ACV",
              "Current ERP maintenance cost",
              "Implementation project estimate",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%",
                  background: C.purpleLight,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2 2 4-4" stroke={C.purple} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ fontSize: 14, color: C.grey700 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stat cards — positioned relative to the constrained inner div */}
        <div style={{
          position: "absolute",
          right: 40,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          width: 230,
        }}>
          {[
            { label: "average on-premise IT spend", value: "1.5%",    sub: "of revenue · Gartner benchmark" },
            { label: "typical 5-year cloud saving",  value: "30–40%", sub: "vs on-premise TCO" },
            { label: "minutes to complete",           value: "< 5",   sub: "with this tool" },
          ].map((card, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.92)",
              border: `1px solid ${C.grey200}`,
              borderRadius: 14, padding: "18px 20px",
              boxShadow: "0 4px 20px rgba(107,47,160,0.12)",
            }}>
              <div style={{ fontSize: 10, color: C.grey500, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>
                {card.label}
              </div>
              <div style={{ fontSize: 30, fontWeight: 800, color: C.purple, letterSpacing: "-0.03em", lineHeight: 1 }}>
                {card.value}
              </div>
              <div style={{ fontSize: 11, color: C.grey500, marginTop: 4 }}>{card.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
