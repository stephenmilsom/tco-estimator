import { C } from "../data/constants.js";
import TcoTable from "./TcoTable.jsx";
import { useEditableTable } from "../hooks/useEditableTable.js";

export default function OnPremStep({ sections, prospectName, hasCustomMaint, years = 5, upliftPct = 3, symbol = "€", onEditStateChange }) {
  const editState = useEditableTable(sections, years, upliftPct);
  if (onEditStateChange) onEditStateChange(editState.isDirty);

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: C.black, margin: "0 0 4px", letterSpacing: "-0.02em" }}>On-Premise TCO</h2>
      <p style={{ fontSize: 14, color: C.grey500, marginBottom: 16, marginTop: 0 }}>
        Benchmark-derived estimates for {prospectName || "the prospect"}'s current on-premise environment over {years} years.
        {hasCustomMaint && <span style={{ color: C.green, fontWeight: 600 }}> Current maintenance overridden with customer-provided actual.</span>}
      </p>
      <TcoTable sections={editState.effectiveSections} years={years} editState={editState} symbol={symbol} upliftPct={upliftPct} />
    </div>
  );
}
