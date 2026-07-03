import { C } from "../data/constants.js";
import { fmt } from "../data/format.js";
import TcoTable from "./TcoTable.jsx";
import { useEditableTable } from "../hooks/useEditableTable.js";

export default function SaasStep({ sections, prospectName, acvNum, years = 5, upliftPct = 3, symbol = "€", onEditStateChange }) {
  const editState = useEditableTable(sections, years, upliftPct);
  if (onEditStateChange) onEditStateChange(editState.isDirty);

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: C.black, margin: "0 0 4px", letterSpacing: "-0.02em" }}>Infor CloudSuite TCO</h2>
      <p style={{ fontSize: 14, color: C.grey500, marginBottom: 16, marginTop: 0 }}>
        Projected costs for {prospectName || "the prospect"} on Infor CloudSuite{acvNum > 0 ? ` at ${fmt(acvNum, symbol)}/yr ACV` : ""} over {years} years.
        Infrastructure, disaster recovery, and DBA costs are absorbed by the Infor cloud platform.
      </p>
      <TcoTable sections={editState.effectiveSections} years={years} editState={editState} symbol={symbol} upliftPct={upliftPct} />
    </div>
  );
}
