import { C, STEPS } from "../data/constants.js";

export default function Stepper({ step, onNavigate }) {
  return (
    // Stretch full width — connector lines flex to fill the space
    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
      {STEPS.map((s, i) => {
        const active   = i === step;
        const done     = i < step;
        const canClick = done;

        return (
          <div key={s.id} style={{
            display: "flex", alignItems: "center",
            // Each step + connector takes equal share; last step has no connector so slightly less
            flex: i < STEPS.length - 1 ? 1 : "none",
          }}>
            <button
              onClick={() => canClick && onNavigate(i)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "none", border: "none",
                cursor: canClick ? "pointer" : "default",
                padding: "4px 0", fontFamily: "inherit",
                flexShrink: 0,
              }}
            >
              {/* Circle */}
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, flexShrink: 0,
                background: active ? C.purple : done ? C.green : C.grey200,
                color: active || done ? C.white : C.grey500,
                transition: "background 0.2s",
              }}>
                {done
                  ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  : i + 1}
              </div>
              {/* Label */}
              <span style={{
                fontSize: 13, whiteSpace: "nowrap",
                fontWeight: active ? 700 : done ? 500 : 400,
                color: active ? C.purple : done ? C.grey700 : C.grey400,
                transition: "color 0.2s",
              }}>
                {s.label}
              </span>
            </button>

            {/* Connector line — flex grows to fill remaining space */}
            {i < STEPS.length - 1 && (
              <div style={{
                flex: 1,
                height: 2,
                margin: "0 12px",
                background: i < step ? C.purple : C.grey200,
                transition: "background 0.2s",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
