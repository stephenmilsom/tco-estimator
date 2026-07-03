import { C, STEPS } from "../data/constants.js";

export default function StepNav({ step, onBack, onNext, onReset, onRestart, canProceed }) {
  const isFirst = step === 0;
  const isLast  = step === STEPS.length - 1;

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", marginLeft: "auto" }}>
      <button onClick={onReset} style={{
        background: "none", border: `1px solid ${C.grey300}`,
        borderRadius: 8, padding: "8px 18px",
        fontSize: 13, color: C.grey500,
        cursor: "pointer", fontFamily: "inherit",
      }}>
        Reset
      </button>

      {!isFirst && (
        <button onClick={onBack} style={{
          background: "none", border: `1px solid ${C.grey300}`,
          borderRadius: 8, padding: "8px 18px",
          fontSize: 13, color: C.grey700,
          cursor: "pointer", fontFamily: "inherit",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          ← Back
        </button>
      )}

      {isLast && (
        <button onClick={onRestart} style={{
          background: "none", border: `1px solid ${C.purple}`,
          borderRadius: 8, padding: "8px 18px",
          fontSize: 13, fontWeight: 600, color: C.purple,
          cursor: "pointer", fontFamily: "inherit",
        }}>
          ↩ Restart
        </button>
      )}

      {!isLast && (
        <button
          onClick={() => canProceed && onNext()}
          disabled={!canProceed}
          title={!canProceed ? "Save or cancel your edits before continuing" : ""}
          style={{
            background: canProceed ? C.purple : C.grey300,
            border: "none", borderRadius: 8, padding: "8px 24px",
            fontSize: 13, fontWeight: 600, color: C.white,
            cursor: canProceed ? "pointer" : "not-allowed",
            fontFamily: "inherit", transition: "background 0.15s",
          }}
        >
          {step === 0 ? "Start →" : "Next →"}
        </button>
      )}
    </div>
  );
}
