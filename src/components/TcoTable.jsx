import { C } from "../data/constants.js";
import { fmt, fmtFull } from "../data/format.js";
import { sectionTotals } from "../data/calculations.js";

function colTemplate(years) {
  return `1fr ${Array(years).fill("108px").join(" ")}`;
}

function SummaryCards({ totals, years, symbol }) {
  const grandTotal = totals.reduce((a, b) => a + b, 0);
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${years}, 1fr) 1fr`, gap: 10, marginBottom: 24 }}>
      {totals.map((v, i) => (
        <div key={i} style={{ background: C.grey50, border: `1px solid ${C.grey100}`, borderRadius: 10, padding: "12px 14px" }}>
          <div style={{ fontSize: 11, color: C.grey500, marginBottom: 4 }}>Year {i + 1}</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.purple, letterSpacing: "-0.02em" }}>{fmt(v, symbol)}</div>
        </div>
      ))}
      <div style={{ background: C.purple, borderRadius: 10, padding: "12px 14px" }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>{years}yr Total</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.white, letterSpacing: "-0.02em" }}>{fmt(grandTotal, symbol)}</div>
      </div>
    </div>
  );
}

function EditableY1Cell({ value, onChange }) {
  return (
    <input
      type="text"
      inputMode="numeric"
      defaultValue={value}
      onBlur={e => {
        const raw = parseInt(e.target.value.replace(/[^0-9]/g, "")) || 0;
        e.target.value = raw.toLocaleString("en-GB");
        onChange(raw);
      }}
      onFocus={e => {
        e.target.value = String(value).replace(/,/g, "");
        e.target.select();
      }}
      style={{
        width: "100%", boxSizing: "border-box",
        border: `1.5px solid ${C.purple}`, borderRadius: 6,
        padding: "4px 6px", fontSize: 12, textAlign: "right",
        fontVariantNumeric: "tabular-nums", fontFamily: "inherit",
        color: C.black, background: "#f5f0ff", outline: "none",
      }}
    />
  );
}

function SectionBlock({ sec, years, editing, draftY1, onDraftChange, symbol }) {
  const COL = colTemplate(years);
  const secTot = Array(years).fill(0);
  sec.rows.forEach(r => r.vals.slice(0, years).forEach((v, i) => { secTot[i] += v; }));

  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{
        display: "grid", gridTemplateColumns: COL,
        padding: "9px 14px", background: sec.bg,
        borderLeft: `4px solid ${sec.color}`,
        borderRadius: "6px 6px 0 0", marginTop: 14,
      }}>
        <div style={{ fontWeight: 700, color: sec.color, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {sec.label}
        </div>
        {Array(years).fill(null).map((_, i) => <div key={i} />)}
      </div>

      {sec.rows.map((row, ri) => {
        const rowKey = `${sec.id}-${ri}`;
        const isEdited = row.edited;
        const y1Draft = draftY1[rowKey] !== undefined ? draftY1[rowKey] : row.vals[0];

        return (
          <div key={ri} style={{
            display: "grid", gridTemplateColumns: COL,
            padding: "8px 14px 8px 18px",
            borderBottom: `1px solid ${C.grey100}`,
            background: isEdited ? "#fdfbff" : ri % 2 === 0 ? C.white : C.grey50,
            borderLeft: `4px solid ${isEdited ? C.purple : sec.color + "22"}`,
            alignItems: "center",
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 13, color: C.grey700, lineHeight: 1.4 }}>{row.label}</span>
                {isEdited && !editing && (
                  <span style={{
                    fontSize: 10, fontWeight: 600, color: C.purple,
                    background: C.purpleLight, borderRadius: 4,
                    padding: "1px 5px", letterSpacing: "0.04em",
                  }}>EDITED</span>
                )}
              </div>
              {row.note && <div style={{ fontSize: 10, color: C.grey300, marginTop: 2 }}>{row.note}</div>}
            </div>

            {row.vals.slice(0, years).map((v, yi) => {
              const isY1 = yi === 0;
              const isFixed = row.fixed;

              // In edit mode: Y1 is editable (unless fixed row), Y2+ show as dimmed calculated
              if (editing && isY1 && !isFixed) {
                return (
                  <div key={yi} style={{ padding: "0 2px" }}>
                    <EditableY1Cell
                      value={y1Draft}
                      onChange={val => onDraftChange(rowKey, val)}
                    />
                  </div>
                );
              }

              // Y2+ in edit mode: show calculated value with subtle indicator
              if (editing && !isY1 && !isFixed) {
                return (
                  <div key={yi} style={{
                    textAlign: "right", fontSize: 12,
                    fontVariantNumeric: "tabular-nums",
                    color: C.grey300,
                    fontStyle: "italic",
                  }}>
                    {fmtFull(v, symbol)}
                  </div>
                );
              }

              // Normal display
              return (
                <div key={yi} style={{
                  textAlign: "right", fontSize: 12, fontVariantNumeric: "tabular-nums",
                  color: isFixed && v > 0 ? C.amber
                       : row.customerActual && v > 0 ? C.green
                       : isEdited ? C.purple
                       : v === 0 ? C.grey300
                       : C.grey700,
                }}>
                  {fmtFull(v, symbol)}
                </div>
              );
            })}
          </div>
        );
      })}

      <div style={{
        display: "grid", gridTemplateColumns: COL,
        padding: "8px 14px", background: sec.bg,
        borderLeft: `4px solid ${sec.color}`,
        borderRadius: "0 0 6px 6px",
      }}>
        <div style={{ fontWeight: 700, color: sec.color, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {sec.label} — Total
        </div>
        {secTot.map((v, i) => (
          <div key={i} style={{ textAlign: "right", fontWeight: 700, color: sec.color, fontSize: 12 }}>
            {fmt(v, symbol)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TcoTable({ sections, years = 5, editState, symbol = "€", upliftPct = 3 }) {
  const totals = sectionTotals(sections, years);
  const COL = colTemplate(years);
  const { editing, isDirty, hasOverrides, draftY1, startEdit, updateDraft, saveEdit, cancelEdit, resetToCalculated } = editState;

  return (
    <div style={{ overflowX: "auto" }}>
      <SummaryCards totals={totals} years={years} symbol={symbol} />

      {/* Edit toolbar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 12, padding: "10px 14px",
        background: editing ? "#f5f0ff" : C.grey50,
        border: `1px solid ${editing ? C.purple : C.grey200}`,
        borderRadius: 8, transition: "all 0.2s",
      }}>
        <div style={{ fontSize: 13, color: editing ? C.purple : C.grey500, fontWeight: editing ? 600 : 400 }}>
          {editing
            ? `✏️ Edit mode — update Year 1 values; Years 2+ recalculate at ${upliftPct}% uplift`
            : hasOverrides
            ? "⚠️ Some Year 1 values have been manually edited"
            : "Values derived from Gartner benchmarks"}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {hasOverrides && !editing && (
            <button onClick={resetToCalculated} style={{
              background: "none", border: `1px solid ${C.grey300}`,
              borderRadius: 6, padding: "6px 14px", fontSize: 12,
              color: C.grey500, cursor: "pointer", fontFamily: "inherit",
            }}>↺ Reset to benchmarks</button>
          )}
          {editing ? (
            <>
              <button onClick={cancelEdit} style={{
                background: "none", border: `1px solid ${C.grey300}`,
                borderRadius: 6, padding: "6px 14px", fontSize: 12,
                color: C.grey500, cursor: "pointer", fontFamily: "inherit",
              }}>Cancel</button>
              <button onClick={saveEdit} style={{
                background: C.purple, border: "none",
                borderRadius: 6, padding: "6px 18px", fontSize: 12,
                fontWeight: 700, color: C.white, cursor: "pointer", fontFamily: "inherit",
              }}>Save changes</button>
            </>
          ) : (
            <button onClick={startEdit} style={{
              background: "none", border: `1px solid ${C.purple}`,
              borderRadius: 6, padding: "6px 18px", fontSize: 12,
              fontWeight: 600, color: C.purple, cursor: "pointer", fontFamily: "inherit",
            }}>✏️ Edit values</button>
          )}
        </div>
      </div>

      {/* Column headers */}
      <div style={{
        display: "grid", gridTemplateColumns: COL,
        padding: "6px 14px", borderBottom: `2px solid ${C.grey200}`,
        fontSize: 11, fontWeight: 700, color: C.grey500,
        letterSpacing: "0.06em", textTransform: "uppercase",
      }}>
        <div>Cost item</div>
        {Array.from({ length: years }, (_, i) => (
          <div key={i} style={{ textAlign: "right" }}>
            Year {i + 1}
            {editing && i === 0 && (
              <div style={{ fontSize: 9, color: C.purple, fontWeight: 700, letterSpacing: "0.04em" }}>EDITABLE</div>
            )}
            {editing && i > 0 && (
              <div style={{ fontSize: 9, color: C.grey300, letterSpacing: "0.04em" }}>AUTO</div>
            )}
          </div>
        ))}
      </div>

      {sections.map(sec => (
        <SectionBlock
          key={sec.id} sec={sec} years={years}
          editing={editing} draftY1={draftY1}
          onDraftChange={updateDraft}
          symbol={symbol}
        />
      ))}

      <div style={{ fontSize: 11, color: C.grey400, marginTop: 10, lineHeight: 1.6 }}>
        {upliftPct}% annual uplift from Year 2. Amber = fixed project costs. Green = customer-provided actuals.
        {hasOverrides ? " Purple = manually edited Year 1 values; subsequent years recalculated." : ""}
        {" "}Benchmarks: Gartner IT Key Metrics Data.
      </div>
    </div>
  );
}
